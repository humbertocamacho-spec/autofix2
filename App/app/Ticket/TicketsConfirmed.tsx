import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { getTicketsByClient, deleteTicket } from "@/services/ticket";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TicketsConfirmed() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cardColors = ["#27B9BA", "#1c8888ff"];

  useEffect(() => {
    const fetchTickets = async () => {
      const storedClientId = await AsyncStorage.getItem("client_id");
      if (!storedClientId) {
        setLoading(false);
        return;
      }

      const client_id = Number(storedClientId);
      try {
        const list = await getTicketsByClient(client_id) || [];
        setTickets(list);
      } catch (error) {
        console.error("Error al obtener citas confirmadas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCancel = async (ticketId: number) => {
    Alert.alert(
      "Cancelar Cita",
      "¿Desea cancelar esta cita?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            const success = await deleteTicket(ticketId);

            if (success) {
              const updated = tickets.filter(t => t.id !== ticketId);
              setTickets(updated);
              Alert.alert("La cita fue cancelada correctamente.");
            } else {
              Alert.alert("Error", "No se pudo cancelar la cita. Intenta nuevamente.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const bgColor = cardColors[index % cardColors.length];

    const dateObj = new Date(item.date);

    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const year = dateObj.getUTCFullYear();
    const date = `${month}-${day}-${year}`;

    let hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hoursStr = hours.toString().padStart(2, "0");
    const time = `${hoursStr}:${minutes} ${ampm}`;

    return (
      <View style={[styles.card, { backgroundColor: bgColor }]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)} >
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.row}>
          {item.logo_url && <Image source={{ uri: item.logo_url }} style={styles.logo} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{item.partner_name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {date}</Text>
          <View style={{ width: 25 }} />
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {time}</Text>
        </View>

        {item.notes ? <Text style={styles.notesText}>{item.notes}</Text> : null}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Citas Confirmadas</Text>
        </View>

        {loading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#27B9BA" />
            <Text style={{ marginTop: 10 }}>Cargando citas confirmadas...</Text>
          </View>
        ) : tickets.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#cacacaff", textAlign: "center" }}>No tienes citas confirmadas</Text>
          </View>
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA" },
  titleContainer: { width: "100%", marginTop: -5, marginBottom: -5 },
  title: { fontSize: 25, fontWeight: "bold", color: "#000", textAlign: "center", margin: 10 },
  card: { padding: 15, borderRadius: 12, marginBottom: 10, position: "relative" },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  partnerName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  phone: { color: "#fff", fontSize: 14 },
  infoText: { color: "#fff", fontSize: 15, marginLeft: 6 },
  dateTimeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  notesText: { color: "#fff", marginTop: 10, fontStyle: "italic" },
  cancelButton: { position: "absolute", top: 10, right: 10, zIndex: 10 }
});
