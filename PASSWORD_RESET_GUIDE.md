# 🔐 Password Reset Flow Documentation

## Overview
This guide explains how the password reset functionality works in the Furniture Rental application.

## Flow Diagram

```
User clicks "Forgot Password"
         ↓
User enters email
         ↓
POST /api/auth/forgot-password
         ↓
Backend checks if user exists
         ↓
Generates crypto token (32 bytes hex)
         ↓
Saves token to PasswordReset collection
         ↓
Sends reset email with link
         ↓
User clicks link in email
         ↓
GET /api/auth/verify-reset-token
         ↓
Token verified → Show Reset Form
         ↓
User enters new password
         ↓
POST /api/auth/reset-password
         ↓
Token validated + password hashed
         ↓
Token marked as used (deleted)
         ↓
Success! Redirect to login
```

## API Endpoints

### 1. Forgot Password
**POST** `/api/auth/forgot-password`

Request Body:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### 2. Verify Reset Token
**GET** `/api/auth/verify-reset-token?token=abc123`

Response:
```json
{
  "success": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

### 3. Reset Password
**POST** `/api/auth/reset-password`

Request Body:
```json
{
  "token": "abc123",
  "newPassword": "newPassword123"
}
```

Response:
```json
{
  "success": true,
  "message": "Password has been reset successfully. Please login with your new password."
}
```

## Database Schema

### PasswordReset Model
```javascript
{
  user: ObjectId,        // Reference to User
  token: String,         // 64-char hex token
  expiresAt: Date,     // 15 minutes from creation
  isUsed: Boolean,     // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- Auto-expires tokens after 15 minutes
- Prevents token reuse with `isUsed` flag
- Cleans up expired tokens automatically

## Frontend Pages

### 1. ForgotPassword.jsx
- URL: `/forgot-password`
- Shows email input form
- Handles API call to request reset
- Shows success message (security: same message whether email exists or not)

### 2. ResetPassword.jsx
- URL: `/reset-password?token=abc123`
- Verifies token on mount
- Shows form for new password + confirm password
- Password validation (min 8 chars, match confirmation)
- Success state with auto-redirect to login
- Invalid token state with option to request new link

## Email Configuration

### Environment Variables (`.env`)
```
# Gmail SMTP
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OR Resend (Alternative)
# EMAIL_SERVICE=resend
# RESEND_API_KEY=re_xxxxxxxx

FRONTEND_URL=http://localhost:5173
```

### Gmail App Password Setup
1. Go to Google Account Settings
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Generate
4. Select "Mail" and device
5. Copy the 16-character password
6. Use in `EMAIL_PASS` (without spaces)

### Resend Setup (Alternative)
1. Sign up at https://resend.com
2. Get API key from dashboard
3. Update email config to use Resend
4. Verify domain or use resend test domain

## Security Features

1. **Token Expiry**: All tokens expire after 15 minutes
2. **Single Use**: Tokens can only be used once
3. **No Email Enumeration**: Same response whether email exists or not
4. **Secure Token Generation**: Uses `crypto.randomBytes(32)` for cryptographically secure tokens
5. **Password Hashing**: New passwords are hashed with bcrypt (same as registration)
6. **Token Cleanup**: Used/expired tokens are automatically cleaned up

## Troubleshooting

### Emails Not Sending
- Check EMAIL_PASS is correct (Gmail app password, not regular password)
- Verify less secure app access or use app passwords
- Check spam folder
- Check server logs for email errors

### Token Invalid/Expired
- Links expire after 15 minutes
- User may have clicked link twice (single use)
- Check MongoDB `passwordresets` collection

### Frontend Not Working
- Ensure ResetPassword.jsx is imported in App.jsx
- Check URL parameter `?token=` is being passed
- Verify API is running and accessible

## Testing the Flow

```bash
# 1. Request password reset
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 2. Check email or database for token
# Look in MongoDB: db.passwordresets.find()

# 3. Verify token
curl http://localhost:5000/api/auth/verify-reset-token?token=YOUR_TOKEN

# 4. Reset password
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN", "newPassword": "newpass123"}'
```

## Files Created/Modified

- ✅ `backend/models/passwordReset.model.js` - Token storage
- ✅ `backend/controllers/auth.controller.js` - Forgot/Reset logic
- ✅ `backend/routes/auth.routes.js` - API endpoints
- ✅ `backend/services/email.service.js` - Email template (already existed)
- ✅ `frontend/src/pages/ResetPassword.jsx` - Reset form UI
- ✅ `frontend/src/App.jsx` - Route added
- ✅ `frontend/src/pages/ForgotPassword.jsx` - Already existed

## Next Steps

1. Configure email credentials in `.env`
2. Test the complete flow end-to-end
3. Customize email templates in `email.service.js`
4. Add rate limiting for forgot-password endpoint
5. Consider adding CAPTCHA to prevent abuse
