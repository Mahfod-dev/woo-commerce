# Deployment Guide for Vercel

This guide explains how to properly deploy this application on Vercel to ensure all functionality works correctly.

## Required Environment Variables

Make sure to add the following environment variables in your Vercel project settings:

### 1. Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. WooCommerce Configuration
```
NEXT_PUBLIC_URL_WORDPRESS=https://selectura.shop
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY=your-consumer-key
NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET=your-consumer-secret
```

### 3. Stripe Configuration (if using payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 4. NextAuth Configuration (if using authentication)
```
NEXTAUTH_URL=https://your-deployed-url.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

### 5. Site URL
```
NEXT_PUBLIC_SITE_URL=https://your-deployed-url.vercel.app
```

## Deployment Steps

1. Make sure all required environment variables are configured in Vercel
2. Deploy from your main branch with the following configuration:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Troubleshooting Common Issues

### Missing Functionality
If some features are not working despite successful deployment:

1. **Check Environment Variables**: Ensure all required variables are correctly set in Vercel
2. **Verify API Routes**: Confirm API routes are included in the deployment
3. **Inspect Build Logs**: Look for any warnings or errors during build
4. **Clear Cache and Redeploy**: Try a fresh deployment with cleared cache

### CORS Issues with WooCommerce API
If you're seeing CORS errors in the browser console:

1. **Update WooCommerce CORS Settings**:
   - Log in to your WordPress admin panel
   - Navigate to WooCommerce → Settings → Advanced → REST API
   - Add `https://www.selectura.co` to the allowed origins list
   - If using a plugin for CORS, update its settings accordingly

2. **Check Network Requests**:
   - In your browser developer tools, look at the network requests
   - Verify the `Origin` header is being sent correctly
   - Check for preflight OPTIONS requests that might be failing

### Missing Images
If placeholder images or product images are not displaying:

1. **Ensure Public Directory is Deployed**:
   - Make sure your `/public` directory is included in your deployment
   - Check that image paths are correct in your code
   - Try adding a `public/_redirects` file to handle image redirects

2. **Check Image URLs**:
   - Images from WooCommerce might have different URLs in production
   - If using relative URLs, they might need to be changed to absolute URLs

### Database Connection Issues
If experiencing issues with Supabase connection:

1. Verify the Supabase URL and API keys are correct
2. Ensure your IP is not blocked by any firewall rules in Supabase
3. Check that the database schema matches what your application expects

### Authentication Problems
If users cannot login or register:

1. Verify NextAuth is properly configured
2. Check that authentication-related API routes are working
3. Ensure your Supabase Auth settings match your application

### Product Fetching Issues
If products cannot be fetched from WooCommerce:

1. Verify your WooCommerce consumer keys have the correct permissions
2. Check that your API URL is accessible from your deployment environment
3. Ensure the WooCommerce REST API is enabled on your WordPress site
4. Add console logs to debug API requests and responses

## Post-Deployment Verification

After deploying, verify that the following features are working:

1. User registration and login
2. Order creation and checkout process
3. Account page with order display
4. API endpoints for order management

If you encounter any issues not covered by this guide, check the application logs in the Vercel dashboard.