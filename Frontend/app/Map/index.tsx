import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const defaultRegion = { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.04, longitudeDelta: 0.04 };

export default function MapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState(defaultRegion);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se mostrará la ubicación por defecto.');
        } else {
          const { coords } = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        }
      } catch (error) {
        console.warn('No se pudo obtener la ubicación:', error);
        Alert.alert('Ubicación no disponible', 'Activa el GPS o verifica permisos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleMenu = () => {
    const toValue = menuVisible ? -width : 0;
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const shops = [
    { id: 1, title: 'Workshop 1', latlng: { latitude: region.latitude + 0.005, longitude: region.longitude - 0.005 } },
    { id: 2, title: 'Workshop 2', latlng: { latitude: region.latitude - 0.01, longitude: region.longitude + 0.008 } },
  ];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c18e4ff" />
        <Text>Cargando Ubicación...</Text>
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
        <Ionicons name="location-outline" size={35} color="#ffffffff"/>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Tiendas Certificadas</Text>
      </View>

      <View style={styles.container}>

        <MapView style={styles.map} region={region} showsUserLocation>
          <Marker coordinate={region} title="Tu ubicación" pinColor="red" />
          {shops.map((shop) => (
            <Marker key={shop.id} coordinate={shop.latlng} title={shop.title} pinColor="blue" />
          ))}
        </MapView>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapped}>
            <Ionicons name="search-outline" size={20} color="#7a7a7aff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar Tiendas"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.optionContainer}>

          </View>
        </View>

        {menuVisible && (
          <View style={styles.overlay}>

            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={toggleMenu} activeOpacity={1} />

            <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menú</Text>
              </View>

              <View style={styles.menuOptions}>
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

              </View>
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
  headerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center',marginTop: 52,fontSize: 25,fontWeight: 'bold'},

  searchContainer: { position: 'absolute',top: 0,width: '100%', height: '50%', marginTop: 330, alignSelf: 'center',backgroundColor: '#ffffffff',padding: 10,elevation: 5},
  searchWrapped: { flexDirection: 'row', alignItems: 'center',backgroundColor: '#ecececff', borderRadius: 8, paddingVertical: 5, paddingHorizontal:10, margin: 15},
  searchIcon: { marginRight: 10},
  searchInput: { flex: 1, paddingVertical: 15, fontSize: 16},
 
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.7,backgroundColor: '#27B9BA', paddingTop: 10, paddingHorizontal: 20, elevation: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20},
  menuHeader: { marginBottom: 20 },
  menuTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff'},
  menuOptions: { flex: 1},
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffff', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 15, elevation: 5 },
  menuButtonText: { color: '#000000ff', fontSize: 16, fontWeight: '600'},

  optionContainer: {},

});