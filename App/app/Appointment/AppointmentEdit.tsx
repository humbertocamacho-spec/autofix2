import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { updatePendingTicket } from "@/services/pending_tickets";
import { getOccupiedHours } from "@/services/ticket";

const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const availableHours = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","12:00 PM","12:30 PM","01:30 PM","02:00 PM","03:00 PM","04:30 PM","05:00 PM","05:30 PM"];

export default function AppointmentEdit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const pending_id = Number(params.pending_id);
  const partner_id = Number(params.partner_id);

  const [currentMonth, setCurrentMonth] = useState(Number(params.currentMonth));
  const [currentYear, setCurrentYear] = useState(Number(params.currentYear));
  const [selectedDate, setSelectedDate] = useState<number>(Number(params.currentDay));
  const [selectedTime, setSelectedTime] = useState<string | null>(params.currentTime as string || null);
  const [notes, setNotes] = useState<string>(params.notes as string || "");
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedMonthYear, setSelectedMonthYear] = useState(
    `${months[Number(params.currentMonth)]} - ${params.currentYear}`
  );

  useEffect(() => {
    setSelectedMonthYear(`${months[currentMonth]} - ${currentYear}`);
  }, [currentMonth, currentYear]);

  const today = new Date();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();

  const monthYearOptions: string[] = [];
  const years = Array.from({ length: 1 }, (_, i) => today.getFullYear() + i);
  years.forEach(year => {
    const startMonth = year === today.getFullYear() ? today.getMonth() : 0;
    for (let m = startMonth; m < 12; m++) {
      monthYearOptions.push(`${months[m]} - ${year}`);
    }
  });

  useEffect(() => {
    if (!selectedDate) return;
    const fetchOccupied = async () => {
      const formatted = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`;
      const occupied = await getOccupiedHours(partner_id, formatted);
      const normalized = (occupied || []).map((h: string) => h.length === 7 ? '0' + h : h);
      setOccupiedHours(normalized);
    };
    fetchOccupied();
  }, [selectedDate, currentMonth, currentYear, partner_id]);

  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const startDay = currentYear === today.getFullYear() && currentMonth === today.getMonth() ? today.getDate() : 1;
  const validDays = Array.from({ length: daysInMonth - startDay + 1 }, (_, i) => i + startDay);

  const parseHourToMinutes = (t: string) => {
    const [time, period] = t.split(" ");
    let [h, m] = time.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  };

  const filteredHours = availableHours.filter(hour => {
    if (occupiedHours.includes(hour)) return false;
    const isToday = currentYear === today.getFullYear() && currentMonth === today.getMonth() && selectedDate === today.getDate();
    if (isToday && parseHourToMinutes(hour) <= nowMinutes) return false;
    return true;
  });

  const handleSave = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Selecciona fecha y hora");
      return;
    }

    const newDateStr = `${String(selectedDate).padStart(2,'0')}-${String(currentMonth + 1).padStart(2,'0')}-${currentYear}`;

    try {
      const updates: any = {};
      updates.date = newDateStr;
      updates.time = selectedTime;
      if (notes.trim() !== (params.notes as string || "").trim()) {
        updates.notes = notes.trim() || null;
      }

      await updatePendingTicket(pending_id, updates);

      Alert.alert("¡Listo!", "Cita actualizada correctamente", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (err: any) {
      console.error("Error actualizando:", err);
      Alert.alert("Error", err.error || "No se pudo guardar");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Editar Cita</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
              <View>
                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                  {params.partner_name}
                </Text>

                <TouchableOpacity style={styles.customPicker} onPress={() => setModalVisible(true)}>
                  <Text style={styles.customPickerText}>{selectedMonthYear}</Text>
                  <Ionicons name="chevron-down-outline" size={24} color="#000" />
                </TouchableOpacity>

                <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                  <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                      <FlatList
                        data={monthYearOptions}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity style={styles.modalItem} onPress={() => {
                            const [monthName, yearStr] = item.split(" - ");
                            setCurrentMonth(months.indexOf(monthName));
                            setCurrentYear(Number(yearStr));
                            setSelectedMonthYear(item);
                            setSelectedDate(1);
                            setSelectedTime(null);
                            setModalVisible(false);
                          }}>
                            <Text style={styles.modalItemText}>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel} contentContainerStyle={styles.carouselContent}>
                  {validDays.map(day => {
                    const dayOfWeek = (firstDayIndex + day - 1) % 7;
                    return (
                      <TouchableOpacity
                        key={day}
                        style={[styles.dayButton, selectedDate === day && styles.selectedDay]}
                        onPress={() => { setSelectedDate(day); setSelectedTime(null); }}
                      >
                        <Text style={[styles.dayText, selectedDate === day && { color: '#fff' }]}>{day}</Text>
                        <Text style={[styles.dayName, selectedDate === day && { color: '#fff' }]}>{dayNames[dayOfWeek]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20 }}>Horario disponible:</Text>
                <View style={styles.hoursGrid}>
                  {filteredHours.map(hour => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.hourItem, selectedTime === hour && styles.hourItemSelected]}
                      onPress={() => setSelectedTime(hour)}
                    >
                      <Text style={[styles.hourItemText, selectedTime === hour && { color: '#fff' }]}>{hour}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10, marginBottom: 8 }}>Notas (opcional):</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Ej: Revisión general, cambio de aceite..."
                  placeholderTextColor="#888"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA" },
  titleContainer: { width: "100%", marginTop: -5, marginBottom: -5 },
  title: { fontSize: 25, fontWeight: "bold", color: "#000", textAlign: "center", margin: 10 },
  dayButton: { alignItems: 'center', justifyContent: 'center', marginRight: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f0f0f0' },
  selectedDay: { backgroundColor: '#27B9BA' },
  dayText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  dayName: { fontSize: 14, color: '#555' },
  hoursGrid: { flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-around', marginTop: 10 },
  hourItem: { width: "30%", backgroundColor: "#f4f4f4", paddingVertical: 6, borderRadius: 12, marginBottom: 10, alignItems: "center" },
  hourItemSelected: { backgroundColor: "#27B9BA" },
  hourItemText: { fontSize: 16, color: "#000" },
  saveButton: { marginTop: 30, backgroundColor: '#27B9BA', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  carousel: { marginTop: 10 },
  carouselContent: { paddingHorizontal: 15 },
  customPicker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  customPickerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 30 },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, maxHeight: 300, marginHorizontal: 20, paddingVertical: 10 },
  modalItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 20, color: '#000' },
  notesInput: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 12, fontSize: 16, minHeight: 100 },
});