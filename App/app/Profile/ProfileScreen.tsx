import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { getProfile, updateProfile, deleteAccount } from "@/services/profile";
import { Ionicons } from "@expo/vector-icons";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  photo_url?: string;
  role_name?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [photoInput, setPhotoInput] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const user = await getProfile();
    if (!user) Alert.alert("Error", "No se pudo cargar el perfil");
    setProfile(user);
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    try {
      const phoneClean = profile.phone?.replace(/[^0-9+]/g, "");
      const countryCodeMatch = phoneClean?.match(/^\+(\d{1,3})/);
      const countryCode = countryCodeMatch ? countryCodeMatch[1] : "52";
      const phone = phoneClean?.replace(/^\+\d{1,3}/, "");

      const payload = { ...profile, phone, countryCode };

      await updateProfile(payload);

      setProfile(prev => ({ ...prev, ...payload }));

      Alert.alert("Éxito", "Perfil actualizado");

    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const openPhotoModal = () => {
    setPhotoInput(profile?.photo_url || "");
    setPhotoModalVisible(true);
  };

  const savePhotoUrl = () => {
    if (!profile) return;
    setProfile({ ...profile, photo_url: photoInput });
    setPhotoModalVisible(false);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Estás seguro de que deseas eliminar tu cuenta?\n\nTu cuenta será desactivada para conservar el historial y será revisada por un administrador.\n\nSi cambias de opinión o necesitas ayuda, contáctanos en info@autofix.lat.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert("Cuenta eliminada", "Tu cuenta ha sido desactivada.");
              router.replace("/Login");
            } catch (error: any) {
              Alert.alert("Error", error.message || "No se pudo eliminar la cuenta");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27B9BA" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: "Mi Cuenta" }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titleRecommendations}>Mi Cuenta</Text>

      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f5f5f5' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={openPhotoModal}>
              <View style={styles.photoCircle}>
                <Image
                  source={profile.photo_url ? { uri: profile.photo_url } : require('../../assets/images/profile.png')}
                  style={styles.photoCircleImage}
                />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoOverlayText}>Cambiar</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={profile.phone || ""}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={profile.address || ""}
              onChangeText={(text) => setProfile({ ...profile, address: text })}
            />

            <Text style={styles.label}>Rol</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#eee" }]}
              value={profile.role_name || ""}
              editable={false}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? "Guardando..." : "Guardar"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Eliminar cuenta</Text>
            </TouchableOpacity>
          </View>

          {photoModalVisible && (
            <View style={styles.photoModal}>
              <View style={styles.photoModalContent}>
                <Text style={styles.photoModalTitle}>Cambiar foto</Text>
                <TextInput
                  style={styles.photoInput}
                  placeholder="URL de la foto"
                  value={photoInput}
                  onChangeText={setPhotoInput}
                />
                <View style={styles.photoModalButtons}>
                  <TouchableOpacity onPress={() => setPhotoModalVisible(false)} style={styles.cancelButton}>
                    <Text>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={savePhotoUrl} style={styles.savePhotoButton}>
                    <Text style={{ color: "#fff" }}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 20},
  header: { flexDirection: "row", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA", borderBottomWidth: 1, borderBottomColor: "#eee" },
  titleRecommendations: { fontSize: 25, fontWeight: "bold", color: "#000000ff", textAlign: "center", backgroundColor: "#fff", width: "100%", padding: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  photoCircle: { width: 120, height: 120, borderRadius: 60, overflow: "hidden" },
  photoCircleImage: { width: "100%", height: "100%", resizeMode: "cover" },
  photoOverlay: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "rgba(0,0,0,0.4)", paddingVertical: 5, alignItems: "center" },
  photoOverlayText: { color: "#fff", fontWeight: "bold" },
  form: {},
  label: { marginTop: 10, fontWeight: "600", color: "#27B9BA" },
  input: { backgroundColor: "#eee", padding: 12, borderRadius: 10, marginTop: 5 },
  saveButton: { backgroundColor: "#27B9BA", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 20 },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#FF4D4D", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  deleteButtonText: { color: "#fff", fontWeight: "bold" },
  photoModal: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  photoModalContent: { width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  photoModalTitle: { fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  photoInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 15 },
  photoModalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  savePhotoButton: { padding: 10, backgroundColor: "#27B9BA", borderRadius: 8, alignItems: "center" },
});