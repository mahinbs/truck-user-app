# TruckFlow - Web Application

A modern logistics and shipment management web application built with Next.js, React, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: Login, signup, and OTP verification
- **Dashboard**: Overview of active and completed shipments with statistics
- **Trip Booking**: Multi-step form for booking new shipments
- **Trip Tracking**: Real-time tracking of shipments with status updates
- **Trip Management**: View, manage, and track all your shipments
- **Payment & Invoicing**: Handle payments and generate invoices
- **Trip History**: Complete history of all past shipments
- **Profile Management**: User profile and settings
- **Support**: Customer support and help center

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: React Icons (Feather Icons)
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd truck-app/web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🚢 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your repository
   - **Important**: Set the **Root Directory** to `web`
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Build Settings** (if needed)
   - Root Directory: `web`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `out` (for static export) or `.next` (for SSR)
   - Install Command: `npm install` (auto-detected)

**Note**: This project is currently configured for static export (`output: 'export'` in `next.config.js`). If you want to use Vercel's full Next.js features (SSR, API routes), remove the `output: 'export'` line from `next.config.js`.

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the web directory**
   ```bash
   cd web
   vercel
   ```

4. **For production deployment**
   ```bash
   vercel --prod
   ```

### Environment Variables

If you need environment variables, add them in Vercel Dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add your variables (e.g., API keys, database URLs)

## 📁 Project Structure

```
web/
├── pages/              # Next.js pages (routes)
│   ├── dashboard.tsx   # Main dashboard
│   ├── login.tsx       # Login page
│   ├── signup.tsx      # Signup page
│   ├── book-trip.tsx   # Trip booking flow
│   ├── trips.tsx       # All trips list
│   └── ...
├── components/         # Reusable React components
│   ├── ui/             # UI components (Card, Button, Input, etc.)
│   └── BottomNav.tsx   # Bottom navigation
├── constants/          # Theme and constants
│   └── theme.ts        # Design tokens
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS and global styles
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Dependencies
```

## 🎨 Styling

This project uses **Tailwind CSS** for styling. All components use Tailwind utility classes instead of inline styles.

### Custom Colors

The project uses a custom color palette defined in `tailwind.config.js`:
- Primary: Blue (#2563EB)
- Secondary: Purple (#8B5CF6)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Next.js Config
Located in `next.config.js`

### Tailwind Config
Located in `tailwind.config.js` - Custom colors and theme settings

### PostCSS Config
Located in `postcss.config.js` - Tailwind CSS and Autoprefixer setup

## 📱 Pages

- `/` - Redirects to login
- `/login` - User login
- `/signup` - User registration
- `/verify-otp` - OTP verification
- `/dashboard` - Main dashboard
- `/book-trip` - Book a new shipment
- `/trips` - All shipments list
- `/trip/[tripId]` - Trip details
- `/trip/[tripId]/payment` - Payment page
- `/trip/[tripId]/rating` - Rating page
- `/history` - Trip history
- `/track` - Track shipments
- `/profile` - User profile
- `/support` - Support center
- `/kyc` - KYC verification

## 🐛 Troubleshooting

### Build Errors

If you encounter build errors:
1. Delete `node_modules` and `.next` folders
2. Run `npm install` again
3. Run `npm run build`

### Tailwind CSS Not Working

1. Ensure Tailwind is installed: `npm list tailwindcss`
2. Check `tailwind.config.js` content paths
3. Verify `postcss.config.js` is correct
4. Restart the dev server

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues or questions, please contact the development team.

---

Built with ❤️ using Next.js and Tailwind CSS
