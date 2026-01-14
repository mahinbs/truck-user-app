# 🧪 TruckFlow - Quick Test Guide

## 🚀 Start the App

```bash
cd /Users/mdsahil/Downloads/truck-app
npx expo start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code for physical device

---

## 📱 Test Flow 1: Business User

### Step 1: Auth Flow
1. **App launches** → Splash screen (2.5s animated logo)
2. **Auto-navigates** → Login screen
3. **Enter phone**: `9876543210` (any 10 digits)
4. **Tap "Sign In"** → Goes to OTP screen
5. **Enter OTP**: `123456` (success code)
6. **Tap "Verify & Continue"** → Goes to Role Selection

### Step 2: Role Selection
1. **See two cards**: Business User vs Truck Driver
2. **Tap "Business User"** card → Card highlights with checkmark
3. **Tap "Continue"** → Goes to KYC screen

### Step 3: KYC (Optional)
1. Fill in business details (or tap "Skip for now")
2. Goes to Business Dashboard

### Step 4: Business Dashboard
**What to Check:**
- ✅ Gradient header with white text
- ✅ 3 animated stat cards (different gradient colors)
- ✅ Quick action cards (4 items)
- ✅ Shipment list with status chips
- ✅ Filter tabs (All, Active, Completed)
- ✅ Gradient progress bars on in-transit shipments
- ✅ Floating + button (bottom right)
- ✅ Pull down to refresh

**Interactions:**
- Tap stat cards → Feel haptic feedback
- Tap filter tabs → See filtered shipments
- Tap shipment card → Navigate to trip details
- Tap floating button → Goes to book trip
- Pull down → See refresh animation

---

## 🚚 Test Flow 2: Driver (NEW!)

### Step 1: Auth Flow (Same as Business)
1. Splash → Login → OTP → Role Selection

### Step 2: Role Selection
1. **Tap "Truck Driver"** card → Highlights with checkmark
2. **Tap "Continue"** → Goes DIRECTLY to Driver Home

### Step 3: Driver Home
**What to Check:**
- ✅ Online/Offline toggle switch
- ✅ Today's stats (3 gradient cards)
- ✅ Incoming trip requests (if online)
- ✅ Offline message (if offline)
- ✅ Notification badge with count

**Test Online Toggle:**
1. Toggle is OFF by default
2. Tap toggle → Turns green, says "You're Online"
3. See incoming trip requests appear
4. Toggle OFF → Requests hide, see offline message

### Step 4: Accept a Trip
1. **Ensure toggle is ON**
2. **See trip request cards** with earnings (₹12,500, ₹4,500)
3. **Tap "View Details"** on any trip
4. **Trip Request Detail screen** opens

**What to Check on Trip Request:**
- ✅ Large earnings card at top (gradient green)
- ✅ Pickup location with address and time
- ✅ Drop location with address and expected time
- ✅ Load details (Material, Weight, Distance)
- ✅ Customer info with phone number
- ✅ Special instructions box (yellow)
- ✅ Bottom buttons (Reject / Accept Trip)

5. **Tap "Reject"** → Goes back to home
6. **Or tap "Accept Trip"** → Goes to Active Trip screen

### Step 5: Active Trip
**What to Check:**
- ✅ Map placeholder (says "Map integration coming soon")
- ✅ Status chip showing current state
- ✅ "Report Delay" button (yellow)
- ✅ Route info (Pickup and Drop)
- ✅ Stats (ETA, Remaining distance)
- ✅ "Contact Customer" button
- ✅ Large gradient action button at bottom

**Test Status Flow:**
1. **Button says "Reached Pickup"**
   - Tap it → Button changes to "Load Complete"
2. **Tap "Load Complete"**
   - Button changes to "Start Journey"
3. **Tap "Start Journey"**
   - Button changes to "Reached Destination"
4. **Tap "Reached Destination"**
   - Button changes to "Confirm Delivery"
5. **Tap "Confirm Delivery"**
   - Goes to Delivery Confirmation screen

### Step 6: Report Delay (Optional)
1. From Active Trip, **tap "Report Delay"**
2. **See 5 reason cards** (Traffic, Weather, Breakdown, Border, Other)
3. **Tap any reason** → Card highlights
4. **Add notes** (optional)
5. **Tap "Submit Report"** → Goes back to Active Trip

### Step 7: Delivery Confirmation
**What to Check:**
- ✅ Photo upload button with camera icon
- ✅ Delivery notes text field
- ✅ Success card showing earnings (₹12,500)
- ✅ "Confirm & Complete" button

**Complete Delivery:**
1. **(Optional)** Tap photo button → Would open camera
2. **(Optional)** Add delivery notes
3. **Tap "Confirm & Complete"**
4. **Returns to Driver Home** → Trip complete!

### Step 8: View Earnings
1. **Tap "Earnings" tab** (bottom navigation)

**What to Check:**
- ✅ Total balance card (green gradient)
- ✅ Withdraw button
- ✅ Period tabs (Today, Week, Month)
- ✅ Stats cards for today and week
- ✅ Recent trips list with earnings

### Step 9: Check My Trips
1. **Tap "My Trips" tab**

**What to Check:**
- ✅ Filter tabs (All, Active, Completed)
- ✅ Trip cards with status chips
- ✅ Earnings per trip
- ✅ Route and date info

### Step 10: Driver Profile
1. **Tap "Profile" tab**

**What to Check:**
- ✅ Driver avatar and name
- ✅ Vehicle number and type
- ✅ Rating and trip count
- ✅ Documents section (License, RC, Insurance with checkmarks)
- ✅ Settings menu
- ✅ Logout button

---

## 🎯 Features to Test

### Animations & Feedback
- ✅ Every button press has haptic feedback
- ✅ Cards scale down when pressed
- ✅ Screens fade in on load
- ✅ Smooth transitions between screens
- ✅ Status toggle has heavy haptic

### Visual Elements
- ✅ Gradient headers on all screens
- ✅ Decorative circles in background
- ✅ Status chips with appropriate colors
- ✅ Gradient progress bars
- ✅ Gradient stat cards
- ✅ Premium spacing and shadows

### Navigation
- ✅ Bottom tabs work correctly
- ✅ Back buttons navigate properly
- ✅ Role-based routing (Business vs Driver)
- ✅ Deep navigation (trip request → active → delivery)

---

## 🐛 Quick Troubleshooting

### Issue: App won't start
```bash
# Clear cache and restart
npx expo start -c
```

### Issue: Animations are slow
- Use real device instead of simulator
- Emulators have reduced performance

### Issue: Can't see driver home after role selection
- Make sure you selected "Truck Driver" role
- Check that route is `/(driver)/home` in URL bar

### Issue: Toggle switch not working
- Check if haptic feedback is enabled
- Try on real device (simulators have limited haptics)

---

## ✨ Expected Behavior Summary

### Business User Journey:
```
Splash → Login → OTP → Role (Business) → KYC → Dashboard
                                                    ↓
                                         View Shipments, Stats, Actions
