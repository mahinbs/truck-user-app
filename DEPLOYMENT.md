# Deployment Guide for Vercel

This guide will help you deploy the TruckFlow app to Vercel.

## Prerequisites

- Node.js 18+ installed
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Git repository (GitHub, GitLab, or Bitbucket)

## Local Build Test

Before deploying, test the build locally:

```bash
# Install dependencies
npm install

# Build for web
npm run build:web
```

The build output will be in the `dist` directory.

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to Git**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Build Settings** (IMPORTANT)
   - Framework Preset: **Other**
   - **Root Directory**: Leave empty or set to `.` (configure in dashboard, NOT in vercel.json)
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
   - Install Command: `npm install`
   
   ⚠️ **Note**: Root Directory must be set in Vercel Dashboard → Settings → General, NOT in vercel.json

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **For Production Deployment**
   ```bash
   vercel --prod
   ```

## Configuration Files

### vercel.json
- **buildCommand**: Runs the web build script
- **outputDirectory**: Points to `dist` (Expo Router's default output)
- **rewrites**: Handles client-side routing for Expo Router

### .vercelignore
- Excludes unnecessary files from deployment
- Reduces build size and improves performance

## Environment Variables

If you need environment variables:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add your variables (e.g., API keys, endpoints)
4. Redeploy for changes to take effect

## Troubleshooting

### Build Fails

1. **Check Node.js version**
   - Vercel uses Node.js 18.x by default
   - You can specify version in `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

2. **Clear cache and rebuild**
   ```bash
   rm -rf node_modules .expo dist
   npm install
   npm run build:web
   ```

### Routing Issues

- The `vercel.json` includes rewrites for client-side routing
- All routes are redirected to `index.html` for Expo Router to handle

### Build Output Not Found

- Verify the output directory is `dist`
- Check that `app.json` has `"output": "static"` in web config

## Post-Deployment

1. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Analytics** (Optional)
   - Enable Vercel Analytics in project settings
   - Monitor performance and usage

## Continuous Deployment

Once connected to Git:
- Every push to `main` branch = Production deployment
- Every push to other branches = Preview deployment
- Pull Requests = Preview deployment with unique URL

## Support

For issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- Review build logs in Vercel dashboard

