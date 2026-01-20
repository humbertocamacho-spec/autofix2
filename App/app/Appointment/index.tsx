import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Linking, Text, ScrollView, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { getCarBrands } from "@/services/car_brands";
import { CarBrands } from '@backend-types/car_brands';
import { getOccupiedHours } from "@/services/ticket";

export default function AppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const availableHours = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "12:00 PM", "12:30 PM", "01:30 PM", "02:00 PM",
    "03:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [car_brands, setCarBrands] = useState<CarBrands[]>([]);
  const [occupiedHours, setOccupiedHours] = useState<string[]>([]);

  const [nowMinutes, setNowMinutes] = useState<number>(today.getHours() * 60 + today.getMinutes());

  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const data = await getCarBrands();
        if (Array.isArray(data)) setCarBrands(data);
      } catch (error) {
        console.error('Error fetching CarBrands:', error);
      }
    };
    fetchCarBrands();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const t = new Date();
      setNowMinutes(t.getHours() * 60 + t.getMinutes());
    }, 30000); // 30s
    return () => clearInterval(iv);
  }, []);

  const monthYearOptions: string[] = [];
  const years = Array.from({ length: 1 }, (_, i) => today.getFullYear() + i);
  years.forEach(year => {
    const startMonth = year === today.getFullYear() ? today.getMonth() : 0;
    for (let m = startMonth; m < 12; m++) {
      monthYearOptions.push(`${months[m]} - ${year}`);
    }
  });

  const [selectedMonthYear, setSelectedMonthYear] = useState(`${months[currentMonth]} - ${currentYear}`);

  useEffect(() => {
    const [monthName, yearStr] = selectedMonthYear.split(' - ');
    const monthIndex = months.indexOf(monthName);
    const yearNum = parseInt(yearStr, 10);
    if (monthIndex !== -1 && !isNaN(yearNum)) {
      setCurrentMonth(monthIndex);
      setCurrentYear(yearNum);
      setSelectedDate(null);
      setSelectedTime(null);
      setOccupiedHours([]);
    }
  }, [selectedMonthYear]);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const location = Array.isArray(params.location) ? params.location[0] : params.location;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const whatsapp = Array.isArray(params.whatsapp) ? params.whatsapp[0] : params.whatsapp;
  const logo_url = Array.isArray(params.logo_url) ? params.logo_url[0] : params.logo_url;
  const latitude = Array.isArray(params.latitude) ? parseFloat(params.latitude[0]) : parseFloat(params.latitude);
  const longitude = Array.isArray(params.longitude) ? parseFloat(params.longitude[0]) : parseFloat(params.longitude);


  if (!id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No se recibió información del partner.</Text>
      </View>
    );
  }

  const handleCall = () => phone && Linking.openURL(`tel:${phone}`);
  const handleWhatsapp = () => {
    if (whatsapp) {
      const phoneNumber = whatsapp.replace(/\D/g, '');
      Linking.openURL(`https://wa.me/${phoneNumber}`).catch(() => alert('No se pudo abrir WhatsApp'));
    }
  };
  const handleLocation = () => {
    if (latitude && longitude) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }
  };

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const startDay =
    currentYear === today.getFullYear() && currentMonth === today.getMonth()
      ? today.getDate()
      : 1;

  const daysArrayRaw = Array.from(
    { length: daysInMonth - startDay + 1 },
    (_, i) => i + startDay
  );

  const parseHourToMinutes = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const validDays = daysArrayRaw.filter((day) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (date < todayStart) return false;

    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    if (isToday) {
      return availableHours.some(h => parseHourToMinutes(h) > nowMinutes);
    }
    return true;
  });

  useEffect(() => {
    if (!selectedDate) return;

    const fetchOccupied = async () => {
      const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

      const occupied = await getOccupiedHours(Number(id), formattedDate);

      setOccupiedHours(occupied);
    };

    fetchOccupied();
  }, [selectedDate, currentMonth, currentYear]);

  useEffect(() => {
    if (selectedDate !== null && !validDays.includes(selectedDate)) {
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [validDays, selectedDate]);

  const filteredHours = availableHours.filter((hour) => {
    if (!selectedDate) return true;

    if (occupiedHours.includes(hour)) return false;

    const selected = new Date(currentYear, currentMonth, selectedDate);
    const isToday =
      selected.getFullYear() === today.getFullYear() &&
      selected.getMonth() === today.getMonth() &&
      selected.getDate() === today.getDate();

    if (!isToday) return true;

    const hourMinutes = parseHourToMinutes(hour);
    return hourMinutes > nowMinutes;
  });

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

        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>

          <View style={styles.dataContainer}>
            <Text style={styles.subtitle}>{name}</Text>

            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons key={i} name={i <= 4 ? "star" : "star-outline"} size={20} color="#FFD700" style={{ marginRight: 2 }} />
              ))}
            </View>

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity style={styles.detailItem} onPress={handleLocation}>
                <Ionicons name="location-outline" size={20} color="#27B9BA" style={styles.icon} />
                <Text style={styles.labelText}>Ubicación: </Text>
                <Text style={styles.valueText}>{location}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.detailItem} onPress={phone ? handleCall : undefined} disabled={!phone}>
                <Ionicons name="call-outline" size={20} color={phone ? "#27B9BA" : "gray"} style={styles.icon}/>
                <Text style={styles.labelText}>Teléfono: </Text>
                <Text style={[styles.valueText, { color: phone ? "#000" : "gray" }]}>
                  {phone && phone !== "" ? phone : "No disponible"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.detailItem} onPress={whatsapp ? handleWhatsapp : undefined} disabled={!whatsapp}>
                <Ionicons name="logo-whatsapp" size={20} color={whatsapp ? "#27B9BA" : "gray"} style={styles.icon}/>
                <Text style={styles.labelText}>WhatsApp: </Text>
                <Text style={[styles.valueText, { color: whatsapp ? "#000" : "gray" }]}>
                  {whatsapp && whatsapp !== "" ? whatsapp : "No disponible"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 30 }}>
              <TouchableOpacity style={styles.customPicker} onPress={() => setModalVisible(true)}>
                <Text style={styles.customPickerText}>{selectedMonthYear}</Text>
                <Ionicons name="chevron-down-outline" size={24} color="#000" />
              </TouchableOpacity>

              <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
                  <View style={styles.modalContent}>
                    <FlatList data={monthYearOptions} keyExtractor={(item) => item} renderItem={({ item }) => (
                      <TouchableOpacity style={styles.modalItem} onPress={() => {
                        setSelectedMonthYear(item);
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
                {validDays.map((day) => {
                  const dayOfWeek = (firstDayIndex + day - 1) % 7;
                  return (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayButton, selectedDate === day && styles.selectedDay]}
                      onPress={() => setSelectedDate(day)}
                    >
                      <Text style={[styles.dayText, selectedDate === day && { color: '#fff' }]}>{day}</Text>
                      <Text style={[styles.dayName, selectedDate === day && { color: '#fff' }]}>{dayNames[dayOfWeek]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.timeContainer}>
              <Text style={styles.subtitle}>Horario</Text>
              <View style={{ paddingHorizontal: 15, marginTop: 5, marginBottom: 20 }}>
                <View style={styles.hoursGrid}>
                  {filteredHours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[styles.hourItem, selectedTime === hour && styles.hourItemSelected]}
                      onPress={() => setSelectedTime(hour)}
                    >
                      <Text style={[styles.hourItemText, selectedTime === hour && { color: "#fff" }]}>{hour}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#27B9BA' }]}
                onPress={() => {
                  if (!selectedDate || !selectedTime) {
                    alert("Selecciona fecha y horario");
                    return;
                  }

                  const fullDate = `${selectedDate}-${currentMonth + 1}-${currentYear}`;

                  router.push({
                    pathname: "/Vehicle",
                    params: {
                      partner_id: id,
                      partner_name: name,
                      partner_phone: phone,
                      logo_url: logo_url,
                      whatsapp: whatsapp,
                      date: fullDate,
                      time: selectedTime
                    }
                  });
                }}
              >
                <Text style={styles.actionButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: '#27B9BA' },
  titleContainer: { textAlign: "center", width: "100%", marginTop: -5, },
  title: { fontSize: 25, fontWeight: 'bold', color: '#000', textAlign: 'center', margin: 10 },
  subtitle: { fontSize: 22, fontWeight: 'bold', color: '#000', width: '100%', marginTop: -20 },
  dataContainer: { padding: 20, backgroundColor: '#fff' },
  labelText: { color: '#27B9BA', fontWeight: "bold", marginRight: 5, padding: 0, },
  valueText: { fontSize: 14, color: '#000', flexShrink: 1, padding: 0, },
  detailItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  icon: { marginRight: 5, marginTop: 2 },
  customPicker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  customPickerText: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', paddingHorizontal: 30 },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, maxHeight: 300, marginHorizontal: 20, paddingVertical: 10 },
  modalItem: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalItemText: { fontSize: 20, color: '#000' },
  carousel: { marginTop: 10 },
  carouselContent: { paddingHorizontal: 15 },
  dayButton: { alignItems: 'center', justifyContent: 'center', marginRight: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#f0f0f0' },
  selectedDay: { backgroundColor: '#27B9BA' },
  dayText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  dayName: { fontSize: 14, color: '#555' },
  timeContainer: { backgroundColor: '#fff' },
  hoursGrid: { flexDirection: "row", flexWrap: 'wrap', justifyContent: 'space-around', },
  hourItem: { width: "30%", backgroundColor: "#f4f4f4", paddingVertical: 6, borderRadius: 12, marginBottom: 10, alignItems: "center" },
  hourItemSelected: { backgroundColor: "#27B9BA" },
  hourItemText: { fontSize: 16, color: "#000" },
  vehiculeContainer: { marginTop: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center' },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
