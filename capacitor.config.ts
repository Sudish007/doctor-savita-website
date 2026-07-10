import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saubhagya.app',
  appName: 'Saubhagya Clinic',
  webDir: 'public',
  server: {
    url: 'https://drsavitak.netlify.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    // Allow Capacitor bridge to work with remote URL
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#004123',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#0D9488',
      style: 'LIGHT',
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#004123',
      sound: 'default',
    },
  },
};

export default config;
