import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, Text, TextInput, TouchableOpacity, View, ScrollView, useWindowDimensions, PixelRatio } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RememberCheckBoxProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
};

const RememberCheckBox: React.FC<RememberCheckBoxProps> = ({ value, onValueChange, label }) => (
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => onValueChange(!value)}
    activeOpacity={0.8}
  >
    <View style={[styles.checkbox, value && styles.checkboxChecked]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function LoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const scaleFont = (size: number) => size * PixelRatio.getFontScale();
  const moderateScale = (size: number) => size * (width / 375);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = 'https://prolific-happiness-production.up.railway.app';

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        const savedPassword = await AsyncStorage.getItem('savedPassword');
        if (savedEmail) setEmail(savedEmail);
        if (savedPassword) setPassword(savedPassword);
        if (savedEmail && savedPassword) setRemember(true);
      } catch (err) {
        console.warn('Error cargando datos guardados:', err);
      }
    };
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.ok || !data.user) {
        setError(data.message || "Error en el login");
        return;
      }

      const userId = data.user.id;
      const clientId = data.user.client_id;

      await AsyncStorage.setItem("user_id", userId.toString());
      await AsyncStorage.setItem("client_id", clientId.toString());
      await AsyncStorage.removeItem("appointments");
      const verifyClientId = await AsyncStorage.getItem("client_id");

      if (remember) {
        await AsyncStorage.setItem('savedEmail', email);
        await AsyncStorage.setItem('savedPassword', password);
      } else {
        await AsyncStorage.removeItem('savedEmail');
        await AsyncStorage.removeItem('savedPassword');
      }

      router.replace('/Map');

    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor');
    }
  };


  const handleForgotPassword = () => {
    router.push('/Register');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 25 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: height * -0.03, marginTop: -50 }}>
            <Image
              source={require('../../assets/images/LogoAutoFix.png')}
              style={{ width: moderateScale(200), height: moderateScale(200) }}
              resizeMode="contain"
            />
          </View>

          <View style={{ alignItems: 'center', marginBottom: moderateScale(100) }}>
            <Text style={[styles.title, { fontSize: moderateScale(34) }]}>¡Bienvenido!</Text>
            <Text style={[styles.subtitle, { fontSize: moderateScale(17) }]}>
              Ingresa tu correo y contraseña
            </Text>
          </View>

          <View style={{ marginBottom: moderateScale(15) }}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.inputField, { fontSize: scaleFont(16) }]}
                placeholder="Correo"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={Math.min(width * 0.05, 28)} color="#27B9BA" />
            </View>

            <View style={styles.inputWrapper}>

              <TextInput
                style={[styles.inputField, { fontSize: scaleFont(16), color: '#000' }]}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() => {
                  if (password.length > 0) setShowPassword(!showPassword);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    password.length === 0
                      ? "lock-closed-outline"
                      : showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                  }
                  size={Math.min(width * 0.05, 28)}
                  color="#27B9BA"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <RememberCheckBox value={remember} onValueChange={setRemember} label=" Recordar" />
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { paddingVertical: moderateScale(12) }]}
            onPress={handleLogin}
            disabled={!email || !password}
          >
            <Text style={[styles.buttonText, { fontSize: scaleFont(17) }]}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <View style={styles.newUserContainer}>
            <Text>¿No tienes un usuario?</Text>
            <TouchableOpacity onPress={() => router.push('/Register')}>
              <Text style={[styles.linkText, { marginLeft: 5 }]}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, paddingHorizontal: 15, height: 55, },
  inputField: { flex: 1, height: '100%' },
  inputIcon: { marginLeft: 10 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: 8, fontSize: 15, color: '#333' },
  button: { backgroundColor: '#27B9BA', borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  title: { fontWeight: 'bold', color: '#27B9BA', textAlign: 'center' },
  subtitle: { color: '#000', textAlign: 'center' },
  linkText: { color: '#007AFF', fontSize: 15 },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  newUserContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
