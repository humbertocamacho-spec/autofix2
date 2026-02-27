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
      bundleIdentifier: 'com.autofix.mx.autofixappios',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY_IOS,
      },
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false,
        "NSLocationWhenInUseUsageDescription": "Usamos tu ubicación para mostrar talleres cercanos.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "Usamos tu ubicación para mostrar talleres cercanos."
      }
    },
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    android: {
      package: 'com.autofix.mx.autofixapp',
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
        }
      },
      versionCode: 11,
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
      eas: {
        projectId: '0ba948f4-0961-441f-9e14-cbbf6ec47528',
      },
    },
  },
};