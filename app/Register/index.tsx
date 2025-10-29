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

  const handleRegister = () => {
    
    if (isDisabled) {
        Alert.alert('Error', 'Completa todos los campos');
        return;
    }

    Alert.alert('Éxito', 'Cuenta creada (Ejemplo)');
    router.replace('../Login');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
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
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#A0CFFF' },
});
