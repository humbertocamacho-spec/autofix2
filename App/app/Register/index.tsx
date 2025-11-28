import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, PixelRatio } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RememberCheckBoxProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
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

export default function RegisterScreen() {
  const { width, height } = useWindowDimensions();
  const scaleFont = (size: number) => size * PixelRatio.getFontScale();
  const moderateScale = (size: number) => size * (width / 375);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = 'https://backend-autofix-production.up.railway.app';

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError('Completa todos los campos');
      return;
    }

    const emailvalidate = /^[^\s@]+@gmail\.com$/;
    const phonevalidate = /^[0-9]{10}$/;

    if (!emailvalidate.test(email)) {
      Alert.alert('Error', 'El correo electrónico es inválido. Recuerda que debe incluir el símbolo "@" y un dominio (example@email.com).');
      return;
    }

    if (!phonevalidate.test(phone)) {
      Alert.alert('Error', 'El número debe ser de 10 dígitos y solo contener números, sin espacios, guiones o extensiones.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        Alert.alert('Error', data.message ?? 'Error desconocido');
        return;
      }

      Alert.alert('Éxito', 'Cuenta creada correctamente');
      router.replace('../Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar al servidor');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', marginBottom: moderateScale(-30) }}>
            <Image
              source={require('../../assets/images/LogoAutoFix.png')}
              style={{ width: moderateScale(200), height: moderateScale(200) }}
              resizeMode="contain"
            />
          </View>

          <View style={{ alignItems: 'center', marginBottom: moderateScale(50) }}>
            <Text style={[styles.title, { fontSize: moderateScale(34) }]}>¡Comencemos!</Text>
            <Text style={[styles.subtitle, { fontSize: moderateScale(15) }]}>
              Completa los datos para registrarte
            </Text>
          </View>

          <View style={{ marginBottom: moderateScale(15) }}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.inputField, { fontSize: scaleFont(16) }]}
                placeholder="Nombre"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Ionicons name="person-outline" size={Math.min(width * 0.05, 28)} color="#27B9BA" />
            </View>

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
                style={[styles.inputField, { fontSize: scaleFont(16) }]}
                placeholder="Teléfono"
                placeholderTextColor="#888"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <Ionicons name="call-outline" size={Math.min(width * 0.05, 28)} color="#27B9BA" />
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

            <View style={styles.actionsContainer}>
              <RememberCheckBox
                value={remember}
                onValueChange={setRemember}
                label="Al marcar esta casilla aceptas nuestros"
              />
              <TouchableOpacity onPress={() => console.log('Términos y condiciones')}>
                <Text style={[styles.textCondition, { fontSize: scaleFont(10) }]}>
                  Términos y Condiciones
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, { paddingVertical: moderateScale(12) }]}
            onPress={handleRegister}
          >
            <Text style={[styles.buttonText, { fontSize: scaleFont(17) }]}>Siguiente</Text>
          </TouchableOpacity>

          <View style={styles.newUserContainer}>
            <Text>¿Ya tienes un usuario?</Text>
            <TouchableOpacity onPress={() => router.push('/Login')}>
              <Text style={[styles.linkText, { marginLeft: 5 }]}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, paddingHorizontal: 15, height: 55 },
  inputField: { flex: 1, height: '100%' },
  inputIcon: { marginLeft: 10 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: 8, fontSize: 10, color: '#333' },
  textCondition: { color: '#007AFF' },
  button: { backgroundColor: '#27B9BA', borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  title: { fontWeight: 'bold', color: '#27B9BA', textAlign: 'center' },
  subtitle: { color: '#000', textAlign: 'center' },
  linkText: { color: '#007AFF', fontSize: 15 },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  newUserContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
