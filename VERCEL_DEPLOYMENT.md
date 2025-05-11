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

### 2. Stripe Configuration (if using payments)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 3. NextAuth Configuration (if using authentication)
```
NEXTAUTH_URL=https://your-deployed-url.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

### 4. Site URL
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

## Post-Deployment Verification

After deploying, verify that the following features are working:

1. User registration and login
2. Order creation and checkout process
3. Account page with order display
4. API endpoints for order management

If you encounter any issues not covered by this guide, check the application logs in the Vercel dashboard.