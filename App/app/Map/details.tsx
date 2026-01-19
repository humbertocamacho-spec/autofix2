import { Stack, useLocalSearchParams, useRouter, } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPartnerCertifications } from '@/services/partner_certifications';

const { width } = Dimensions.get('window');

const staticCertInfo = [
  "Manejo de escáner",
  "Mano de obra especializada",
  "Permisos de protección civil",
  "Cumplimiento de normas de seguridad",
  "Manejo de piezas calidad OEM",
  "Garage de almacenamiento de autos",
  "Limpieza de taller",
  "Torres hidráulicas para manejo y bloqueo de automóviles",
];

export default function PartnerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const location = Array.isArray(params.location) ? params.location[0] : params.location;
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const whatsapp = Array.isArray(params.whatsapp) ? params.whatsapp[0] : params.whatsapp;
  const logo_url = Array.isArray(params.logo_url) ? params.logo_url[0] : params.logo_url;
  const latitude = Array.isArray(params.latitude) ? parseFloat(params.latitude[0]) : parseFloat(params.latitude);
  const longitude = Array.isArray(params.longitude) ? parseFloat(params.longitude[0]) : parseFloat(params.longitude);
  const description = Array.isArray(params.description) ? params.description[0] : params.description;
  const specialityNames = params.specialities ? JSON.parse(Array.isArray(params.specialities) ? params.specialities[0] : params.specialities) : [];

  if (!id) {
    return (
      <View style={styles.center}>
        <Text>Taller no encontrado o datos incompletos.</Text>
      </View>
    );
  }

  const [showCertifications, setShowCertifications] = useState(false);
  const [showAutofixSpecs, setShowAutofixSpecs] = useState(false);
  const [partnerCertifications, setPartnerCertifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certifications = await getPartnerCertifications(Number(id));
        setPartnerCertifications(certifications);
      } catch (error) {
        console.error("Error cargando certificaciones:", error);
      }
    };

    fetchData();
  }, []);

  const handleCall = () => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsapp = () => {
    if (!whatsapp) return;

    let phoneNumber = whatsapp.replace(/\D/g, '');

    if (phoneNumber.length === 10) {
      phoneNumber = `52${phoneNumber}`;
    }

    const url = `https://wa.me/${phoneNumber}`;

    Linking.openURL(url).catch(() => {
      alert('No se pudo abrir WhatsApp');
    });
  };

  const handleLocation = () => {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url).catch(() => alert('No se pudo abrir la ubicación'));
    }
  };

  const isAutofix = (name: string) =>
    name.toLowerCase().includes("autofix");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Image source={ logo_url && logo_url !== '' ? { uri: logo_url } : require('@/assets/images/taller-electrico-automotriz.jpg')}
          style={styles.partnerImage}
        />

        <View style={styles.content}>
          <Text style={styles.partnerName}>{name}</Text>
          {partnerCertifications.length === 1 && (
            (() => {
              const cert = partnerCertifications[0];
              const autofix = isAutofix(cert.certification_name);

              return (
                <View style={{ marginBottom: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 13, color: "#555", marginRight: 6 }}>{cert.certification_name}</Text>
                      <Ionicons name="shield-checkmark" size={18} color="green" />
                    </View>

                    {autofix && (
                      <TouchableOpacity
                        onPress={() => setShowAutofixSpecs(!showAutofixSpecs)}
                      >
                        <Ionicons name={ showAutofixSpecs ? "chevron-up-outline" : "chevron-down-outline"}
                          size={22}
                          color="#27B9BA"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {autofix && showAutofixSpecs && (
                    <View style={{ marginTop: 3, paddingLeft: 10 }}>
                      {staticCertInfo.map((item, index) => (
                        <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="green"
                            style={{ marginRight: 6, marginTop: 2 }}
                          />
                          <Text style={{ fontSize: 14, color: "#444", flex: 1 }}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })()
          )}

          {partnerCertifications.length > 1 && (
            <View style={{ marginBottom: 5 }}>
              <TouchableOpacity
                onPress={() => setShowCertifications(!showCertifications)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 13,color: "#000" }}>Certificaciones</Text>
                <Ionicons
                  name={ showCertifications ? "chevron-up-outline" : "chevron-down-outline"}
                  size={22}
                  color="#27B9BA"
                />
              </TouchableOpacity>

              {showCertifications &&
                partnerCertifications.map((c) => {
                  const autofix = isAutofix(c.certification_name);

                  return (
                    <View key={c.id} style={{ marginTop: 8 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Ionicons
                            name="shield-checkmark"
                            size={18}
                            color="green"
                            style={{ marginRight: 6 }}
                          />
                          <Text style={{ fontSize: 13, color: "#555" }}>{c.certification_name}</Text>
                        </View>

                        {autofix && (
                          <TouchableOpacity onPress={() => setShowAutofixSpecs(!showAutofixSpecs)}>
                            <Ionicons
                              name={ showAutofixSpecs ? "chevron-up-outline" : "chevron-down-outline"}
                              size={20}
                              color="#27B9BA"
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {autofix && showAutofixSpecs && (
                        <View style={{ marginTop: 6, paddingLeft: 24 }}>
                          {staticCertInfo.map((item, index) => (
                            <View key={index} style={{ flexDirection: "row", marginBottom: 4 }}>
                              <Ionicons
                                name="checkmark-circle"
                                size={15}
                                color="green"
                                style={{ marginRight: 6, marginTop: 2 }}
                              />
                              <Text style={{ fontSize: 14, color: "#444", flex: 1 }}>{item}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          )}

          {partnerCertifications.length === 0 && (
            <Text style={{ fontSize: 15, color: "#555", marginBottom: 5 }}> No cuenta con certificación</Text>
          )}

          <View style={{ flexDirection: 'row', marginTop: -5, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name={i <= 4 ? "star" : "star-outline"} size={20} color="#FFD700" style={{ marginRight: 2 }} />
            ))}
          </View>

          <TouchableOpacity style={styles.detailItem} onPress={handleLocation}>
            <Ionicons name="location-outline" size={20} color="#27B9BA" style={styles.icon} />
            <Text style={styles.labelText}>Ubicación: </Text>
            <Text style={styles.valueText}>{location}</Text>
          </TouchableOpacity>

          {phone ? (
            <TouchableOpacity style={styles.detailItem} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color="#27B9BA" style={styles.icon} />
              <Text style={styles.labelText}>Teléfono: </Text>
              <Text style={styles.valueText}>{phone}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.detailItem}>
              <Ionicons name="close-circle-outline" size={20} color="gray" style={styles.icon} />
              <Text style={[styles.labelText, { color: "gray" }]}>Teléfono:</Text>
              <Text style={[styles.valueText, { color: "gray" }]}>No disponible</Text>
            </View>
          )}

          {whatsapp ? (
            <TouchableOpacity style={styles.detailItem} onPress={handleWhatsapp}>
              <Ionicons name="logo-whatsapp" size={20} color="#27B9BA" style={styles.icon} />
              <Text style={styles.labelText}>WhatsApp: </Text>
              <Text style={styles.valueText}>{whatsapp}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.detailItem}>
              <Ionicons name="close-circle-outline" size={20} color="gray" style={styles.icon} />
              <Text style={[styles.labelText, { color: "gray" }]}>WhatsApp:</Text>
              <Text style={[styles.valueText, { color: "gray" }]}>No disponible</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Acerca de nosotros </Text>
          <Text style={styles.descriptionText}>{description}</Text>

          <Text style={styles.sectionTitle}>Especialidades</Text>
          {specialityNames.length > 0 ? (
            specialityNames.map((name: string, index: number) => (
              <Text key={index} style={{ fontSize: 16, color: "#555", marginBottom: 5 }}>
                • {name}
              </Text>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: "#555" }}>
              No hay especialidades registradas
            </Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#27B9BA' }]}
              onPress={() => router.push({
                pathname: "/Appointment",
                params: {
                  id,
                  name,
                  location,
                  phone,
                  whatsapp,
                  logo_url,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  description
                }
              })}
            >
              <Text style={styles.actionButtonText}>Agendar Cita</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', marginTop: -1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  partnerImage: { width: '100%', height: 240, resizeMode: 'contain', backgroundColor: '#ffffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: '#27B9BA', borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuIcon: { fontSize: 28, fontWeight: 'bold', color: '#ffff' },
  content: { padding: 20 },
  partnerName: { fontSize: 25, fontWeight: 'bold', color: '#333', marginTop: -10 },
  partnerCertifications: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: -10 },
  partnerSubtitle: { fontSize: 20, color: '#2e2d2dff', marginBottom: 20 },
  detailItem: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  icon: { marginRight: 5, marginTop: 2 },
  labelText: { color: '#27B9BA', fontWeight: "bold", marginRight: 5, padding: 0, },
  valueText: { fontSize: 14, color: '#000', flexShrink: 1, padding: 0, },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#27B9BA', marginBottom: 5 },
  descriptionText: { fontSize: 16, color: '#666', lineHeight: 22, marginBottom: 10 },
  partnerInfo: { fontSize: 25, marginVertical: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 20 },
  actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sideMenu: { position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.7, backgroundColor: '#27B9BA', paddingTop: 10, paddingHorizontal: 20, elevation: 15, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  menuHeader: { marginBottom: 20 },
  menuTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  menuButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffff', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 12, marginBottom: 15, elevation: 5 },
  menuButtonText: { color: '#000000ff', fontSize: 16, fontWeight: '600' },
});
