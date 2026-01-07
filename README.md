# TruckFlow - Full Stack Application

A logistics and shipment management application with both mobile (React Native/Expo) and web (Next.js) implementations.

## 📁 Project Structure

```
truck-app/
├── app/              # React Native/Expo mobile app
├── web/              # Next.js web application
├── components/       # Shared components
└── constants/        # Shared constants
```

## 🌐 Web Application

The web application is located in the `/web` directory. See [web/README.md](./web/README.md) for detailed documentation.

### Quick Start (Web)

```bash
cd web
npm install
npm run dev
```

### Deploy Web to Vercel

1. **From the root directory**, push to GitHub:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **In Vercel Dashboard**:
   - Import your repository
   - Set **Root Directory** to `web`
   - Deploy

Or use Vercel CLI from the web directory:
```bash
cd web
vercel
```

## 📱 Mobile Application

The mobile application is built with React Native and Expo. See the main `package.json` for mobile-specific scripts.

## 🔧 Development

### Web Development
```bash
cd web
npm run dev
```

### Mobile Development
```bash
npm start
```

## 📝 Notes

- The web app uses **Tailwind CSS** for styling
- The web app is configured for **static export** by default
- For Vercel deployment, set the root directory to `web`
- Environment variables should be configured in Vercel dashboard

## 📄 License

This project is private and proprietary.
