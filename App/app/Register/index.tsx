import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function RegisterScreen() {
  const [name,setName] = useState("");
  const [lastname,setLastName] = useState("")
  const [phone,setPhone] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isDisabled = !name || !lastname || !phone || !email || !password;

  const handleRegister = async () => {
  if (isDisabled) {
    Alert.alert('Error', 'Completa todos los campos');
    return;
  }

  try {
    const res = await fetch('http://192.168.2.8:5001/api/auth/register', { // usa 10.0.2.2 si es emulador Android
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastname, phone, email, password }),
    });

    const data = await res.json();

    if (!data.ok) {
      Alert.alert('Error', data.message);
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.titlecompany}>AutoFix</Text>

        <Text style={styles.title}>Create Account</Text>

        <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
        />

        <TextInput
            style={styles.input}
            placeholder="LastName"
            value={lastname}
            onChangeText={setLastName}
            autoCapitalize="words"
        />

        <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled, { marginBottom: 15 }]} 
          onPress={handleRegister}
          disabled={!name || !lastname || !phone || !email || !password}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.button]}
            onPress={() => router.replace('/Login')}
            >
            <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>


      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titlecompany: {fontSize: 56, fontWeight: 'bold' , marginBottom: 50, textAlign: 'center', color: '#333'},
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#A0CFFF' },
});
