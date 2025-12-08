import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/env';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

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

      if (!data.ok) {
        setError(data.message || 'Error en el login');
        return;
      }

      setError('');

      try {
        if (remember) {
          await AsyncStorage.setItem('savedEmail', email);
          await AsyncStorage.setItem('savedPassword', password);
        } else {
          await AsyncStorage.removeItem('savedEmail');
          await AsyncStorage.removeItem('savedPassword');
        }
      } catch (storageError) {
        console.warn('Error guardando datos:', storageError);
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

  const RememberCheckBox = ({
    value,
    onValueChange,
    label,
  }: {
    value: boolean;
    onValueChange: (val: boolean) => void;
    label: string;
  }) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.checkbox, value && styles.checkboxChecked]} />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/LogoAutoFix.png')}
              style={styles.LogoAutoFix}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>¡Bienvenido!</Text>
            <Text style={styles.subtitle}>Ingresa tu correo y contraseña</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Ionicons name="mail-outline" size={20} color="#27B9BA" style={styles.inputIcon} />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <Ionicons name="lock-closed-outline" size={20} color="#27B9BA" style={styles.inputIcon} />
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <RememberCheckBox value={remember} onValueChange={setRemember} label=" Recordar" />
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={!email || !password}
            >
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newuserContainer}>
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
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f5f5f5' },
  logoContainer: { alignItems: 'center' },
  LogoAutoFix: { width: 250, height: 250 },
  titleContainer: { textAlign: 'center', marginBottom: 25, marginTop: -45 },
  title: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', color: '#27B9BA' },
  subtitle: { fontSize: 18, fontWeight: 'normal', marginBottom: 80, textAlign: 'center', color: '#000000ff' },
  inputContainer: { width: '100%' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 25, paddingHorizontal: 15 },
  inputField: { flex: 1, height: 50, fontSize: 16 },
  inputIcon: { marginLeft: 10 },
  actionsContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 100 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: '#333' },
  linkText: { color: '#007AFF', fontSize: 14 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  buttonContainer: { width: '100%' },
  button: { width: '100%', backgroundColor: '#27B9BA', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  newuserContainer: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40 }
});