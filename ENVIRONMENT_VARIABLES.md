# Environment Variables Required for Netlify Deployment

## 🔧 Required Environment Variables

You **MUST** add these environment variables in your Netlify dashboard:

### 1. Supabase Configuration
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 2. AI/API Configuration (Optional but recommended)
```
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_API_KEY=your-additional-api-key-here
```

## 📍 How to Set Environment Variables in Netlify

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Select your site

2. **Navigate to Site Settings**
   - Click on your site name
   - Go to "Site settings" tab

3. **Find Environment Variables**
   - In the left sidebar, click "Environment variables"
   - Click "Add a variable"

4. **Add Each Variable**
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase project URL (from Supabase dashboard)
   - Click "Save"

   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon/public key (from Supabase dashboard)
   - Click "Save"

5. **Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

## 🔍 How to Get Supabase Values

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Get Project URL**
   - Go to "Settings" → "API"
   - Copy the "Project URL"

3. **Get API Key**
   - In the same "Settings" → "API" section
   - Copy the "anon public" key (NOT the service_role key)

## 🚨 Why These Are Required

- **VITE_SUPABASE_URL**: Required for database connection
- **VITE_SUPABASE_ANON_KEY**: Required for authentication and database access
- **VITE_GEMINI_API_KEY**: For AI features (optional)
- **VITE_API_KEY**: For additional API features (optional)

## ⚠️ Common Issues

1. **White Screen**: Usually caused by missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`
2. **Authentication Errors**: Check if Supabase keys are correct
3. **AI Features Not Working**: Add `VITE_GEMINI_API_KEY` if you want AI features

## 🔧 Debug Mode

To enable debugging, add this environment variable:
```
VITE_DEBUG_ENV=true
```

This will show you in the browser console which environment variables are missing. 