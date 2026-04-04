import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.greenplate.app',
  appName: 'GreenPlate',
  webDir: 'dist',
  server: {
    androidScheme: 'http', // Change this back to 'http'
    cleartext: true        // Add this specifically for development
  }
};

export default config;