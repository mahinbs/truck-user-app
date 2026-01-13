# How to Run the Web App

This guide explains how to run the TruckFlow web app locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- All dependencies installed

## Development Mode (Recommended)

Run the app in development mode with hot reload:

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run web
```

This will:
- Start the Expo development server
- Open the app in your default browser (usually at `http://localhost:8081`)
- Enable hot reload (changes reflect immediately)
- Show helpful error messages and debugging info

### Alternative Development Commands

```bash
# Start with specific port
npx expo start --web --port 3000

# Start and clear cache
npx expo start --web --clear

# Start in tunnel mode (for testing on other devices)
npx expo start --web --tunnel
```

## Production Build (Testing)

To test the production build locally:

```bash
# Build the production version
npm run build:web

# The build output will be in the `dist` directory
# You can serve it with a static file server
```

### Serve Production Build Locally

**Option 1: Using Python (if installed)**
```bash
# Python 3
cd dist
python3 -m http.server 8000

# Then open http://localhost:8000 in your browser
```

**Option 2: Using Node.js http-server**
```bash
# Install http-server globally
npm install -g http-server

# Serve the dist folder
cd dist
http-server -p 8000

# Then open http://localhost:8000 in your browser
```

**Option 3: Using npx (no installation needed)**
```bash
cd dist
npx http-server -p 8000
```

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run web

# 3. Open browser (usually opens automatically)
# If not, navigate to: http://localhost:8081
```

## Troubleshooting

### Port Already in Use

If port 8081 is already in use:
```bash
# Use a different port
npx expo start --web --port 3000
```

### Clear Cache and Restart

If you encounter issues:
```bash
# Clear cache and restart
npx expo start --web --clear
```

### Build Errors

If build fails:
```bash
# Clean install
rm -rf node_modules
npm install
npm run build:web
```

### Browser Not Opening

Manually navigate to:
- Default: `http://localhost:8081`
- Or check the terminal for the actual URL

## Development vs Production

### Development Mode (`npm run web`)
- ✅ Hot reload enabled
- ✅ Source maps for debugging
- ✅ Detailed error messages
- ✅ Slower initial load
- ✅ Larger bundle size

### Production Build (`npm run build:web`)
- ✅ Optimized and minified
- ✅ Faster load times
- ✅ Smaller bundle size
- ❌ No hot reload
- ❌ Less detailed errors

## Next Steps

- **Development**: Use `npm run web` for daily development
- **Testing**: Use production build to test before deployment
- **Deployment**: Follow `DEPLOYMENT.md` for Vercel deployment

