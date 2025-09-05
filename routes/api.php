<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public authentication routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::get('check', [AuthController::class, 'checkAuth']);
    Route::get('check-email', [AuthController::class, 'checkEmail']);
    
    // Social login routes
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
    Route::get('facebook', [AuthController::class, 'redirectToFacebook']);
    Route::get('facebook/callback', [AuthController::class, 'handleFacebookCallback']);
});

// Protected routes requiring authentication
Route::middleware(['auth:api', 'check.activity'])->group(function () {
    
    // User authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
        Route::post('refresh', [AuthController::class, 'refreshToken']);
        Route::post('resend-verification', [AuthController::class, 'resendVerification']);
    });
    
    // Application management routes
    Route::prefix('application')->group(function () {
        Route::post('save-draft', [ApplicationController::class, 'saveDraft']);
        Route::get('load-draft', [ApplicationController::class, 'loadDraft']);
        Route::delete('delete-draft', [ApplicationController::class, 'deleteDraft']);
        Route::post('submit', [ApplicationController::class, 'submitApplication']);
        Route::get('my-applications', [ApplicationController::class, 'getUserApplications']);
        Route::get('drafts-by-type', [ApplicationController::class, 'getDraftsByType']);
        Route::get('my-submissions', [ApplicationController::class, 'getUserSubmissions']);
        Route::get('submission/{applicationId}', [ApplicationController::class, 'getSubmission']);
        Route::get('{id}', [ApplicationController::class, 'getApplication']);
    });
    
    // Admin-only routes
    Route::middleware(['check.role:admin'])->prefix('admin')->group(function () {
        Route::get('dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Admin dashboard data',
                'data' => [
                    'total_applications' => \App\Models\ApplicationSubmission::count(),
                    'pending_review' => \App\Models\ApplicationSubmission::where('status', 'submitted')->count(),
                    'accepted' => \App\Models\ApplicationSubmission::where('status', 'accepted')->count(),
                    'rejected' => \App\Models\ApplicationSubmission::where('status', 'rejected')->count(),
                ],
            ]);
        });
        
        Route::get('applications', function () {
            $applications = \App\Models\ApplicationSubmission::with(['user'])
                ->orderBy('submitted_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $applications,
            ]);
        });
        
        Route::put('applications/{id}/status', function (Request $request, $id) {
            $application = \App\Models\ApplicationSubmission::findOrFail($id);
            
            $request->validate([
                'status' => 'required|in:submitted,review,accepted,rejected',
                'comments' => 'nullable|string',
            ]);
            
            $application->update([
                'status' => $request->status,
                'review_comments' => $request->comments,
                'decision_date' => in_array($request->status, ['accepted', 'rejected']) ? now() : null,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Application status updated successfully',
                'data' => $application,
            ]);
        });
        
        // User management routes
        Route::get('users', function (Request $request) {
            $query = \App\Models\User::with('roles');
            
            // Search functionality
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // Role filter
            if ($request->has('role') && $request->role) {
                $query->whereHas('roles', function($q) use ($request) {
                    $q->where('name', $request->role);
                });
            }
            
            // Status filter (active/inactive based on last activity)
            if ($request->has('status') && $request->status) {
                if ($request->status === 'active') {
                    $query->where('last_activity_at', '>=', now()->subDays(30));
                } elseif ($request->status === 'inactive') {
                    $query->where('last_activity_at', '<', now()->subDays(30))
                          ->orWhereNull('last_activity_at');
                }
            }
            
            // Sort options
            $sortBy = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_direction', 'desc');
            $query->orderBy($sortBy, $sortDirection);
            
            $users = $query->paginate($request->get('per_page', 20));
            
            // Add computed fields
            $users->getCollection()->transform(function ($user) {
                $user->status = $user->last_activity_at && $user->last_activity_at->gt(now()->subDays(30)) ? 'active' : 'inactive';
                $user->role_names = $user->roles->pluck('name')->toArray();
                $user->last_login = $user->last_activity_at ? $user->last_activity_at->diffForHumans() : 'Never';
                return $user;
            });
                
            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        });
        
        Route::put('users/{id}/role', function (Request $request, $id) {
            $user = \App\Models\User::findOrFail($id);
            
            $request->validate([
                'role' => 'required|in:admin,user',
            ]);
            
            // Remove all existing roles and assign new role
            // Ensure role exists for the 'api' guard to avoid guard mismatch errors
            \Spatie\Permission\Models\Role::findOrCreate($request->role, 'api');
            $user->syncRoles([$request->role]);
            
            return response()->json([
                'success' => true,
                'message' => 'User role updated successfully',
                'data' => $user->load('roles'),
            ]);
        });
        
        Route::post('users', function (Request $request) {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:admin,user',
            ]);
            
            $user = \App\Models\User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => \Illuminate\Support\Facades\Hash::make($request->password),
                'email_verified_at' => now(),
            ]);
            
            $user->assignRole($request->role);
            
            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user->load('roles'),
            ]);
        });
        
        Route::delete('users/{id}', function ($id) {
            $user = \App\Models\User::findOrFail($id);
            
            // Prevent deleting the current admin
            if (auth()->id() === $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete your own account',
                ], 400);
            }
            
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        });
        
        // Password reset for users
        Route::post('users/{id}/reset-password', function (Request $request, $id) {
            $user = \App\Models\User::findOrFail($id);
            
            $request->validate([
                'password' => 'required|string|min:8',
            ]);
            
            $user->update([
                'password' => \Illuminate\Support\Facades\Hash::make($request->password)
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);
        });
        
        // Bulk user operations
        Route::post('users/bulk-action', function (Request $request) {
            $request->validate([
                'action' => 'required|in:delete,change-role',
                'user_ids' => 'required|array',
                'user_ids.*' => 'exists:users,id',
                'role' => 'required_if:action,change-role|in:admin,user',
            ]);
            
            $currentUserId = auth()->id();
            $userIds = array_filter($request->user_ids, function($id) use ($currentUserId) {
                return $id != $currentUserId; // Prevent self-modification
            });
            
            if ($request->action === 'delete') {
                \App\Models\User::whereIn('id', $userIds)->delete();
                $message = 'Users deleted successfully';
            } elseif ($request->action === 'change-role') {
                $users = \App\Models\User::whereIn('id', $userIds)->get();
                foreach ($users as $user) {
                    $user->syncRoles([$request->role]);
                }
                $message = 'User roles updated successfully';
            }
            
            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        });
        
        // Get user activity logs
        Route::get('users/{id}/activity', function ($id) {
            $user = \App\Models\User::findOrFail($id);
            
            // For now, return basic info. In a real app, you'd have an activity log table
            $activities = [
                [
                    'action' => 'Login',
                    'timestamp' => $user->last_activity_at,
                    'ip_address' => '192.168.1.1', // Would come from actual tracking
                    'user_agent' => 'Chrome/91.0', // Would come from actual tracking
                ],
                [
                    'action' => 'Account Created',
                    'timestamp' => $user->created_at,
                    'ip_address' => '192.168.1.1',
                    'user_agent' => 'Chrome/91.0',
                ]
            ];
            
            return response()->json([
                'success' => true,
                'data' => $activities,
            ]);
        });
        
        // Get user statistics
        Route::get('users/stats', function () {
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => \App\Models\User::count(),
                    'active_users' => \App\Models\User::where('last_activity_at', '>=', now()->subDays(30))->count(),
                    'inactive_users' => \App\Models\User::where('last_activity_at', '<', now()->subDays(30))->orWhereNull('last_activity_at')->count(),
                    'admin_users' => \App\Models\User::whereHas('roles', function($q) {
                        $q->where('name', 'admin');
                    })->count(),
                    'regular_users' => \App\Models\User::whereHas('roles', function($q) {
                        $q->where('name', 'user');
                    })->count(),
                    'new_users_this_month' => \App\Models\User::whereMonth('created_at', now()->month)->count(),
                ],
            ]);
        });
        // Payment References management
        Route::get('payment-references', function () {
            return response()->json([
                'success' => true,
                'data' => DB::table('payment_references')->orderBy('created_at', 'desc')->paginate(50),
            ]);
        });
        // CSV import (multipart/form-data with file=... CSV having one reference per line or a column named 'reference')
        Route::post('payment-references/import', function (Request $request) {
            $request->validate([
                'file' => 'required|file|max:10240',
            ]);

            $file = $request->file('file');
            $path = $file->getRealPath();
            $handle = fopen($path, 'r');
            if (!$handle) {
                return response()->json(['success' => false, 'message' => 'Unable to read CSV file'], 400);
            }

            $header = null;
            $count = 0; $skipped = 0;
            while (($row = fgetcsv($handle)) !== false) {
                if ($header === null) {
                    $header = array_map(fn($h) => strtolower(trim($h)), $row);
                    // If single-column CSV without header, treat row as data
                    if (count($header) === 1 && !preg_match('/reference/i', $header[0])) {
                        // process this row as first data line
                        $ref = trim($row[0]);
                        if ($ref !== '') {
                            DB::table('payment_references')->updateOrInsert(
                                ['reference' => $ref],
                                ['status' => 'unused', 'updated_at' => now(), 'created_at' => now()]
                            );
                            $count++;
                        } else { $skipped++; }
                        $header = ['reference'];
                    }
                    continue;
                }
                $reference = null;
                if (count($row) === 1) {
                    $reference = trim($row[0]);
                } else {
                    $idx = array_search('reference', $header);
                    if ($idx !== false && isset($row[$idx])) {
                        $reference = trim($row[$idx]);
                    }
                }
                if ($reference) {
                    DB::table('payment_references')->updateOrInsert(
                        ['reference' => $reference],
                        ['status' => 'unused', 'updated_at' => now(), 'created_at' => now()]
                    );
                    $count++;
                } else {
                    $skipped++;
                }
            }
            fclose($handle);

            return response()->json([
                'success' => true,
                'message' => "Imported/updated {$count} references (skipped {$skipped}).",
            ]);
        });
        Route::patch('payment-references/{id}', function (Request $request, $id) {
            $request->validate([
                'status' => 'nullable|in:unused,flagged,used',
                'notes' => 'nullable|string',
            ]);
            $payload = array_filter([
                'status' => $request->status,
                'notes' => $request->notes,
                'updated_at' => now(),
            ], fn($v) => !is_null($v));
            DB::table('payment_references')->where('id', $id)->update($payload);
            return response()->json(['success' => true]);
        });
        
        // Payment statistics and verified users
        Route::get('payments/stats', [AdminController::class, 'getPaymentStats']);
        Route::get('verified-users', [AdminController::class, 'getVerifiedUsers']);
        Route::get('payment-reference-stats', [AdminController::class, 'getPaymentReferenceStats']);
        
        // Application review
        Route::get('verified-applications', [AdminController::class, 'getVerifiedApplications']);
        Route::put('applications/{id}/status', [AdminController::class, 'updateApplicationStatus']);
    });
    

});

