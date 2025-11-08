import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {  Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Text, ScrollView, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type RememberCheckBoxProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
};

const RememberCheckBox: React.FC<RememberCheckBoxProps> = ({ value, onValueChange, label }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)} activeOpacity={0.8} >
    <View style={[styles.checkbox, value && styles.checkboxChecked]} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function RegisterScreen() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [remember, setRemember] = useState<boolean>(false);
  const API_URL = "https://backend-autofix-production.up.railway.app";

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError('Completa todos los campos');
      return;
    }

    const emailvalidate = /^[^\s@]+@gmail\.com$/;
    const phonevalidate = /^[0-9]{10}$/;

    if (!emailvalidate.test(email)) {
      Alert.alert('Error', 'Correo Invalido');
      return;
    }

    if (!phonevalidate.test(phone)) {
      Alert.alert('Error', 'Telefono Invalido');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La Contraseña debe incluir al menos 8 caracteres');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data: { ok: boolean; message?: string } = await res.json();

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
        style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 25 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/LogoAutoFix.png')}
              style={styles.logo}
              resizeMode='contain'
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>¡Comencemos!</Text>
            <Text style={styles.subtitle}>Completa los datos para registrarte</Text>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputField}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <Ionicons  name="person-outline" size={width * 0.06} color="#27B9BA" style={styles.inputIcon} />
            </View>

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
                placeholder="Teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
              <Ionicons name="call-outline" size={width * 0.06} color="#27B9BA" style={styles.inputIcon}/>
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
              <Ionicons name="lock-closed-outline" size={width * 0.06} color="#27B9BA" style={styles.inputIcon}
              />
            </View>

            <View style={styles.actionsContainer}>
              <RememberCheckBox value={remember} onValueChange={setRemember} label={"Al marcar esta casilla aceptas nuestros"}/>
              <TouchableOpacity onPress={() => console.log('Términos y Condiciones')}>
                <Text style={styles.textCondition}>Términos y Condiciones</Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.newUserContainer}>
            <Text>¿Ya tienes un usuario?</Text>
            <TouchableOpacity onPress={() => router.push('/Login')}>
              <Text style={styles.linkText}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({

  logoContainer: { marginTop: height * 0.03, marginBottom: height * -0.07, alignItems: 'center' },
  logo: { width: width * 0.6, height: width * 0.6 },
  titleContainer: { alignItems: 'center', marginBottom: height * 0.03 },
  title: { fontSize: width * 0.1, fontWeight: 'bold', color: '#27B9BA', textAlign: 'center' },
  subtitle: { fontSize: width * 0.045, color: '#000', textAlign: 'center', marginTop: height * 0.005 },
  inputContainer: { width: '100%', marginBottom: height * 0.03 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: height * 0.02, paddingHorizontal: width * 0.04,height: height * 0.065},
  inputField: { flex: 1, fontSize: width * 0.045, height: '100%' },
  inputIcon: { marginLeft: width * 0.02 },
  actionsContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.05 },
  checkbox: { width: width * 0.05, height: width * 0.05, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: width * 0.02, fontSize: width * 0.03, color: '#333' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  textCondition: { fontSize: width * 0.025, color: '#007AFF' },
  buttonContainer: { width: '100%' },
  button: { width: '100%', backgroundColor: '#27B9BA', paddingVertical: height * 0.018, borderRadius: 8, alignItems: 'center', marginBottom: height * 0.02 },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold' },
  newUserContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: height * 0.03 },
  linkText: { color: '#007AFF', fontSize: width * 0.04, marginLeft: 5 },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: height * 0.01 }
});
