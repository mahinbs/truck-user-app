# TruckFlow - Premium Design System

## 🎨 Design Overview

The app has been completely revamped with a premium purple/blue gradient theme inspired by modern flight booking apps. The design focuses on:

- **Premium Gradients**: Purple-blue gradient (#5B4AFF → #7C6DFF)
- **Smooth Animations**: React Native Reanimated for 60fps animations
- **Haptic Feedback**: Physical feedback for all interactions
- **Modern UI**: Glassmorphism, floating elements, and smooth transitions
- **Accessibility**: Clear contrast ratios and readable typography

## 🎯 Color Palette

### Primary Colors
- **Primary**: `#5B4AFF` (Vibrant purple-blue)
- **Primary Light**: `#7C6DFF`
- **Primary Dark**: `#4838D1`

### Gradients
- **Primary Gradient**: `#5B4AFF → #7C6DFF`
- **Success**: `#10B981 → #059669`
- **Purple**: `#8B5CF6 → #7C3AED`

### Status Colors
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Info**: `#3B82F6` (Blue)

### Backgrounds
- **Background**: `#F5F7FF` (Light purple tint)
- **Card**: `#FFFFFF`
- **Purple Bg**: `#F0EDFF`

## 🧩 Core Components

### 1. **Button** (`components/ui/Button.tsx`)
Enhanced with animations and gradient support:
- Variants: `primary`, `secondary`, `outline`, `ghost`, `gradient`
- Sizes: `sm`, `md`, `lg`
- Features: Haptic feedback, scale animation, loading states

```typescript
<Button
  title="Sign In"
  variant="gradient"
  onPress={handleLogin}
  icon="arrow-forward"
  iconPosition="right"
  fullWidth
/>
```

### 2. **Card** (`components/ui/Card.tsx`)
Animated card with press interactions:
- Variants: `default`, `elevated`, `outlined`, `glass`
- Features: Spring animations, haptic feedback

```typescript
<Card 
  onPress={() => navigate()} 
  variant="elevated"
>
  {children}
</Card>
```

### 3. **FloatingButton** (`components/ui/FloatingButton.tsx`)
Premium FAB with gradient and animations:
- Variants: `primary`, `gradient`
- Sizes: `md`, `lg`

```typescript
<FloatingButton
  icon="add"
  onPress={handleCreate}
  variant="gradient"
  size="lg"
/>
```

### 4. **StatusChip** (`components/ui/StatusChip.tsx`)
Colored status indicators:
- Statuses: `active`, `pending`, `completed`, `in-transit`, `delivered`, `cancelled`, `delayed`, `at-risk`
- Sizes: `sm`, `md`

```typescript
<StatusChip status="in-transit" size="sm" />
```

### 5. **OTPInput** (`components/ui/OTPInput.tsx`)
Premium OTP input with animations:
- Auto-focus next field
- Shake animation on error
- Haptic feedback

```typescript
<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  error={hasError}
/>
```

### 6. **GradientBackground** (`components/ui/GradientBackground.tsx`)
Reusable gradient container:
- Variants: `primary`, `purple`, `blue`, `success`, `card`, `overlay`

```typescript
<GradientBackground variant="primary">
  {children}
</GradientBackground>
```

## 📱 Screen Structure

### Auth Flow
1. **Splash Screen** (`app/splash.tsx`)
   - Animated logo with rotation
   - Gradient background with decorative circles
   - Token check and role detection

2. **Login** (`app/(auth)/login.tsx`)
   - Gradient header with decorative elements
   - White card form on gradient background
   - Slide-in animations

3. **OTP Verification** (`app/(auth)/verify-otp.tsx`)
   - Premium OTP input component
   - Resend timer
   - Error handling with shake animation

4. **Signup** (`app/(auth)/signup.tsx`)
   - TBD - Following same gradient pattern

5. **KYC** (`app/(auth)/kyc.tsx`)
   - TBD - Role selection and profile completion

### Business Flow
1. **Dashboard** (`app/(tabs)/dashboard.tsx`)
   - Gradient header with stats cards
   - Quick action cards
   - Shipment list with filters
   - Floating action button

2. **Book Trip** - TBD
3. **Trips List** - TBD
4. **Trip Details** - TBD
5. **Profile** - TBD

### Driver Flow
- TBD - Separate navigation stack

## 🎬 Animation System

### Animation Utilities (`utils/animations.ts`)

**Spring Presets:**
- `gentle`: Smooth, slow spring
- `bouncy`: Playful bounce effect
- `smooth`: Balanced spring
- `snappy`: Quick, responsive

**Timing Presets:**
- `fast`: 150ms
- `normal`: 250ms
- `slow`: 350ms
- `smooth`: 300ms with bezier easing

**Common Animations:**
- `fadeIn()`, `fadeOut()`
- `scaleIn()`, `scaleOut()`
- `slideInRight()`, `slideInLeft()`
- `bounceIn()`

### Usage Example:
```typescript
const fadeAnim = useRef(new RNAnimated.Value(0)).current;

useEffect(() => {
  RNAnimated.timing(fadeAnim, {
    toValue: 1,
    duration: 600,
    useNativeDriver: true,
  }).start();
}, []);
```

## 📐 Layout System

### Spacing Scale
```typescript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Border Radius
```typescript
sm: 4px
md: 8px
lg: 12px
xl: 16px
full: 9999px
```

### Typography
```typescript
Sizes: xs(12), sm(14), md(16), lg(18), xl(20), 2xl(24), 3xl(30), 4xl(36)
Weights: regular(400), medium(500), semibold(600), bold(700)
```

## 🔧 Technical Stack

- **React Native** with Expo
- **React Native Reanimated** for animations
- **Expo Linear Gradient** for gradients
- **Expo Haptics** for feedback
- **Expo Router** for navigation
- **TypeScript** for type safety

## 📂 Project Structure

```
/app
  /splash.tsx                 # Entry splash screen
  /(auth)                     # Auth screens group
    /login.tsx
    /signup.tsx
    /verify-otp.tsx
    /kyc.tsx
  /(tabs)                     # Main app tabs
    /dashboard.tsx
    /trips.tsx
    /profile.tsx
    /book-trip.tsx
    /trip/[tripId].tsx
    
/components
  /ui                         # Reusable UI components
    /Button.tsx
    /Card.tsx
    /Input.tsx
    /FloatingButton.tsx
    /StatusChip.tsx
    /OTPInput.tsx
    /GradientBackground.tsx
    /AnimatedCard.tsx
    
/constants
  /theme.ts                   # Design tokens
  
/utils
  /animations.ts              # Animation utilities
```

## 🚀 Next Steps

1. **Complete Auth Screens**:
   - Signup screen with role selection
   - KYC screen with document upload
   - Profile completion

2. **Role-Based Navigation**:
   - Business navigator
   - Driver navigator
   - Conditional rendering based on user role

3. **Business Screens**:
   - Enhanced book trip with stepper
   - Trip details with live tracking
   - Delivery proof
   - Payments & invoices

4. **Driver Screens**:
   - Driver home with availability toggle
   - Trip requests
   - Active trip screen
   - Delay reporting
   - Earnings dashboard

5. **Common Screens**:
   - Support & help
   - Notifications
   - Settings
   - Profile management

## 🎨 Design Principles

1. **Consistency**: Use design tokens from theme.ts
2. **Feedback**: Always provide haptic + visual feedback
3. **Animation**: 60fps animations using native driver
4. **Accessibility**: Maintain WCAG contrast ratios
5. **Performance**: Optimize images and animations
6. **Responsiveness**: Support different screen sizes

## 📝 Code Style

- Use TypeScript for all new components
- Follow React hooks best practices
- Use functional components
- Implement proper error boundaries
- Add loading and error states
- Write descriptive prop interfaces

