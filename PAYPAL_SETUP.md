# PayPal Integration Setup

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# PayPal Configuration
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
VITE_PAYPAL_ENVIRONMENT=sandbox

# API Configuration (if needed)
VITE_API_BASE_URL=http://localhost:3000/api
```

## PayPal Setup Steps

1. **Create PayPal Developer Account**
   - Go to [PayPal Developer Portal](https://developer.paypal.com/)
   - Sign in with your PayPal account or create a new one

2. **Create a New App**
   - Navigate to "My Apps & Credentials"
   - Click "Create App"
   - Choose "Default Application" or "Web Application"
   - Select "Sandbox" for testing or "Live" for production

3. **Get Client ID**
   - Copy the "Client ID" from your app
   - Add it to your `.env` file as `VITE_PAYPAL_CLIENT_ID`

4. **Test with Sandbox**
   - Use sandbox credentials for testing
   - Test payments with PayPal sandbox accounts
   - Switch to production when ready

## Testing

- The integration uses PayPal's sandbox environment by default
- Test payments will not charge real money
- Use PayPal sandbox test accounts for testing

## Production Deployment

- Update `VITE_PAYPAL_ENVIRONMENT=production` for live payments
- Use your live PayPal app's Client ID
- Ensure your domain is approved in PayPal's app settings
