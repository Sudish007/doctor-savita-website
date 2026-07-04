# Saubhagya Clinic - Android App Build Guide

## Overview

The Android app wraps the live website (`https://drsavitak.netlify.app`) using Capacitor.
All features (chatbot, appointments, queue, admin) work as-is since the app loads from the server.

## Prerequisites

1. **Android Studio** — Download from https://developer.android.com/studio
2. **Java 17+** — Bundled with Android Studio
3. **Google Play Developer Account** — $25 one-time fee at https://play.google.com/console

## Quick Commands

```bash
# Sync capacitor config to Android project
npm run cap:sync

# Open in Android Studio (for testing/building)
npm run cap:open

# Build release APK (requires Android Studio/Gradle setup)
npm run cap:build
```

## Step-by-Step: Build for Play Store

### 1. Open in Android Studio

```bash
npx cap open android
```

This opens the `android/` folder in Android Studio.

### 2. Generate Signing Key (one-time)

```bash
keytool -genkey -v -keystore saubhagya-release.keystore -alias saubhagya -keyalg RSA -keysize 2048 -validity 10000
```

Store this keystore safely — you'll need it for every future update.

### 3. Configure Signing in Android Studio

- Go to **Build > Generate Signed Bundle / APK**
- Choose **Android App Bundle (AAB)** (required by Play Store)
- Select your keystore file
- Enter alias and passwords
- Choose **release** build variant
- Click **Finish**

The AAB file will be at: `android/app/release/app-release.aab`

### 4. App Icon & Splash Screen

Replace these files with your branded assets:

- `android/app/src/main/res/mipmap-*/ic_launcher.png` — App icon (various sizes)
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png` — Round app icon

**Sizes needed:**
| Folder | Size |
|--------|------|
| mipmap-mdpi | 48x48 |
| mipmap-hdpi | 72x72 |
| mipmap-xhdpi | 96x96 |
| mipmap-xxhdpi | 144x144 |
| mipmap-xxxhdpi | 192x192 |

Use Android Studio's **Image Asset Studio** (right-click `res` > New > Image Asset) for easiest icon generation.

### 5. Play Store Listing Requirements

You'll need these for submission:

- **App title**: Saubhagya Clinic - Dr. Savita
- **Short description** (80 chars): Homeopathic clinic by Dr. Savita Kumari - Book appointments, get health tips
- **Full description** (4000 chars): See below
- **Screenshots**: At least 2 phone screenshots (1080x1920 or similar)
- **Feature graphic**: 1024x500 banner image
- **App icon**: 512x512 PNG (high-res)
- **Privacy policy URL**: Required — you'll need to create one
- **Category**: Medical
- **Content rating**: Complete the questionnaire

### 6. Suggested Full Description

```
Saubhagya Multispeciality Homeopathic Clinic — Dr. Savita Kumari (BHMS)
Medical Officer, AYUSH Department, Government of Bihar

Features:
• Book appointments online — morning & evening slots
• Live queue status — know your token number and wait time
• AI health assistant — ask questions about homeopathy
• Health tips & remedy of the day
• Photo gallery & credentials
• Payment via UPI for premium consultations
• Multi-language support (Hindi & English)

Services:
• Chronic disease management
• Skin disorders (eczema, psoriasis, acne)
• Women's health & hormonal issues
• Child care & growth disorders
• Digestive & respiratory problems
• Joint pain & arthritis

Clinic: Village Pipra, Post Khedhay, PS Andar, Siwan, Bihar
Timings: Mon-Sat 6-8 AM & 3-6 PM | Sunday 10 AM-5 PM
```

### 7. Upload to Play Store

1. Go to https://play.google.com/console
2. Create new app → Fill details
3. Upload the `.aab` file under **Release > Production**
4. Complete all required sections (content rating, target audience, etc.)
5. Submit for review (takes 1-7 days typically)

## Testing Before Release

### On Physical Device
```bash
npx cap run android
```

### On Emulator (via Android Studio)
- Open in Android Studio: `npx cap open android`
- Click the green "Run" button

## Updating the App

Since the app loads from your live Netlify site, **most updates require no app update**. 
Just deploy your website changes normally.

Only rebuild the app if you change:
- App icon, splash screen
- Capacitor plugins (push notifications, etc.)
- App version for Play Store update

## Version Bumping (for updates)

Edit `android/app/build.gradle`:
```groovy
versionCode 2      // increment for each upload
versionName "1.1"  // user-visible version
```

## Future Enhancements

- Push notifications: `npm install @capacitor/push-notifications`
- Camera access: `npm install @capacitor/camera`
- Offline mode: Add service worker to the Next.js app
- Deep links: Configure Android App Links in manifest
