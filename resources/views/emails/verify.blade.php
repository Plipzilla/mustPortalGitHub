<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="background-color: #003366; color: #ffffff; padding: 16px 24px;">
                <h2 style="margin: 0;">MUST E-Admission Portal</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 24px; color: #333333;">
                <h3 style="margin-top: 0;">Verify your email address</h3>
                <p>Hello {{ $user->name }},</p>
                <p>Thank you for registering. Please confirm that <strong>{{ $user->email }}</strong> is your email address by clicking the button below:</p>

                <p style="text-align: center; margin: 28px 0;">
                    <a href="{{ $verifyUrl }}" style="display: inline-block; background-color: #4CAF50; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none;">Verify Email</a>
                </p>

                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #555;">{{ $verifyUrl }}</p>

                <p>This link will expire in 24 hours. If it expires, you can request a new one from your account.</p>
                <p style="margin-top: 28px;">If you did not create an account, you can safely ignore this email.</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f0f0; color: #777; padding: 12px 24px; font-size: 12px; text-align: center;">
                &copy; {{ date('Y') }} MUST E-Admission Portal
            </td>
        </tr>
    </table>
</body>
</html>


