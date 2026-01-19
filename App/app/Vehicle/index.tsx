import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Modal, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { getCarBrands } from "@/services/car_brands";
import { createCar, updateCar } from "@/services/car";
import { CarBrands } from "@backend-types/car_brands";
import { Cars } from "@backend-types/car";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCarsByClient } from "@/services/car_client";

export default function VehicleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [car_brands, setCarBrands] = useState<CarBrands[]>([]);
  const [brandModalVisible, setBrandModalVisible] = useState(false);

  const [userCars, setUserCars] = useState<Cars[]>([]);
  const [carsModalVisible, setCarsModalVisible] = useState(false);

  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);

  const [car_brand_id, setCarBrandId] = useState<number | null>(null);
  const [brandName, setBrandName] = useState("");

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [plate, setPlate] = useState("");

  const partner_id = Number(params.partner_id);
  const partner = { name: params.partner_name, phone: params.partner_phone, logo_url: params.logo_url };
  const logo_url = Array.isArray(params.logo_url) ? params.logo_url[0] : params.logo_url;
  const date = params.date;
  const time = params.time;

  useEffect(() => {
    const loadData = async () => {
      const brands = await getCarBrands();
      if (Array.isArray(brands)) {
        const sortedBrands = brands.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCarBrands(sortedBrands);
      }
      const storedClientId = await AsyncStorage.getItem("client_id");
      if (!storedClientId) return;

      const client_id = Number(storedClientId);
      const cars = await getCarsByClient(client_id);

      if (Array.isArray(cars)) setUserCars(cars);
    };

    loadData();
  }, []);

  const handleSelectCar = (car: Cars) => {
    setSelectedCarId(car.id);
    setCarBrandId(car.car_brand_id);

    const foundBrand = car_brands.find((b: CarBrands) => b.id === car.car_brand_id);
    setBrandName(foundBrand ? foundBrand.name : "");

    setName(car.name);
    setModel(car.model);
    setYear(car.year);
    setType(car.type);
    setPlate(car.plate);

    setCarsModalVisible(false);
  };

  const handleSave = async () => {
    if (!car_brand_id || !name || !model || !year || !plate) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      alert("El año debe ser numérico de 4 dígitos");
      return;
    }

    if (!/^[A-Z0-9]{6,8}$/.test(plate)) {
      alert("La placa solo puede contener 3 letras y 4 números.");
      return;
    }

    const plateExists = userCars.some((c: Cars) => c.plate.toLowerCase() === plate.toLowerCase() && c.id !== selectedCarId);
    if (plateExists) {
      alert("La placa ya está registrada en otro vehículo");
      return;
    }

    const storedClientId = await AsyncStorage.getItem("client_id");
    if (!storedClientId) {
      alert("Error: No se encontró el client_id. Vuelve a iniciar sesión.");
      return;
    }
    const client_id = Number(storedClientId);

    const data = {
      id: selectedCarId || 0,
      name,
      car_brand_id,
      model,
      year,
      type,
      plate,
      client_id
    };

    let response: any;

    if (selectedCarId) {
      response = await updateCar(selectedCarId, data);
    } else {
      response = await createCar(data);
    }

    if (!response.ok) {
      alert(response.message);
      return;
    }

    const cars = await getCarsByClient(client_id);
    if (Array.isArray(cars)) setUserCars(cars);

    alert(selectedCarId ? "Vehículo actualizado, selecciona tu vehículo para continuar" : "Vehículo creado, selecciona tu vehículo para continuar");

    setCarBrandId(null);
    setBrandName("");
    setName("");
    setModel("");
    setYear("");
    setType("");
    setPlate("");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f5f5f5' }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Datos del Vehículo</Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 25, paddingBottom: 60 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {userCars.length > 0 && (
              <>
                <TouchableOpacity style={styles.saveCarButton} onPress={() => setCarsModalVisible(true)}>
                  <Text style={styles.saveCarButtonText}>
                    {selectedCarId ? "Cambiar vehículo" : "Seleccionar vehículo guardado"}
                  </Text>
                  <Ionicons name="chevron-down-outline" size={22} color="#fff" />
                </TouchableOpacity>

                <Modal visible={carsModalVisible} transparent animationType="fade">
                  <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setCarsModalVisible(false)}>
                    <View style={styles.modalContent}>
                      <FlatList
                        data={userCars}
                        keyExtractor={(item: Cars) => item.id.toString()}
                        renderItem={({ item }: { item: Cars }) => (
                          <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectCar(item)}>
                            <Text style={styles.modalItemText}>
                              {item.name} - {item.model} ({item.year})
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>
            )}

            <Text style={[styles.subTitle, { marginTop: userCars.length > 0 ? 15 : -20 }]}>
              Crea un vehículo nuevo
            </Text>

            <Text style={styles.label}>Marca</Text>
            <TouchableOpacity style={styles.inputSelect} onPress={() => setBrandModalVisible(true)}>
              <Text>{brandName || "Seleccionar marca"}</Text>
              <Ionicons name="chevron-down-outline" size={20} />
            </TouchableOpacity>

            <Modal transparent visible={brandModalVisible} animationType="fade">
              <TouchableOpacity style={styles.modalOverlay} onPressOut={() => setBrandModalVisible(false)}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={car_brands}
                    keyExtractor={(item: CarBrands) => item.id.toString()}
                    renderItem={({ item }: { item: CarBrands }) => (
                      <TouchableOpacity
                        style={styles.modalItem}
                        onPress={() => {
                          setCarBrandId(item.id);
                          setBrandName(item.name);
                          setBrandModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

            <Text style={styles.label}>Nombre del Vehículo:</Text>
            <TextInput style={styles.input} placeholder="Ej: Toyota" placeholderTextColor="#888" value={name} onChangeText={setName} />

            <Text style={styles.label}>Modelo:</Text>
            <TextInput style={styles.input} placeholder="Ej: Camry" placeholderTextColor="#888" value={model} onChangeText={setModel} />

            <Text style={styles.label}>Año:</Text>
            <TextInput style={styles.input} placeholder="Ej: 2022" placeholderTextColor="#888" keyboardType="numeric" value={year} onChangeText={setYear} />

            <Text style={styles.label}>Tipo:</Text>
            <TextInput style={styles.input} placeholder="Sedán, SUV..." placeholderTextColor="#888" value={type} onChangeText={setType} />

            <Text style={styles.label}>Placa:</Text>
            <TextInput style={styles.input} placeholder="ABC-123" placeholderTextColor="#888" value={plate} autoCapitalize="characters" onChangeText={(text) => setPlate(text.toUpperCase())} />

            <View style={{ marginTop: 15 }}>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#27B9BA' }]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>
                  {selectedCarId ? "Guardar Cambios" : "Guardar Vehículo"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!selectedCarId}
                style={[
                  styles.nextButton,
                  { backgroundColor: selectedCarId ? "#27B9BA" : "#9bdcdc" }
                ]}
                onPress={async () => {
                  if (!selectedCarId) return;

                  const storedClientId = await AsyncStorage.getItem("client_id");
                  if (!storedClientId) return;

                  router.push({
                    pathname: "/Ticket",
                    params: {
                      car_id: selectedCarId,
                      partner_id,
                      client_id: storedClientId,
                      date,
                      time,
                      partner_name: partner.name,
                      partner_phone: partner.phone,
                      logo_url: logo_url
                    }
                  });
                }}
              >
                <Text style={styles.nextButtonText}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleContainer: { textAlign: "center", width: "100%", marginTop: -5, },
  title: { fontSize: 25, fontWeight: 'bold', color: '#000', textAlign: 'center', margin: 10 },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA" },
  subTitle: { fontSize: 18, fontWeight: "bold" },
  label: { marginTop: 10, fontWeight: "600", color: "#27B9BA" },
  input: { backgroundColor: "#eee", padding: 12, borderRadius: 10, marginTop: 5 },
  inputSelect: { backgroundColor: "#eee", padding: 12, borderRadius: 10, marginTop: 5, flexDirection: "row", justifyContent: "space-between" },
  saveCarButton: { backgroundColor: "#27B9BA", padding: 12, borderRadius: 10, flexDirection: "row", justifyContent: "space-between", marginTop: -20, },
  saveCarButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  saveButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center" },
  modalContent: { backgroundColor: "#fff", marginHorizontal: 30, borderRadius: 12, maxHeight: 350 },
  modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalItemText: { fontSize: 18 },
  nextButton: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  nextButtonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});