// Document upload routes
Route::middleware(['auth:api'])->group(function () {
    // Upload passport photo for application draft
    Route::post('application/draft/passport-photo', function (Request $request) {
        try {
            // Basic validation without MIME type checking
            if (!$request->hasFile('file')) {
                return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
            }
            
            $file = $request->file('file');
            $applicationType = $request->input('application_type', 'undergraduate');
            
            // Check file size (5MB max)
            if ($file->getSize() > 5120 * 1024) {
                return response()->json(['success' => false, 'message' => 'File too large. Maximum size is 5MB'], 400);
            }
            
            $user = $request->user();
            
            // Generate unique filename
            $filename = 'passport_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('documents/passport-photos', $filename, 'public');
            
            // Update or create application draft
            $draft = \App\Models\ApplicationDraft::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'application_type' => $applicationType
                ],
                [
                    'passport_photo_path' => $path,
                    'last_saved_at' => now()
                ]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Passport photo uploaded successfully',
                'data' => [
                    'file_path' => $path,
                    'file_url' => asset('storage/' . $path),
                    'filename' => $filename
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    });
    
    // Simple file upload endpoint (bypasses Flare issues)
    Route::post('upload/passport-photo', function (Request $request) {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
            }
            
            $file = $request->file('file');
            $applicationType = $request->input('application_type', 'undergraduate');
            
            // Check file size (5MB max)
            if ($file->getSize() > 5120 * 1024) {
                return response()->json(['success' => false, 'message' => 'File too large. Maximum size is 5MB'], 400);
            }
            
            $user = $request->user();
            
            // Generate unique filename
            $filename = 'passport_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('documents/passport-photos', $filename, 'public');
            
            // Update or create application draft
            $draft = \App\Models\ApplicationDraft::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'application_type' => $applicationType
                ],
                [
                    'passport_photo_path' => $path,
                    'last_saved_at' => now()
                ]
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Passport photo uploaded successfully',
                'data' => [
                    'file_path' => $path,
                    'file_url' => asset('storage/' . $path),
                    'filename' => $filename
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    });
    
    // Get passport photo for application draft
    Route::get('application/draft/passport-photo/{application_type}', function (Request $request, $applicationType) {
        $user = $request->user();
        
        $draft = \App\Models\ApplicationDraft::where('user_id', $user->id)
            ->where('application_type', $applicationType)
            ->first();
            
        if (!$draft || !$draft->passport_photo_path) {
            return response()->json([
                'success' => false,
                'message' => 'No passport photo found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'file_path' => $draft->passport_photo_path,
                'file_url' => asset('storage/' . $draft->passport_photo_path)
            ]
        ]);
    });
    
    // Delete passport photo from application draft
    Route::delete('application/draft/passport-photo/{application_type}', function (Request $request, $applicationType) {
        $user = $request->user();
        
        $draft = \App\Models\ApplicationDraft::where('user_id', $user->id)
            ->where('application_type', $applicationType)
            ->first();
            
        if (!$draft || !$draft->passport_photo_path) {
            return response()->json([
                'success' => false,
                'message' => 'No passport photo found'
            ], 404);
        }
        
        // Delete file from storage
        if (\Storage::disk('public')->exists($draft->passport_photo_path)) {
            \Storage::disk('public')->delete($draft->passport_photo_path);
        }
        
        // Update database
        $draft->update(['passport_photo_path' => null]);
        
        return response()->json([
            'success' => true,
            'message' => 'Passport photo deleted successfully'
        ]);
    });
});

// Admin routes for viewing applicant documents
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Get passport photo for specific application submission
    Route::get('admin/application/{submission_id}/passport-photo', function (Request $request, $submissionId) {
        $submission = \App\Models\ApplicationSubmission::findOrFail($submissionId);
        
        if (!$submission->passport_photo_path) {
            return response()->json([
                'success' => false,
                'message' => 'No passport photo found for this application'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => [
                'file_path' => $submission->passport_photo_path,
                'file_url' => asset('storage/' . $submission->passport_photo_path),
                'applicant_name' => $submission->first_name . ' ' . $submission->surname,
                'application_type' => $submission->application_type
            ]
        ]);
    });
    
    // List all applications with passport photos
    Route::get('admin/applications/with-photos', function (Request $request) {
        $applications = \App\Models\ApplicationSubmission::whereNotNull('passport_photo_path')
            ->select('id', 'first_name', 'surname', 'application_type', 'passport_photo_path', 'created_at')
            ->orderBy('created_at', 'desc')
            ->paginate(20);
            
        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    });
});

// Health check route
Route::get('health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString(),
    ]);
}); 