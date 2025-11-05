import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const defaultRegion = {
  latitude: 19.2845,
  longitude: -99.6557,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function MapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [tempRegion, setTempRegion] = useState<Region | null>(null);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se mostrará la ubicación por defecto.');
          setRegion(defaultRegion);
        } else {
          const { coords } = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        }
      } catch {
          setRegion(defaultRegion);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleMenu = () => {
    const toValue = menuVisible ? -width : 0;
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(!menuVisible));
  };

  const confirmNewLocation = () => {
    if (tempRegion) {
      setRegion(tempRegion);
      mapRef.current?.animateToRegion(tempRegion, 1000);
    }
    setMapModalVisible(false);
  };

  const shops = [
    {
      id: 1,
      title: 'Workshop 1',
      latlng: { latitude: (region?.latitude ?? 0) + 0.005, longitude: (region?.longitude ?? 0) - 0.005 },
    },
    {
      id: 2,
      title: 'Workshop 2',
      latlng: { latitude: (region?.latitude ?? 0) - 0.01, longitude: (region?.longitude ?? 0) + 0.008 },
    },
  ];

  if (loading || !region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#27B9BA" />
        <Text>Cargando ubicación...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {
          setTempRegion(region);
          setMapModalVisible(true);
        }}>
          <Ionicons name="location-outline" size={35} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Tiendas Certificadas</Text>
      </View>

      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation
        >
          <Marker coordinate={region} title="Tu ubicación" pinColor="red" />
          {shops.map((shop) => (
            <Marker key={shop.id} coordinate={shop.latlng} title={shop.title} pinColor="blue" />
          ))}
        </MapView>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapped}>
            <Ionicons name="search-outline" size={20} color="#7a7a7a" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Tiendas"
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <Modal
          visible={mapModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setMapModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Mover ubicación</Text>

              <MapView
                style={styles.modalMap}
                initialRegion={tempRegion || region}
                onRegionChangeComplete={setTempRegion}
              />

              <View style={styles.markerFixed}>
                <Ionicons name="location-sharp" size={40} color="red" />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#aaa' }]}
                  onPress={() => setMapModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#27B9BA' }]}
                  onPress={confirmNewLocation}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {menuVisible && (
          <View style={styles.overlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={toggleMenu}
              activeOpacity={1}
            />
            <Animated.View
              style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
            >
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menú</Text>
              </View>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => {
                  toggleMenu();
                  router.replace('../Login');
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#000" style={{ marginRight: 10 }} />
                <Text style={styles.menuButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject, height: 330 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 15, backgroundColor: '#27B9BA', borderBottomWidth: 1, borderBottomColor: '#eee'},
  menuIcon: { fontSize: 28, fontWeight: 'bold', color: '#ffff' },
  titleContainer: { textAlign: 'center', marginBottom: 100, marginTop: -45 },
  headerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center', marginTop: 52, fontSize: 25, fontWeight: 'bold'},
  searchContainer: { position: 'absolute', top: 0, width: '100%', height: '50%', marginTop: 330, alignSelf: 'center', backgroundColor: '#ffffffff', padding: 10, elevation: 5 },
  searchWrapped: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecececff', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, margin: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 15, fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.7, backgroundColor: '#27B9BA', paddingTop: 10, paddingHorizontal: 20, elevation: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  menuHeader: { marginBottom: 20 },
  menuTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffff', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 15, elevation: 5 },
  menuButtonText: { color: '#000000ff', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden' },
  modalTitle: { textAlign: 'center', paddingVertical: 12, fontSize: 16, fontWeight: 'bold', backgroundColor: '#27B9BA', color: '#fff' },
  modalMap: { width: '100%', height: 400 },
  markerFixed: { position: 'absolute', top: 200 - 40 / 2, left: '50%', marginLeft: -20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', padding: 15 },
  button: { paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
