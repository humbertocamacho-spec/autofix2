import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
  if (!email || !password) {
    setError('Completa todos los campos');
    return;
  }

  try {
    const res = await fetch('http://192.168.2.8:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.ok) {
      setError(data.message);
      return;
    }

    setError('');
    // Guardar userId o token si quieres
    router.replace('/Map'); // Navegar a la pantalla principal
  } catch (err) {
    console.error(err);
    setError('No se pudo conectar al servidor');
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

        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, !email || !password ? styles.buttonDisabled : {}, { marginBottom: 15 }]}
          onPress={handleLogin}
          disabled={!email || !password}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => router.push('../Register')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titlecompany: {fontSize: 56, fontWeight: 'bold' , marginBottom: 130, textAlign: 'center', color: '#333'},
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'left', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#A0CFFF' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
