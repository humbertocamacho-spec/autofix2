import { Stack, useRouter, useFocusEffect } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { createTicket } from "@/services/ticket";
import { getPendingTicketsByClient, deletePendingTicket } from "@/services/pending_tickets";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TicketsPending() {
  const router = useRouter();
  const [pendingTickets, setPendingTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPending = async () => {
        setLoading(true);
        try {
          const storedClientId = await AsyncStorage.getItem("client_id");
          if (!storedClientId) {
            setPendingTickets([]);
            setLoading(false);
            return;
          }

          const client_id = Number(storedClientId);
          const list = (await getPendingTicketsByClient(client_id)) || [];
          setPendingTickets(list);
        } catch (err) {
          console.error("Error cargando citas:", err);
          Alert.alert("Error", "No se pudieron cargar las citas");
        } finally {
          setLoading(false);
        }
      };

      fetchPending();
    }, [])
  );

  const deleteAppointment = async (index: number) => {

    Alert.alert(
      "Eliminar cita",
      "Esta cita está pendiente de confirmación, ¿deseas eliminarla?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const updated = [...pendingTickets];
            const appointmentToDelete = updated[index];

            if (!appointmentToDelete) {
              console.warn("Appointment no encontrado en índice:", index);
              return;
            }

            const id = appointmentToDelete.id || appointmentToDelete.pending_id;

            try {
              if (id) {
                const success = await deletePendingTicket(id);
                if (!success) {
                  Alert.alert("Error", "No se pudo eliminar la cita de la base de datos.");
                  return;
                }
              }

              updated.splice(index, 1);
              setPendingTickets(updated);
            } catch (err) {
              Alert.alert("Error", "Hubo un problema al eliminar la cita");
            }
          }
        }
      ]
    );
  };


  const formatToMySQL = (date: string, time: string) => {
    const [day, month, year] = date.split("-");
    let [hour, minutes] = time.replace(" AM", "").replace(" PM", "").split(":");

    let h = parseInt(hour);
    if (time.includes("PM") && h !== 12) h += 12;
    if (time.includes("AM") && h === 12) h = 0;

    return `${year}-${month}-${day} ${h.toString().padStart(2, "0")}:${minutes}:00`;
  };

  const confirmAllPending = async () => {
    try {
      if (pendingTickets.length === 0) {
        Alert.alert("Sin citas", "No hay citas para confirmar.");
        return;
      }

      for (let app of pendingTickets) {
        const formattedDate = formatToMySQL(app.date, app.time);

        await createTicket({
          client_id: Number(app.client_id),
          car_id: app.car_id,
          partner_id: app.partner_id,
          date: formattedDate,
          notes: app.notes || "",
        });

        if (app.id || app.pending_id) {
          const idToDelete = app.pending_id || app.id;
          await deletePendingTicket(idToDelete);
        }
      }

      setPendingTickets([]);
      Alert.alert("¡Listo!", "Citas confirmadas correctamente");

      router.replace("/Appointment/confirmedAppointment");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Ocurrió un problema al confirmar tus citas");
    }
  };

  const handleEditAppointment = (appointment: any, index: number) => {

    const pendingId = Number(appointment.pending_id || appointment.id);

    if (!pendingId || isNaN(pendingId)) {
      Alert.alert("Error", "No se puede editar esta cita");
      return;
    }

    const [day, month, year] = (appointment.date || "").split("-");
    if (!day || !month || !year) {
      Alert.alert("Error", "Fecha inválida");
      return;
    }

    router.push({
      pathname: "/Appointment/AppointmentEdit",
      params: {
        pending_id: pendingId.toString(),
        partner_id: appointment.partner_id,
        partner_name: appointment.partner_name || "Taller",
        partner_phone: appointment.partner_phone || "",
        logo_url: appointment.logo_url || "",
        currentDate: appointment.date,
        currentTime: appointment.time,
        currentYear: year,
        currentMonth: String(Number(month) - 1),
        currentDay: day,
        notes: appointment.notes || "",
      },
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const bgColor = ["#27B9BA", "#1c8888ff"][index % 2];
    return (
      <View style={[styles.card, { backgroundColor: bgColor }]}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAppointment(index)}>
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditAppointment(item, index)}
        >
          <Ionicons name="pencil" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.row}>
          {item.logo_url && <Image source={{ uri: item.logo_url }} style={styles.logo} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerName}>{item.partner_name}</Text>
            <Text style={styles.phone}>{item.partner_phone}</Text>
          </View>
        </View>

        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {item.date}</Text>
          <View style={{ width: 25 }} />
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.infoText}> {item.time}</Text>
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
          <Text style={styles.title}>Citas Pendientes</Text>
        </View>

        {loading ? (
          <View style={{ padding: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#27B9BA" />
            <Text style={{ marginTop: 10 }}>Cargando citas pendientes...</Text>
          </View>
        ) : pendingTickets.length === 0 ? (
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#cacacaff", textAlign: "center" }}>
              No tienes citas pendientes
            </Text>
          </View>
        ) : (
          <FlatList
            data={pendingTickets}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {pendingTickets.length > 0 && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: "#27B9BA" }]} onPress={confirmAllPending} >
              <Text style={styles.actionButtonText}>Confirmar Citas</Text>
            </TouchableOpacity>
          </View>
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
  deleteButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  editButton: { position: "absolute", top: 50, left: "100%", zIndex: 10, },
  card: { padding: 15, borderRadius: 12, marginBottom: 10, position: "relative" },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'contain', backgroundColor: '#ffffffff' },
  partnerName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  phone: { color: "#fff", fontSize: 14 },
  infoText: { color: "#fff", fontSize: 15, marginLeft: 6 },
  dateTimeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  notesText: { color: "#fff", marginTop: 10, fontStyle: "italic" },
  buttonRow: { position: "absolute", bottom: 65, left: 20, right: 20 },
  confirmButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  actionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
