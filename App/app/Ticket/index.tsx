import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTicket } from "@/services/ticket";
import { createPendingTicket, deletePendingTicket, getPendingTicketsByClient, updatePendingTicket } from "@/services/pending_tickets";
import { Ionicons } from "@expo/vector-icons";

export default function ConfirmTickets() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [appointments, setAppointments] = useState<any[]>([]);

  const cardColors = ["#27B9BA", "#1c8888ff"];
  const clientId = params.client_id;
  const storageKey = `appointments_${clientId}`;

  const newAppointment = {
    partner_id: Number(params.partner_id),
    car_id: Number(params.car_id),
    client_id: Number(params.client_id),
    date: params.date,
    time: params.time,
    partner_name: params.partner_name,
    partner_phone: params.partner_phone,
    logo_url: params.logo_url,
    notes: "",
  };

  const autoCreatePending = async (appointment: any) => {
    try {
      const result = await createPendingTicket({
        client_id: Number(appointment.client_id),
        car_id: appointment.car_id,
        partner_id: appointment.partner_id,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes,
        partner_name: appointment.partner_name,
        partner_phone: appointment.partner_phone,
        logo_url: appointment.logo_url,
      });

      if (result && result.id) {
        appointment.pending_id = result.id;
        return appointment;
      } else {
        console.warn("No se obtuvo ID del pending_ticket creado:", result);
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        let list: any[] = await getPendingTicketsByClient(Number(clientId));

        list = list.map(ticket => ({
          ...ticket,
          pending_id: ticket.id,
          notes: ticket.notes || "",
        }));

        const exists = list.some(
          (app: any) =>
            app.partner_id === newAppointment.partner_id &&
            app.date === newAppointment.date &&
            app.time === newAppointment.time
        );

        if (!exists) {
          const created = await autoCreatePending(newAppointment);
          list.push(created);
        }

        setAppointments(list);
      } catch (err) {
        console.log("Error inicializando pantalla:", err);
      }
    };

    init();
  }, []);

  const deleteAppointment = async (index: number) => {
    const updated = [...appointments];
    const appointmentToDelete = updated[index];

    if (!appointmentToDelete) {
      console.warn("Appointment no encontrado en índice:", index);
      return;
    }

    const id = appointmentToDelete.pending_id;

    try {
      if (id) {
        const success = await deletePendingTicket(id);
        if (!success) {
          Alert.alert("Error", "No se pudo eliminar el ticket de la base de datos. Intenta nuevamente.");
          return;
        }
      } else {
        console.warn("Este appointment no tiene pending_id, solo se eliminará localmente");
      }

      updated.splice(index, 1);
      setAppointments(updated);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      Alert.alert("Error", "Hubo un problema al eliminar la cita");
    }
  };

  const formatDateMySQL = (ddmmyyyy: string, time: string) => {
    const [day, month, year] = ddmmyyyy.split("-");
    let [hour, minutes] = time.replace(" AM", "").replace(" PM", "").split(":");

    let h = parseInt(hour);
    if (time.includes("PM") && h !== 12) h += 12;
    if (time.includes("AM") && h === 12) h = 0;

    return `${year}-${month}-${day} ${h.toString().padStart(2, "0")}:${minutes}:00`;
  };

  const confirmAll = async () => {
    try {
      if (appointments.length === 0) {
        Alert.alert("Sin citas", "No hay citas para confirmar.");
        return;
      }

  for (let app of appointments) {
    if (app.confirmed) continue;

    const formattedDate = formatDateMySQL(app.date, app.time);

    await createTicket({
      client_id: Number(app.client_id),
      car_id: app.car_id,
      partner_id: app.partner_id,
      date: formattedDate,
      notes: app.notes || "",
    });

    if (app.pending_id) {
      const deleted = await deletePendingTicket(app.pending_id);
      if (!deleted) console.warn(`No se pudo eliminar pending_id ${app.pending_id}`);
    } else {
      console.warn("Appointment no tiene pending_id, no se eliminó pending ticket");
    }

    app.confirmed = true;
  }

  await AsyncStorage.removeItem(storageKey);
    router.replace("/Appointment/confirmedAppointment");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al confirmar las citas");
      console.error(error);
    }
  };

  const noteTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateNote = (index: number, newNote: string) => {
    const updated = [...appointments];
    updated[index].notes = newNote;
    setAppointments(updated);

    if (noteTimeout.current) clearTimeout(noteTimeout.current);

    noteTimeout.current = setTimeout(async () => {
      const appointment = updated[index];

      if (appointment.pending_id) {
        try {
          await updatePendingTicket(appointment.pending_id, {
            notes: newNote,
          });
        } catch (error) {
          console.error("Error guardando nota:", error);
        }
      }
    }, 600);
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
          <Text style={styles.title}>Crear una cita</Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 140, margin: 20, marginTop: 5 }}>
          {appointments.map((item, index) => {
            const bgColor = cardColors[index % cardColors.length];
            return (
              <View key={index} style={[styles.card, { backgroundColor: bgColor }]}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAppointment(index)}>
                  <Ionicons name="trash-outline" size={22} color="#fff" />
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

                <TextInput
                  style={styles.notesInput}
                  placeholder="Describe el problema de tu auto (Opcional)"
                  placeholderTextColor="#888"
                  value={item.notes}
                  onChangeText={(text) => updateNote(index, text)}
                  multiline
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.confirmButton, { backgroundColor: "#27B9BA" }]} onPress={confirmAll}>
            <Text style={styles.confirmText}>Confirmar Citas</Text>
          </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA" },
  titleContainer: { width: "100%", marginTop: -5, marginBottom: -5 },
  title: { fontSize: 25, fontWeight: "bold", color: "#000", textAlign: "center", margin: 10 },
  card: { padding: 15, borderRadius: 12, marginBottom: 5, position: "relative" },
  deleteButton: { position: "absolute", top: 10, right: 10, zIndex: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  logo: { width: 50, height: 50, borderRadius: 10, marginRight: 10, resizeMode: 'contain', backgroundColor: '#ffffffff' },
  partnerName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  phone: { color: "#fff", fontSize: 14 },
  infoText: { color: "#fff", fontSize: 15, marginLeft: 6 },
  dateTimeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  notesInput: { backgroundColor: "#fff", padding: 8, borderRadius: 8, marginTop: 10, color: "#000", borderWidth: 1, borderColor: "#ccc" },
  buttonRow: { position: "absolute", bottom: 65, left: 20, right: 20 },
  confirmButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  actionButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  actionButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
