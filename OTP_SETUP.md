# OTP System Setup Guide

## Environment Configuration

To use the OTP system, you need to create a `.env.local` file in your project root with the following variables:

```env
# SMS API Configuration
# Get your API key from https://2factor.in/
VITE_SMS_API_KEY=your_actual_api_key_here

# Application Configuration
VITE_APP_NAME=InvenEase
VITE_APP_VERSION=1.0.0

# Development Configuration (Optional)
VITE_DEV_MODE=true
VITE_SHOW_DEV_OTP=true  # Only works in development mode
```

## Getting SMS API Key

1. Visit [2factor.in](https://2factor.in/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Replace `your_actual_api_key_here` with your real API key

## Environment Detection

The system now properly detects environments:

- **Development Mode**: `import.meta.env.DEV === true`
- **Production Mode**: `import.meta.env.PROD === true`
- **SMS API Available**: `VITE_SMS_API_KEY` is configured

## OTP System Features

### ✅ Fixed Issues
- **Proper environment detection** - Now correctly identifies development vs production
- **Production SMS enforcement** - Production mode requires working SMS service
- **Secure failure modes** - No OTP exposure when SMS fails in production
- **Removed hardcoded API key** - Now uses environment variables
- **Secure OTP storage** - OTPs are stored with expiration and attempt limits
- **6-digit OTPs** - More secure than 4-digit codes
- **Rate limiting** - Prevents spam OTP requests
- **Expiration handling** - OTPs expire after 5 minutes
- **Attempt tracking** - Maximum 3 verification attempts
- **Resend functionality** - Users can request new OTPs with cooldown
- **Better error handling** - Clear error messages for users

### 🔧 Configuration Options

```typescript
const OTP_CONFIG = {
  LENGTH: 6,                    // OTP length (6 digits)
  EXPIRY_MINUTES: 5,           // OTP expiration time
  MAX_ATTEMPTS: 3,             // Maximum verification attempts
  RESEND_COOLDOWN_MINUTES: 1   // Cooldown between resend requests
};
```

### 📱 Usage

The OTP system is now integrated into:
- **Sign In Page** - Phone verification for existing users
- **Sign Up Page** - Phone verification for new accounts
- **Settings Page** - Phone number updates and 2FA

## Production vs Development Behavior

### **Development Mode**
- ✅ Generates local OTPs when SMS fails
- ✅ Shows development OTP codes for testing
- ✅ Graceful degradation without SMS service
- ✅ Works without API key configuration

### **Production Mode**
- ❌ **NEVER shows development OTPs**
- ❌ **Fails securely when SMS delivery fails**
- ❌ **Requires valid SMS API key**
- ❌ **No fallback to local OTP generation**

## 🚀 Production Deployment

For production, ensure:
1. **Valid SMS API key** is configured (`VITE_SMS_API_KEY`)
2. **Environment variables** are properly set
3. **Build environment** is set to production (`npm run build`)
4. **Database storage** replaces in-memory storage
5. **Rate limiting** is configured on the server
6. **Monitoring** is set up for OTP delivery

## Testing

### **Development Testing**
1. Start the development server: `npm run dev`
2. Navigate to sign-in or sign-up pages
3. Enter a phone number to test OTP functionality
4. Check console for OTP codes (when `VITE_SHOW_DEV_OTP=true`)

### **Production Testing**
1. Build the application: `npm run build`
2. Deploy to production environment
3. Ensure `VITE_SMS_API_KEY` is set
4. Test with real phone numbers
5. Verify SMS delivery works

## Security Notes

- OTPs are never logged or stored in plain text
- Failed attempts are tracked and limited
- Resend requests have cooldown periods
- OTPs expire automatically
- Phone numbers are validated before sending OTPs
- **Production mode enforces SMS-only operation**
- **No development fallbacks in production**

## Troubleshooting

### **Production Issues**
- Check if `VITE_SMS_API_KEY` is configured
- Verify SMS API service is working
- Check environment variables are loaded
- Ensure build is in production mode

### **Development Issues**
- Check if `VITE_SHOW_DEV_OTP=true` is set
- Verify development server is running
- Check console for environment detection logs
