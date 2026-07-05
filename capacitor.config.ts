import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.saubhagya.clinic',
  appName: 'Saubhagya Clinic',
  webDir: 'public',
  server: {
    // Load from the live deployed website
    url: 'https://drsavitak.netlify.app',
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1B2D23',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#0D9488',
      style: 'LIGHT',
    },
  },
};

export default config;
