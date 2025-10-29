import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');
const defaultRegion = {latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.04, longitudeDelta: 0.04};

export default function MapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState(defaultRegion);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  //LOCATION////
  useEffect(() => {
    (async () => {
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
      setLoading(false);
    })();
  }, []);

  ///MENU////
  const toggleMenu = () => {
    const toValue = menuVisible ? -width : 0;
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // EXAMPLE POINTS 
  const shops = [
    {
      id: 1, title: 'Workshop 1',latlng: { latitude: region.latitude + 0.005, longitude: region.longitude - 0.005 },},
    {
      id: 2, title: 'Workshop 2',latlng: { latitude: region.latitude - 0.01, longitude: region.longitude + 0.008 },},
  ];
  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#2c18e4ff" /><Text>Loading location....</Text></View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}><Text style={styles.menuIcon}>☰</Text> </TouchableOpacity> <Text style={styles.headerTitle}>Certified Shops</Text>
      </View>

      {/* CONTAINER*/}
      <View style={styles.container}>
        <MapView style={styles.map} region={region} showsUserLocation> <Marker coordinate={region} title="Your location" pinColor="red" />
          {shops.map((shop) => (<Marker key={shop.id} coordinate={shop.latlng} title={shop.title} pinColor="blue" />
          ))}
        </MapView>

        {/* SEARCH*/}
        <View style={styles.controls}>
          <TextInput style={styles.searchInput} placeholder="Search for workshops..." />
          <View style={styles.options}>
            {['Spare Parts', 'Air Conditioning', 'Tires', 'Paint'].map((opt) => (
              <TouchableOpacity key={opt} style={styles.optionButton}><Text style={styles.optionText}>{opt}</Text></TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MENU*/}
        {menuVisible && (
          <TouchableOpacity style={styles.overlay} onPress={toggleMenu} activeOpacity={1}>
            <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  toggleMenu();
                  router.replace('../Login');
                }}
              >
                <Text style={styles.logoutText}>Log out</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',},
  menuIcon: { fontSize: 28, fontWeight: 'bold' },
  headerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center',fontSize: 18,fontWeight: 'bold',},

  // SEARCH//////
  controls: {position: 'absolute',top: 0,width: '100%',alignSelf: 'center',backgroundColor: '#fff',borderRadius: 10,padding: 10,elevation: 5,},
  searchInput: {backgroundColor: '#f1f1f1',padding: 8,borderRadius: 8,marginBottom: 10,},
  options: {flexDirection: 'row',flexWrap: 'wrap',justifyContent: 'space-around',},
  optionButton: {paddingVertical: 8,paddingHorizontal: 12,borderRadius: 20,borderWidth: 1,borderColor: '#ccc',backgroundColor: '#f9f9f9',marginBottom: 8,},
  optionText: { fontSize: 14, color: '#333' },
/////MENU////////
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: {position: 'absolute',left: 0,top: 0,bottom: 0,width: width * 0.4,backgroundColor: '#fff',paddingTop: 80,paddingHorizontal: 10, elevation: 10, },
  menuTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, position: 'absolute',top: 0, left: 10 },
  logoutButton: {backgroundColor: '#e74c3c',paddingVertical: 10,borderRadius: 5,marginTop: -40,},
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
