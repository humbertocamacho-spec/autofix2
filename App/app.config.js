import 'dotenv/config';

export default {
  expo: {
    name: 'AutoFix',
    slug: 'autofix',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'autofix',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.autofix.mx.autofixapp',
    },

    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    android: {
      package: 'com.autofix.mx.autofixapp',
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_API_KEY,
        }
      },
      versionCode: 2,
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "FOREGROUND_SERVICE",
      ],
    },

    plugins: [
      'expo-router',
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      API_URL: process.env.API_URL,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      eas: {
        projectId: '0ba948f4-0961-441f-9e14-cbbf6ec47528',
      },
    },
  },
};
