import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { getConfirmedTickets, deleteTicket } from "@/services/ticket";

export default function TicketsConfirmed() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cardColors = ["#27B9BA", "#1c8888ff"];

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const list = await getConfirmedTickets();
      setTickets(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBorderColor = (status?: string) => {
    switch (status) {
      case "pendiente":
        return "#B0B0B0";
      case "revision":
        return "#F5C542";
      case "finalizado":
        return "#2ECC71";
      default:
        return "#B0B0B0";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "pendiente":
        return "Pendiente";
      case "revision":
        return "En Revisión";
      case "finalizado":
        return "Finalizado";
      default:
        return "";
    }
  };

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
              setTickets(prev => prev.filter(t => t.id !== ticketId));
              Alert.alert("La cita fue cancelada correctamente.");
            } else {
              Alert.alert("Error", "No se pudo cancelar la cita.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }: any) => {
    const bgColor = cardColors[index % cardColors.length];
    const dateObj = new Date(item.date);

    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View style={[styles.card, { backgroundColor: bgColor }]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.row}>
          {item.logo_url && (
            <Image source={{ uri: item.logo_url }} style={styles.logo} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{item.partner_name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {date}</Text>
          <View style={{ width: 20 }} />
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {time}</Text>
        </View>

        {item.notes ? (<Text style={styles.notesText}>{item.notes}</Text>) : null}

        <View
          style={[
            styles.statusBar,
            { backgroundColor: getStatusBorderColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
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
        <Text style={styles.title}>Citas Confirmadas</Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#27B9BA" />
            <Text>Cargando citas...</Text>
          </View>
        ) : tickets.length === 0 ? (
          <View style={styles.center}>
            <Text>No tienes citas confirmadas</Text>
          </View>
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA", },
  title: { fontSize: 25, fontWeight: "bold", textAlign: "center", marginVertical: 10, },
  card: { padding: 15, borderRadius: 12, marginBottom: 12, overflow: "hidden", paddingBottom: 0, paddingRight: 48},
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 50, height: 50, borderRadius: 10, marginRight: 10, backgroundColor: "#fff", resizeMode: 'contain', },
  partnerName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  phone: { color: "#fff" },
  dateTimeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  infoText: { color: "#fff", marginLeft: 6 },
  notesText: { color: "#fff", marginTop: 10, fontStyle: "italic" },
  cancelButton: { position: "absolute", top: 10, right: 10 },
  center: { alignItems: "center", padding: 20 },
  statusBar: { height: 26, backgroundColor: "#2ECC71", marginLeft: -15, marginRight: -50, justifyContent: "center", alignItems: "center", borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginTop: 10},
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", },
});
