# OAuth Setup Guide for MUST E-Portal

This guide explains how to set up Google and Facebook OAuth authentication for the MUST E-Portal system.

## Prerequisites

1. Laravel Socialite is already installed in this project
2. Database migrations for OAuth are already configured
3. Backend routes and controllers are implemented

## Environment Configuration

Add the following environment variables to your `.env` file in the backend directory:

```env
# Frontend Application URL
FRONTEND_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/api/auth/facebook/callback
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "MUST E-Portal"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (frontend URL)
     - `http://localhost:8000` (backend URL)
   - Authorized redirect URIs:
     - `http://localhost:8000/api/auth/google/callback`
5. Copy the Client ID and Client Secret to your `.env` file

## Facebook OAuth Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app:
   - App Type: "Consumer"
   - App Name: "MUST E-Portal"
3. Add Facebook Login product:
   - Go to "Products" > "Facebook Login" > "Settings"
   - Valid OAuth Redirect URIs:
     - `http://localhost:8000/api/auth/facebook/callback`
4. Get your App ID and App Secret:
   - Go to "Settings" > "Basic"
   - Copy App ID and App Secret to your `.env` file as:
     - `FACEBOOK_CLIENT_ID=your_app_id`
     - `FACEBOOK_CLIENT_SECRET=your_app_secret`

## Testing OAuth Integration

1. Start the Laravel backend:
   ```bash
   cd backend
   C:\xampp\php\php.exe artisan serve --host=0.0.0.0 --port=8000
   ```

2. Start the React frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Visit `http://localhost:3000/login`
4. Click "Continue with Google" or "Continue with Facebook"
5. Complete the OAuth flow
6. You should be redirected back to the appropriate dashboard

## How OAuth Flow Works

1. User clicks "Continue with Google/Facebook" button
2. Frontend redirects to Laravel backend OAuth endpoint
3. Backend redirects to Google/Facebook OAuth authorization
4. User authorizes the application
5. Google/Facebook redirects back to Laravel callback
6. Laravel processes the OAuth response and creates/updates user
7. Laravel redirects to frontend with JWT token and user data
8. Frontend OAuth callback component handles the response
9. User is automatically logged in and redirected to dashboard

## Database Schema

The OAuth integration uses the following user table fields:
- `provider` (string, nullable) - "google", "facebook", or null for email registration
- `provider_id` (string, nullable) - OAuth provider's user ID
- `avatar` (string, nullable) - Profile picture URL from OAuth provider

## Security Features

- **Stateless Authentication**: Uses Laravel Passport JWT tokens
- **Account Linking**: OAuth accounts are linked to existing email accounts
- **Role Preservation**: Existing user roles are maintained when linking OAuth
- **Avatar Sync**: Profile pictures are automatically updated from OAuth providers
- **Session Management**: OAuth logins integrate with existing session timeout logic

## Troubleshooting

### "OAuth redirect URI mismatch"
- Ensure the redirect URIs in Google/Facebook developer consoles match exactly with your `.env` configuration
- Make sure there are no trailing slashes in the URLs

### "Client ID not found"
- Verify your `.env` file has the correct `GOOGLE_CLIENT_ID` and `FACEBOOK_CLIENT_ID`
- Restart your Laravel server after updating `.env`

### "Callback URL not working"
- Ensure your Laravel backend is running on the correct port (8000)
- Check that your routes are properly configured
- Verify CORS settings if experiencing cross-origin issues

### "Token not working in frontend"
- Check that `FRONTEND_URL` in backend `.env` matches your React app URL
- Ensure the OAuth callback component is properly imported in App.tsx

## Support

For additional support with OAuth setup, refer to:
- [Laravel Socialite Documentation](https://laravel.com/docs/10.x/socialite)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/) 