# Quick Start Guide - TruckFlow Premium App

## 🚀 Run the App

```bash
# Install dependencies (already done)
npm install

# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## 📱 Test the New Premium UI

### 1. Splash Screen
- Opens automatically on app launch
- Shows animated logo with gradient background
- 2.5 second animation before navigating to login

### 2. Login Flow
- **Path**: Automatically redirects from splash
- **Test**: Enter any 10-digit phone number
- **Features to Check**:
  - Gradient background with animated circles
  - White card slides up with fade-in
  - Haptic feedback on button press
  - Gradient "Sign In" button

### 3. OTP Verification
- **Path**: After login, enter phone number
- **Test**: Enter any 6-digit code (use `123456` for success)
- **Features to Check**:
  - Premium OTP input with 6 boxes
  - Auto-focus between boxes
  - Shake animation on wrong OTP
  - Haptic feedback per digit
  - Resend timer (60 seconds)

### 4. Dashboard
- **Path**: After OTP verification (or skip to dashboard)
- **Features to Check**:
  - Gradient header with decorative circles
  - 3 animated stat cards with gradients
  - Quick action cards (4 items)
  - Shipment list with filters
  - Status chips
  - Gradient progress bars
  - Floating action button (bottom right)
  - Pull to refresh

## 🎨 Design Elements to Notice

### Gradients
- Headers use purple-blue gradient (#5B4AFF → #7C6DFF)
- Stat cards have different gradient colors
- Progress bars are gradient-filled
- Buttons can be gradient or solid

### Animations
- **Fade-in**: Content appears smoothly
- **Slide-up**: Cards and forms slide from bottom
- **Scale**: Buttons and cards scale down on press
- **Spring**: Smooth, bouncy transitions
- **Shake**: Error states shake horizontally

### Haptic Feedback
- Light tap on card press
- Medium tap on button press
- Error vibration on invalid OTP
- Success vibration (when implemented)

### Colors
- **Primary Purple**: #5B4AFF
- **Success Green**: #10B981
- **Warning Amber**: #F59E0B
- **Error Red**: #EF4444
- **Background**: #F5F7FF (Light purple tint)

## 🧩 Component Examples

### Using the Gradient Button
```tsx
import { Button } from '@/components/ui/Button';

<Button
  title="Submit"
  variant="gradient"
  onPress={handleSubmit}
  icon="checkmark-circle"
  iconPosition="right"
  fullWidth
/>
```

### Using Status Chip
```tsx
import { StatusChip } from '@/components/ui/StatusChip';

<StatusChip status="in-transit" size="sm" />
// Options: active, pending, completed, in-transit, delivered, cancelled, delayed, at-risk
```

### Using Floating Button
```tsx
import { FloatingButton } from '@/components/ui/FloatingButton';

<FloatingButton
  icon="add"
  onPress={handleCreate}
  variant="gradient"
  size="lg"
  style={{ position: 'absolute', bottom: 90, right: 24 }}
/>
```

### Using OTP Input
```tsx
import { OTPInput } from '@/components/ui/OTPInput';

<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  error={hasError}
/>
```

### Using Animated Card
```tsx
import { Card } from '@/components/ui/Card';

<Card 
  onPress={() => router.push('/details')}
  variant="elevated"
>
  <Text>Card Content</Text>
</Card>
```

## 🎯 Key Navigation Paths

```
/                              → Auto-redirects to /splash
/splash                        → Splash screen (2.5s) → /login
/(auth)/login                  → Login with phone
/(auth)/verify-otp             → OTP verification
/(auth)/kyc                    → KYC form (optional, can skip)
/(tabs)/dashboard              → Main business dashboard
/(tabs)/trips                  → Shipments list (needs update)
/(tabs)/profile                → User profile (needs update)
/(tabs)/book-trip              → Book new trip (needs implementation)
```

## 🔧 Development Tips

### Hot Reload
- Press `r` in terminal to reload
- Shake device to open dev menu
- Enable Fast Refresh for instant updates

### Debugging
- Use React DevTools for component inspection
- Check terminal for console logs
- Use Expo Go app for quick testing

### Testing Animations
- Use iOS Simulator for best animation performance
- Android emulator may have reduced FPS
- Real devices show true performance

### Color Customization
- All colors in `constants/theme.ts`
- Update gradient colors for easy theme changes
- Status colors are predefined

## 📚 Documentation

- **Design System**: `DESIGN_SYSTEM.md`
- **Implementation Status**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_START.md`

## 🐛 Common Issues

### Issue: Animations are laggy
**Solution**: Ensure `useNativeDriver: true` is set in all animations

### Issue: Gradient not showing
**Solution**: Check if `expo-linear-gradient` is installed: `npx expo install expo-linear-gradient`

### Issue: Haptics not working
**Solution**: Haptics only work on physical devices, not simulators

### Issue: White screen on launch
**Solution**: Check terminal for errors, restart Metro bundler

## 🎉 What's Working

✅ Premium gradient theme throughout
✅ Smooth 60 FPS animations
✅ Haptic feedback on all interactions
✅ Splash screen with brand animation
✅ Complete auth flow (Login → OTP → KYC)
✅ Premium dashboard with stats and filters
✅ Floating action button
✅ Status chips and progress bars
✅ Pull to refresh
✅ Responsive design

## 🚧 What's Next

- [ ] Role-based navigation (Business vs Driver)
- [ ] Complete booking flow
- [ ] Driver screens
- [ ] API integration
- [ ] Map integration
- [ ] Real-time tracking
- [ ] Push notifications

## 💡 Pro Tips

1. **Use the gradient variant** for primary CTAs
2. **Add haptic feedback** to all user interactions
3. **Use StatusChip** for consistent status display
4. **Leverage Card component** for all content containers
5. **Follow the spacing scale** from theme.ts
6. **Use animation presets** from utils/animations.ts
7. **Test on real devices** for true animation performance

---

**Happy Coding! 🚀**

For questions or issues, refer to the documentation files or check component prop interfaces.

