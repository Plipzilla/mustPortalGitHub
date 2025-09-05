<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EmailVerificationToken;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Carbon\Carbon;
use Illuminate\Support\Str;
use App\Mail\EmailVerificationMail;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        try {
            // Fix for JSON parsing issue - if request->all() is empty but content exists, parse manually  
            $requestData = $request->all();
            if (empty($requestData) && $request->getContent()) {
                $content = $request->getContent();
                
                // Fix triple-escaped JSON - remove extra escaping
                $cleanContent = $content;
                
                // If the content starts and ends with quotes and has escaped quotes inside, it's double-escaped
                if (preg_match('/^".*"$/', $content) && strpos($content, '\\"') !== false) {
                    // Remove outer quotes and unescape the content
                    $cleanContent = substr($content, 1, -1); // Remove outer quotes
                    $cleanContent = stripslashes($cleanContent); // Remove escape slashes
                }
                
                // Try to decode the JSON manually
                $decodedData = json_decode($cleanContent, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decodedData)) {
                    $requestData = $decodedData;
                }
            }
            
            $validator = Validator::make($requestData, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'date_of_birth' => 'nullable|date',
                'gender' => 'nullable|in:male,female,other',
                'nationality' => 'nullable|string|max:100',
                'address' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $requestData['first_name'] . ' ' . $requestData['last_name'],
                'email' => $requestData['email'],
                'password' => Hash::make($requestData['password']),
                // Do not auto-verify on email/password registrations
                'email_verified_at' => null,
            ]);

            // Assign default role
            $user->assignRole('user');
            
            // Load user roles for frontend
            $user->load('roles');

            // Send verification email
            $this->sendVerificationEmail($user);

            // Create token for immediate login (unverified state)
            $token = $user->createToken('auth_token')->accessToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully. Please verify your email to activate your account.',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 1800 // 30 minutes
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate and send verification email to the specified user.
     */
    private function sendVerificationEmail(User $user): void
    {
        // Invalidate existing tokens for this user
        EmailVerificationToken::where('user_id', $user->id)->delete();

        // Generate a new secure token
        $token = Str::random(64);

        // Create token record with 24-hour expiry
        EmailVerificationToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addDay(),
        ]);

        // Build verification URL (public web route redirects to frontend)
        $frontendBase = config('app.frontend_url', 'http://localhost:3000');
        $verifyWebUrl = url("/verify-email/{$token}");

        // Send email (do not fail registration if mailer is misconfigured)
        try {
            Mail::to($user->email)->send(new EmailVerificationMail($user, $verifyWebUrl, $frontendBase));
        } catch (\Throwable $e) {
            \Log::error('Failed to send verification email', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
            // Intentionally swallow to avoid 500 during registration/resend
        }
    }

    /**
     * Resend verification email to current authenticated user.
     */
    public function resendVerification(Request $request)
    {
        try {
            /** @var User $user */
            $user = $request->user();

            if ($user->email_verified_at) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email is already verified.',
                ], 400);
            }

            $this->sendVerificationEmail($user);

            return response()->json([
                'success' => true,
                'message' => 'Verification email resent successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend verification email',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Public web endpoint to verify email by token, then redirect to frontend.
     */
    public function verifyEmailWeb($token)
    {
        $frontendBase = config('app.frontend_url', 'http://localhost:3000');

        try {
            $record = EmailVerificationToken::where('token', $token)->first();

            if (!$record) {
                return redirect()->away($frontendBase . '/verify-account?status=invalid');
            }

            if ($record->used_at) {
                return redirect()->away($frontendBase . '/verify-account?status=used');
            }

            if ($record->expires_at && $record->expires_at->isPast()) {
                return redirect()->away($frontendBase . '/verify-account?status=expired');
            }

            $user = User::find($record->user_id);
            if (!$user) {
                return redirect()->away($frontendBase . '/verify-account?status=invalid');
            }

            // Mark user as verified
            $user->email_verified_at = now();
            $user->save();

            // Mark token as used and cleanup others
            $record->used_at = now();
            $record->save();
            EmailVerificationToken::where('user_id', $user->id)->where('id', '!=', $record->id)->delete();

            return redirect()->away($frontendBase . '/verify-account?status=success');
        } catch (\Exception $e) {
            return redirect()->away($frontendBase . '/verify-account?status=error');
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = Auth::user();
            
            // Load user roles for proper admin detection
            $user->load('roles');
            
            // Update last activity
            $user->update(['last_activity_at' => now()]);

            // Create token
            $token = $user->createToken('auth_token')->accessToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => 1800 // 30 minutes
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->token()->revoke();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user();
            $user->load('roles');

            return response()->json([
                'success' => true,
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check authentication status
     */
    public function checkAuth(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not authenticated'
                ], 401);
            }

            // Load user roles for proper admin detection
            $user->load('roles');

            // Update last activity
            $user->update(['last_activity_at' => now()]);

            return response()->json([
                'success' => true,
                'user' => $user,
                'authenticated' => true
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication check failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if an email already exists
     */
    public function checkEmail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email'
            ]);

            $exists = User::where('email', $request->email)->exists();

            return response()->json([
                'success' => true,
                'exists' => $exists,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check email',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        try {
            return Socialite::driver('google')->stateless()->redirect();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Google OAuth redirect failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = $this->findOrCreateUser($googleUser, 'google');
            
            // Create token
            $token = $user->createToken('auth_token')->accessToken;

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            
            return redirect()->away("{$frontendUrl}/auth/callback?token={$token}&user=" . urlencode(json_encode($user)));

        } catch (\Exception $e) {
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/login?error=" . urlencode('Google login failed. Please try again.'));
        }
    }

    /**
     * Redirect to Facebook OAuth
     */
    public function redirectToFacebook()
    {
        try {
            return Socialite::driver('facebook')->stateless()->redirect();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Facebook OAuth redirect failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle Facebook OAuth callback
     */
    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            
            $user = $this->findOrCreateUser($facebookUser, 'facebook');
            
            // Create token
            $token = $user->createToken('auth_token')->accessToken;

            // Redirect to frontend with token
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            
            return redirect()->away("{$frontendUrl}/auth/callback?token={$token}&user=" . urlencode(json_encode($user)));

        } catch (\Exception $e) {
            $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/login?error=" . urlencode('Facebook login failed. Please try again.'));
        }
    }

    /**
     * Find or create user from OAuth provider
     */
    private function findOrCreateUser($socialUser, $provider)
    {
        // First, check if user exists with this provider and provider_id
        $user = User::where('provider', $provider)
                   ->where('provider_id', $socialUser->getId())
                   ->first();

        if ($user) {
            // Update user information and avatar
            $user->update([
                'name' => $socialUser->getName(),
                'avatar' => $socialUser->getAvatar(),
                'last_activity_at' => now(),
            ]);
            
            $user->load('roles');
            return $user;
        }

        // Check if user exists with the same email but different provider
        $existingUser = User::where('email', $socialUser->getEmail())->first();

        if ($existingUser) {
            // Link this OAuth account to existing user
            $existingUser->update([
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
                'avatar' => $socialUser->getAvatar() ?: $existingUser->avatar,
                'last_activity_at' => now(),
            ]);
            
            $existingUser->load('roles');
            return $existingUser;
        }

        // Create new user
        $newUser = User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(),
            'last_activity_at' => now(),
        ]);

        // Assign default role
        $newUser->assignRole('user');
        
        // Load user roles for frontend
        $newUser->load('roles');

        return $newUser;
    }
} 