# Netlify Deployment Guide

## Setting Up Environment Variables in Netlify

When deploying to Netlify, you need to set environment variables in the Netlify dashboard.

### Steps:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

### Required Environment Variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_EMAILJS_TEMPLATE_BOOKING_RECEIVED=your_template_id
VITE_EMAILJS_TEMPLATE_BOOKING_CONFIRMED=your_template_id

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

# AccuWeather (for Netlify Function - use without VITE_ prefix)
ACCUWEATHER_API_KEY=your_accuweather_key
# OR keep VITE_ prefix for the function to use
VITE_ACCUWEATHER_API_KEY=your_accuweather_key

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_key
```

### Important Notes:

1. **AccuWeather API Key**: The Netlify function can access environment variables with or without the `VITE_` prefix. Set `ACCUWEATHER_API_KEY` or `VITE_ACCUWEATHER_API_KEY`.

2. **Netlify Functions**: The weather proxy function will automatically handle CORS issues by proxying requests through Netlify's server.

3. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`
   - These are already configured in `netlify.toml`

## Deployment Steps:

1. **Connect your repository to Netlify**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Set environment variables** (as shown above)

3. **Deploy**
   - Netlify will automatically build and deploy
   - The build process runs `npm run build`
   - Your app will be available at `https://your-site-name.netlify.app`

## Testing After Deployment:

1. ✅ Check that the map loads correctly
2. ✅ Test the weather widget (should work via Netlify function)
3. ✅ Test form submissions
4. ✅ Test admin login
5. ✅ Verify Firebase Analytics is tracking

## Troubleshooting:

- **Weather widget not loading**: Check that `ACCUWEATHER_API_KEY` is set in Netlify environment variables
- **CORS errors**: Should not occur in production as we're using Netlify Functions
- **Function errors**: Check Netlify Functions logs in the dashboard