```

### Driver Journey:
```
Splash → Login → OTP → Role (Driver) → Home (Toggle On)
                                          ↓
                                    View Trip Requests
                                          ↓
                                    Accept Trip
                                          ↓
                                    Active Trip (4-step process)
                                          ↓
                                    Delivery Confirmation
                                          ↓
                                    Back to Home → View Earnings
```

---

## 🎨 Visual Checklist

### Colors to Notice:
- **Purple-Blue Gradient**: Headers (#5B4AFF → #7C6DFF)
- **Green Gradient**: Earnings, Success states
- **Status Colors**: 
  - Blue: In-transit
  - Green: Delivered/Completed
  - Yellow: Pending/At-risk
  - Red: Cancelled/Delayed

### Typography:
- **Bold Headers**: Clear hierarchy
- **Semibold Labels**: Important info
- **Regular Text**: Body content
- **Small Text**: Metadata

### Spacing:
- **Consistent Padding**: 16px, 24px, 32px
- **Card Gaps**: 12px between cards
- **Section Spacing**: 24px between sections

---

## 📊 Test Checklist

### Business Flow:
- [ ] Splash screen animates
- [ ] Login accepts phone number
- [ ] OTP verification works (123456)
- [ ] Role selection highlights on tap
- [ ] KYC can be filled or skipped
- [ ] Dashboard loads with animations
- [ ] Stats show correct numbers
- [ ] Shipments can be filtered
- [ ] Cards have haptic feedback
- [ ] Pull to refresh works

### Driver Flow:
- [ ] Role selection → Driver goes to home
- [ ] Online toggle works smoothly
- [ ] Trip requests show when online
- [ ] Accept trip navigates correctly
- [ ] Active trip status changes work
- [ ] Report delay has 5 reasons
- [ ] Delivery confirmation shows success
- [ ] Earnings tab shows balance
- [ ] My Trips tab filters correctly
- [ ] Profile shows documents
- [ ] All navigation works

---

## 🎉 Success Criteria

✅ **You've successfully tested the app if:**
1. Both role flows work end-to-end
2. All animations are smooth
3. Haptic feedback works on interactions
4. Navigation between screens is seamless
5. UI looks premium with gradients
6. Status changes work correctly
7. No crashes or errors

---

**Happy Testing! 🚀**

If something doesn't work as expected, check the console logs for errors and refer to the documentation files for implementation details.

