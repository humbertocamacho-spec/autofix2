import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View,Text,ScrollView,Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';

export default function RegisterScreen() {
  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const handleRegister = async () => {
    if (!name||!email || !phone|| !password) {
    setError('Completa todos los campos');
    return;
  }

    const emailvalidate = /^[^\s@]+@gmail\.com$/;
    const phonevalidate = /^[0-9]{10}$/;

    if(!emailvalidate.test(email)) {
      Alert.alert('Error','Correo Invalido');
      return;
    }

    if(!phonevalidate.test(phone)) {
      Alert.alert('Error','Telefono Invalido');
      return;
    }

    if(password.length < 8) {
      Alert.alert('Error','La Contraseña debe incluir almenos 8 caracteres')
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, password }),
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

      type RememberCheckBoxProps = {
      value: boolean;
      onValueChange: (newValue: boolean) => void;
      label: string;
      };

    const RememberCheckBox: React.FC<RememberCheckBoxProps> = ({ value, onValueChange, label }) => {
        return (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onValueChange(!value)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>{label}</Text>
          </TouchableOpacity>
        );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logContainer}>
          <Image
            source={require('../../assets/images/LogoAutoFix.png')}
            style={styles.LogoAutoFix}
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
          <Ionicons 
              name="person-outline"
              size={20}
              color="#27B9BA"
              style={styles.inputIcon}
          />
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
          <Ionicons
              name="mail-outline"
              size={20}
              color="#27B9BA"
              style={styles.inputIcon}
          />
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
          <Ionicons
              name="call-outline"
              size={20}
              color="#27B9BA"
              style={styles.inputIcon}
          />
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
          <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#27B9BA"
              style={styles.inputIcon}
          />
          </View>
          <View style={styles.actionsContainer}>
              <RememberCheckBox
                value={remember}
                onValueChange={setRemember}
                label={"Al marcar esta casilla aceptas nuestros"}
                />
              <TouchableOpacity onPress={() => console.log('Terminos y Condiciones')}>
                <Text style={styles.textcondition}>Terminos y Condiciones</Text>
              </TouchableOpacity>
           </View>
      </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button]} 
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Siguiente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.newuserContainer}>
          <Text>¿Ya tienes un usuario?</Text>
         <TouchableOpacity onPress={() => router.push('/Login')}>
             <Text style={[styles.linkText, { marginLeft: 5 }]}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#f5f5f5' },
  logContainer: { alignItems: 'center', marginTop: 30 },
  LogoAutoFix: { width: 250, height: 250 },
  title: { fontSize: 38, fontWeight: 'bold', textAlign: 'center', color: '#27B9BA' },
  subtitle: { fontSize: 18, fontWeight: 'normal', marginBottom: 25, textAlign: 'center', color: '#000000ff' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  inputContainer: { width: '100%', marginBottom: 15 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 15, paddingHorizontal: 15 },
  inputField: { flex: 1, height: 50, fontSize: 16 },
  inputIcon: { marginLeft: 10 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  buttonContainer: { width: '100%' },
  button: { width: '100%', backgroundColor: '#27B9BA', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#27B9BA', opacity: 0.6 }, 
  newuserContainer: { width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  actionsContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#27B9BA' },
  checkboxLabel: { marginLeft: 8, fontSize: 10, color: '#333' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  linkText: { color: '#007AFF', fontSize: 14 },
  textcondition: { color: '#007AFF', fontSize: 11 },
  titleContainer: { textAlign: 'center', marginBottom: 25, marginTop: -45 }

});