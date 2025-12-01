import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getPartners } from '@/services/partners';
import { Partner } from '@backend-types/partner';
import { getSpecialities } from '@/services/specialities';
import { getPartnerSpecialities } from '@/services/partner_specialities';

const { width } = Dimensions.get('window');

const defaultRegion = {
  latitude: 19.2845,
  longitude: -99.6557,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  const router = useRouter();
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [tempRegion, setTempRegion] = useState<Region | null>(null);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const mapRef = useRef<MapView>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [specialities, setSpecialities] = useState<any[]>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<number | null>(null);
  const [partnersSpecialities, setPartnersSpecialities] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showCitasSubMenu, setShowCitasSubMenu] = useState(false);
  const modalMapRef = useRef<MapView>(null);
  const [distanceRadius, setDistanceRadius] = useState(10);
  const [distanceModalVisible, setDistanceModalVisible] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specData, psData] = await Promise.all([
          getSpecialities(),
          getPartnerSpecialities(),
        ]);
        setSpecialities(specData);
        setPartnersSpecialities(psData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        if (Array.isArray(data)) {
          setPartners(data);
        } else if (data) {
          setPartners([data]);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();
  }, []);

  const nearbyPartners = partners.filter((partner) => {
    const lat = parseFloat(partner.latitude);
    const lon = parseFloat(partner.longitude);
    if (isNaN(lat) || isNaN(lon) || !region) return false;

    const distance = getDistanceFromLatLonInKm(
      region.latitude,
      region.longitude,
      lat,
      lon
    );

    const withinDistance = distance <= distanceRadius;
    const hasSpeciality = selectedSpeciality
      ? partnersSpecialities.some(
        (ps) => ps.partner_id === partner.id && ps.speciality_id === selectedSpeciality
      )
      : true;

    const matchesSearch = partner.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    return withinDistance && hasSpeciality && (!searchText || matchesSearch);
  });


  useEffect(() => {
    if (mapRef.current && region && nearbyPartners.length > 0) {
      const validCoords = nearbyPartners.map((p) => ({
        latitude: parseFloat(p.latitude),
        longitude: parseFloat(p.longitude),
      }));

      const coords = [
        { latitude: region.latitude, longitude: region.longitude },
        ...validCoords,
      ];

      if (coords.length > 1) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
        });
      }
    }
  }, [nearbyPartners, region]);

  const toggleMenu = () => {
    const newValue = !menuVisible;
    Animated.timing(slideAnim, {
      toValue: newValue ? 0 : -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(newValue);
  };

  const confirmNewLocation = () => {
    if (tempRegion) {
      setRegion(tempRegion);
      mapRef.current?.animateToRegion(tempRegion, 1000);
    }
    setMapModalVisible(false);
  };

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
        <View style={styles.distanceButtonContainer}>
          <TouchableOpacity
            style={styles.distanceButton}
            onPress={() => setDistanceModalVisible(true)}
          >
            <Text style={styles.distanceButtonText}>{distanceRadius} km</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <MapView ref={mapRef} style={styles.map} region={region} showsUserLocation={true}>

          <Marker coordinate={region} title="Tu ubicación" pinColor="red" />
          {nearbyPartners.map((partner) => {
            const lat = parseFloat(partner.latitude);
            const lon = parseFloat(partner.longitude);

            const isMatch =
              searchText.trim().length > 0 &&
              partner.name.toLowerCase().includes(searchText.toLowerCase());

            return (
              <Marker key={partner.id + (isMatch ? '-match' : '-nomatch')}
                coordinate={{ latitude: lat, longitude: lon }} pinColor={isMatch ? "green" : "blue"}
                tracksViewChanges={true}
                onPress={() => {
                  const specs = partnersSpecialities
                    .filter((ps) => ps.partner_id === partner.id)
                    .map((ps) => {
                      const spec = specialities.find((s) => s.id === ps.speciality_id);
                      return spec ? spec.name : "";
                    });

                  router.push({
                    pathname: "../Map/details",
                    params: {
                      id: partner.id.toString(),
                      name: partner.name,
                      location: partner.location,
                      phone: partner.phone || "",
                      whatsapp: partner.whatsapp || "",
                      logo_url: partner.logo_url || "",
                      latitude: partner.latitude,
                      longitude: partner.longitude,
                      description: partner.description,
                      specialities: JSON.stringify(specs),
                    },
                  });
                }}
              />
            );
          })}
        </MapView>

        <View style={styles.searchContainer}>
          <View style={styles.searchWrapped}>
            <Ionicons name="search-outline" size={20} color="#7a7a7a" marginRight={10} />
            <TextInput style={styles.searchInput} placeholder="Buscar Tiendas" placeholderTextColor="#666" value={searchText} onChangeText={setSearchText} />
          </View>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/Recommendations',
                params: {
                  latitude: region?.latitude.toString() || '',
                  longitude: region?.longitude.toString() || '',
                },
              })
            }
          >
            <Text style={styles.recommendationsButton}>Recomendaciones Cercanas</Text>
          </TouchableOpacity>

          <ScrollView style={styles.scrollSpecialities} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.specialityContainer}>
              {specialities.map((item) => (
                <TouchableOpacity key={item.id} style={[styles.specialityButton, selectedSpeciality === item.id && styles.specialityButtonActive]} onPress={() => setSelectedSpeciality(selectedSpeciality === item.id ? null : item.id)}>
                  <Text style={[styles.specialityText, selectedSpeciality === item.id && styles.specialityTextActive]}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <Modal visible={mapModalVisible} animationType="fade" transparent={true} onRequestClose={() => setMapModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Cambiar ubicación</Text>

              <MapView ref={modalMapRef} style={styles.modalMap} initialRegion={tempRegion || region} onRegionChangeComplete={setTempRegion} />

              <View style={styles.markerFixed}>
                <Ionicons name="location-sharp" size={40} color="red" />
              </View>
              <TouchableOpacity style={styles.gpsButton} onPress={async () => {
                const { coords } = await Location.getCurrentPositionAsync({});

                const realRegion = {
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                setTempRegion(realRegion);
                modalMapRef.current?.animateToRegion(realRegion, 1000);
              }}
              >
                <Ionicons name="locate" size={28} color="#27B9BA" />
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#aaa' }]} onPress={() => setMapModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: '#27B9BA' }]} onPress={confirmNewLocation}>
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


        </Modal>{distanceModalVisible && (<View style={styles.distanceModalOverlay}><View style={styles.distanceModal}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setDistanceModalVisible(false)}>
            <Ionicons name="close" size={22} color="#333" />
          </TouchableOpacity>

          <Text style={styles.distanceModalTitle}> Seleccionar radio de búsqueda </Text>
          {[10, 15, 20, 25, 30].map((km) => (
            <TouchableOpacity
              key={km}
              style={[styles.distanceOption, distanceRadius === km && styles.distanceOptionActive,]}
              onPress={() => {
                setDistanceRadius(km);
                setDistanceModalVisible(false);
              }}
            >
              <Text style={[styles.distanceOptionText, distanceRadius === km && styles.distanceOptionTextActive,]} > {km} km </Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        )}

        {menuVisible && (
          <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={toggleMenu} activeOpacity={1} />
            <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>

              <View style={styles.menuHeader}>
                <Text style={styles.menuTitle}>Menú</Text>
              </View>

              <TouchableOpacity style={styles.menuButton} onPress={() => {
                toggleMenu();
                router.replace('../Login');
              }}
              >

                <Ionicons name="log-out-outline" size={20} color="#000" style={{ marginRight: 10 }} />
                <Text style={styles.menuButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuButton} onPress={() => setShowCitasSubMenu(!showCitasSubMenu)}>
                <Ionicons name="calendar-outline" size={20} color="#000" style={{ marginRight: 10 }} />
                <Text style={styles.menuButtonText}>Mis citas</Text>
                <Ionicons
                  name={showCitasSubMenu ? "chevron-up-outline" : "chevron-down-outline"}
                  size={20}
                  color="#000"
                  style={{ marginLeft: 'auto' }}
                />
              </TouchableOpacity>

              {showCitasSubMenu && (
                <View style={{ marginBottom: 5 }}>
                  <TouchableOpacity style={styles.subMenuButton} onPress={() => { toggleMenu(); router.push('../Ticket/TicketsPending'); }}>
                    <Text style={styles.subMenuText}>Pendientes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.subMenuButton} onPress={() => { toggleMenu(); router.push('../Ticket/TicketsConfirmed'); }}>
                    <Text style={styles.subMenuText}>Confirmadas</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        )}
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject, height: 310 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: 15, backgroundColor: '#27B9BA', borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuIcon: { fontSize: 28, fontWeight: 'bold', color: '#ffff' },
  titleContainer: { textAlign: 'center', marginBottom: 90, marginTop: -45 },
  headerTitle: { position: 'absolute', left: 0, right: 0, textAlign: 'center', marginTop: 52, fontSize: 25, fontWeight: 'bold' },
  searchWrapped: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecececff', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, margin: 10, marginTop: 5 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 9999, },
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
  partnerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#27B9BA', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 15, marginTop: 5, justifyContent: 'center', elevation: 3, },
  partnerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', },
  searchContainer: { position: 'absolute', bottom: 0, width: '100%', height: '57%', backgroundColor: '#fff', padding: 10, elevation: 5 },
  scrollSpecialities: { maxHeight: "100%", marginTop: 10, marginBottom: 10, },
  scrollContent: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 10, },
  specialityContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  specialityButton: { backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, margin: 5 },
  specialityButtonActive: { backgroundColor: '#27B9BA' },
  specialityText: { color: '#000', fontWeight: '500' },
  specialityTextActive: { color: '#fff', fontWeight: '700' },
  recommendationsButton: { textAlign: 'center', backgroundColor: '#27B9BA', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, marginHorizontal: 15, color: '#fff', fontSize: 15, fontWeight: 'bold', },
  subMenuButton: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 8, marginBottom: 5, backgroundColor: "#e0f7f7" },
  subMenuText: { fontSize: 16, color: "#000", },
  gpsButton: { position: "absolute", top: 50, right: 10, zIndex: 999, width: 48, height: 48, backgroundColor: "#fff", borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 10, },
  distanceButtonContainer: { position: "absolute", top: 10, right: 60, zIndex: 1, },
  distanceButton: { flexDirection: "row", backgroundColor: "#27B9BA", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, alignItems: "center", elevation: 6, },
  distanceButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold", marginRight: 5, },
  distanceModalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)", },
  distanceModal: { width: 200, backgroundColor: "#fff", padding: 20, borderRadius: 12, paddingTop: 27, elevation: 10, position: "relative", },
  closeButton: { position: "absolute", top: 5, right: 10, width: 26, height: 26, borderRadius: 18, backgroundColor: "#f2f2f2", justifyContent: "center", alignItems: "center", elevation: 5, zIndex: 999, },
  distanceModalTitle: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginBottom: 15, },
  distanceOption: { paddingVertical: 10, backgroundColor: "#f0f0f0", borderRadius: 8, marginBottom: 8, alignItems: "center", },
  distanceOptionActive: { backgroundColor: "#27B9BA", },
  distanceOptionText: { fontSize: 15, fontWeight: "600", color: "#333", },
  distanceOptionTextActive: { color: "#fff", fontWeight: "bold", },

});