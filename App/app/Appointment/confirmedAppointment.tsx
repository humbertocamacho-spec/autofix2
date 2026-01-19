import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function confirmedAppointment() {
  const router = useRouter();

  return (
   <>
      <Stack.Screen options={{ headerShown: false }} />
   
      <View style={styles.header}></View>  

      <View style={styles.container}>

        <Image source={require('@/assets/images/1763844617177.png')} style={styles.personageImage} />
        <View style={styles.box}>
          <Ionicons name="checkmark-circle-outline" size={60} color="#fff" />
          <Text style={styles.text}>Citas confirmadas</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#27B9BA" }]}
            onPress={() => router.push({ pathname: "/Map" })}
          >
            <Text style={styles.actionButtonText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", },
  header: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 80, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA"},
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, },
  box: { width: "80%", backgroundColor: "#27B9BA", paddingVertical: 30, borderRadius: 20, alignItems: "center", },
  text: { fontSize: 22, color: "#fff", fontWeight: "bold", marginTop: 10, },
  buttonRow: { position: "absolute", bottom: 65, left: 20, right: 20 },
  confirmButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  actionButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  personageImage: { width: "100%", height: "50%", resizeMode: "center", marginBottom: -80, marginTop: 30,},
});
