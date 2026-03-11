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
        "NSLocationWhenInUseUsageDescription": "AutoFix usa tu ubicación para mostrar talleres mecánicos cercanos a tu posición actual y facilitar la búsqueda de servicios automotrices en tu zona. Por ejemplo, mostramos los talleres más próximos a ti en el mapa."
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
      versionCode: 13,
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