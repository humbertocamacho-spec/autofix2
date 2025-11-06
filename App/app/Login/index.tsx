import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Image, Text, TextInput, TouchableOpacity, View, ScrollView, Dimensions, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { width, height } = Dimensions.get('window');

type RememberCheckBoxProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label: string;
};

const RememberCheckBox: React.FC<RememberCheckBoxProps> = ({ value, onValueChange, label }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)} activeOpacity={0.8}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const API_URL = Constants.expoConfig?.extra?.API_URL;


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

      const data: { ok: boolean; message?: string } = await res.json();

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

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 25 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/LogoAutoFix.png')}
                style={styles.logo}
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
                <Ionicons name="mail-outline" size={width * 0.06} color="#27B9BA" style={styles.inputIcon} />
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
                <Ionicons name="lock-closed-outline" size={width * 0.06} color="#27B9BA" style={styles.inputIcon} />
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

            <View style={styles.newUserContainer}>
              <Text>¿No tienes un usuario?</Text>
              <TouchableOpacity onPress={() => router.push('/Register')}>
                <Text style={[styles.linkText, { marginLeft: 5 }]}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({

  logoContainer: { marginTop: height * -0.05, marginBottom: height * 0.01, alignItems: 'center' },
  logo: { width: width * 0.6, height: width * 0.8 },
  titleContainer: { alignItems: 'center', marginBottom: height * 0.03, marginTop: -80 },
  title: { fontSize: width * 0.09, fontWeight: 'bold', color: '#27B9BA', textAlign: 'center' },
  subtitle: { fontSize: width * 0.045, color: '#000', textAlign: 'center', marginTop: height * 0.005 },
  inputContainer: { width: '100%', marginBottom: height * 0.01,  marginTop: 80 },
  inputWrapper: {  flexDirection: 'row',  alignItems: 'center',  width: '100%',  backgroundColor: '#fff',  borderRadius: 8,  borderWidth: 1,  borderColor: '#ddd', marginBottom: height * 0.02,  paddingHorizontal: width * 0.04, height: height * 0.065, },
  inputField: { flex: 1, fontSize: width * 0.045, height: '100%' },
  inputIcon: { marginLeft: width * 0.02 },
  actionsContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: width * 0.05, height: width * 0.05, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: width * 0.02, fontSize: width * 0.035, color: '#333' },
  buttonContainer: { width: '100%' },
  button: { width: '100%', backgroundColor: '#27B9BA', paddingVertical: height * 0.018, borderRadius: 8, alignItems: 'center', marginBottom: height * 0.02 },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold' },
  linkText: { color: '#007AFF', fontSize: width * 0.04 },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: height * 0.01 },
  newUserContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.03 },
});
