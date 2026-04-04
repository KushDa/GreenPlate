import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.greenplate.app',
  appName: 'GreenPlate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
