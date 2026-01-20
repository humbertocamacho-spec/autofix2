import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, PixelRatio, Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RememberCheckBoxProps } from '../../services/remember_check_box';
import { API_URL } from '../../config/env';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {

    if (!remember) {
      Alert.alert(
        'Aviso',
        'Debes aceptar los Términos y Condiciones para continuar.'
      );
      return;
    }

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

  const openModalTerms = () => {
    setModalVisible(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f5f5f5' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              <TouchableOpacity onPress={openModalTerms}>
                <Text style={[styles.textCondition, { fontSize: scaleFont(10) }]}>
                  Términos y Condiciones
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              { paddingVertical: moderateScale(12) },
              !remember && { backgroundColor: '#9EDDDD' }
            ]}
            onPress={handleRegister}
            disabled={!remember}
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
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          setShowPrivacy(false);
          setModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {showPrivacy ? 'Aviso de Privacidad' : 'Términos y Condiciones'}
            </Text>

            <ScrollView style={{ marginVertical: 15 }} showsVerticalScrollIndicator={false}>
              {!showPrivacy ? (
                <Text style={styles.modalText}>
                  Al registrarte en AutoFix, aceptas los presentes Términos y Condiciones,
                  los cuales regulan el uso de la aplicación y los servicios ofrecidos.

                  {"\n\n"}• La información proporcionada deberá ser veraz, completa y actualizada.
                  {"\n"}• El usuario es responsable del uso correcto de su cuenta.
                  {"\n"}• El uso indebido de la aplicación podrá resultar en la suspensión o
                  cancelación de la cuenta.
                  {"\n"}• AutoFix no se hace responsable por información incorrecta ingresada
                  por el usuario.

                  {"\n\n"}
                  <Text style={styles.privacyLink} onPress={() => setShowPrivacy(true)}>
                    Ver Aviso de Privacidad
                  </Text>
                </Text>
              ) : (
                <Text style={styles.modalText}>
                  En cumplimiento con la Ley Federal de Protección de Datos Personales en
                  Posesión de los Particulares (LFPDPPP), este aviso tiene como finalidad
                  informarle sobre el tratamiento de sus datos personales, las finalidades
                  para su uso y los derechos que le asisten como titular de los mismos.

                  {"\n\n"}IDENTIDAD Y DOMICILIO DEL RESPONSABLE
                  {"\n"}El responsable del tratamiento de sus datos personales es Rebrights
                  S.A. de C.V., con domicilio en Jaumave 3946, Colonia Residencial Abraham
                  Lincoln, Monterrey, Nuevo León, correo electrónico info@rebrights.com y
                  número telefónico 81 2148 0195.

                  {"\n\n"}DATOS PERSONALES RECABADOS
                  {"\n"}Recabamos los siguientes datos personales:
                  {"\n"}• Nombre completo
                  {"\n"}• Correo electrónico
                  {"\n"}• Número de teléfono
                  {"\n"}• Dirección
                  {"\n"}• Preferencias de consumo
                  {"\n"}• Cualquier otra información necesaria para las finalidades descritas.

                  {"\n\n"}FINALIDADES DEL TRATAMIENTO
                  {"\n"}Sus datos personales serán utilizados para:
                  {"\n"}• Ofrecer productos y servicios personalizados.
                  {"\n"}• Realizar campañas publicitarias y promocionales.
                  {"\n"}• Analizar preferencias y tendencias de consumo.
                  {"\n"}• Compartir información con socios comerciales y terceros para fines
                  comerciales y publicitarios.

                  {"\n\n"}TRANSFERENCIA DE DATOS PERSONALES
                  {"\n"}Sus datos personales podrán ser transferidos a terceros, nacionales
                  o extranjeros, incluyendo socios comerciales, agencias publicitarias y
                  proveedores de servicios tecnológicos, exclusivamente para las finalidades
                  señaladas en este aviso.

                  {"\n\n"}DERECHOS ARCO
                  {"\n"}Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (ARCO)
                  al tratamiento de sus datos personales. Para ejercer estos derechos, deberá
                  enviar una solicitud al correo electrónico info@rebrights.com, especificando
                  claramente su petición.

                  {"\n\n"}REVOCACIÓN DEL CONSENTIMIENTO
                  {"\n"}Usted puede revocar en cualquier momento el consentimiento otorgado
                  para el tratamiento de sus datos personales, enviando una solicitud al
                  correo info@rebrights.com.

                  {"\n\n"}CAMBIOS AL AVISO DE PRIVACIDAD
                  {"\n"}Nos reservamos el derecho de realizar modificaciones o actualizaciones
                  al presente aviso de privacidad. Cualquier cambio será publicado en el sitio
                  web www.rebrights.com.

                  {"\n\n"}Atentamente,
                  {"\n"}César Augusto Camacho Torres
                  {"\n"}Co-Fundador

                  {"\n\n"}
                  <Text style={styles.backLink} onPress={() => setShowPrivacy(false)}>
                    ← Volver a Términos y Condiciones
                  </Text>
                </Text>
              )}
            </ScrollView>

            <TouchableOpacity style={styles.modalButton}
              onPress={() => {
                setShowPrivacy(false);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  button: { backgroundColor: '#27B9BA', borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  title: { fontWeight: 'bold', color: '#27B9BA', textAlign: 'center' },
  subtitle: { color: '#000', textAlign: 'center' },
  linkText: { color: '#007AFF', fontSize: 15 },
  error: { color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10 },
  newUserContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',},
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20,},
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#27B9BA', textAlign: 'center',},
  modalText: { fontSize: 14, color: '#333', lineHeight: 22,},
  modalButton: { marginTop: 15, backgroundColor: '#27B9BA', paddingVertical: 12, borderRadius: 8, alignItems: 'center',},
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16,},
  privacyLink: { color: '#007AFF', fontWeight: 'bold', textDecorationLine: 'underline',},
  backLink: { color: '#27B9BA', fontWeight: 'bold', marginTop: 15,},
});
