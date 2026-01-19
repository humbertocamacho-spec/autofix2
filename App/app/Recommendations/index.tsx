import { Stack, useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getPartners } from "@/services/partners";
import { Partner } from "@backend-types/partner";
import { getSpecialities } from '@/services/specialities';
import { getPartnerSpecialities } from '@/services/partner_specialities';

export default function RecommendationsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { latitude, longitude, radius } = params;
  const distanceRadius = parseFloat(radius as string) || 10;


  const [partners, setPartners] = useState<Partner[]>([]);
  const [region, setRegion] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const [specialities, setSpecialities] = useState<any[]>([]);
  const [partnersSpecialities, setPartnersSpecialities] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (latitude && longitude) {
        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        if (!isNaN(lat) && !isNaN(lon)) {
          setRegion({ latitude: lat, longitude: lon });
        }
      }
    }, [latitude, longitude])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specData, psData] = await Promise.all([
          getSpecialities(),
          getPartnerSpecialities(),
        ]);
        setSpecialities(specData);
        setPartnersSpecialities(psData);

        const partnersData = await getPartners();
        if (Array.isArray(partnersData)) setPartners(partnersData);
        else if (partnersData) setPartners([partnersData]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearbyPartners = partners
    .map((partner) => {
      const lat = parseFloat(partner.latitude);
      const lon = parseFloat(partner.longitude);

      if (isNaN(lat) || isNaN(lon) || !region) {
        return { ...partner, distance: Infinity, priority: partner.priority ?? 10, };
      }

      const distance = getDistanceFromLatLonInKm(region.latitude, region.longitude, lat, lon);

      return { ...partner, distance, priority: partner.priority ?? 10, };
    })

    .filter((p) => p.distance <= distanceRadius)
    .sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.distance - b.distance;
    });

  const screenHeight = Dimensions.get("window").height;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titleRecommendations}>Recomendaciones Cercanas</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#27B9BA" />
          <Text>Cargando talleres cercanos...</Text>
        </View>
      ) : nearbyPartners.length > 0 ? (
        <ScrollView contentContainerStyle={[styles.cardsContainer, { minHeight: screenHeight - 100 }]} showsVerticalScrollIndicator={false}>
          {nearbyPartners.map((partner) => {
            const specs = partnersSpecialities
              .filter((ps) => ps.partner_id === partner.id)
              .map((ps) => {
                const spec = specialities.find((s) => s.id === ps.speciality_id);
                return spec ? spec.name : "";
              })
              .filter((name) => name !== "");

            return (
              <TouchableOpacity key={partner.id} style={styles.partnerCard} onPress={() => router.push({
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
              })}>

                <View style={styles.cardImageWrapper}>
                  <Image
                    source={{ uri: partner.logo_url || "https://i.sstatic.net/kRRyP.png" }}
                    style={styles.cardImage}
                  />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.nameText} numberOfLines={2}>
                    {partner.name}
                  </Text>
                  <Text style={styles.distanceText}>
                    ~{partner.distance?.toFixed(2)} km
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View style={[styles.centerContainer, { height: screenHeight - 100 }]}>
          <Text style={styles.noResultsText}>
            No se encontraron talleres cercanos en un radio de {distanceRadius} km.
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", paddingTop: 50, paddingBottom: 20, paddingHorizontal: 15, backgroundColor: "#27B9BA", borderBottomWidth: 1, borderBottomColor: "#eee" },
  titleRecommendations: { fontSize: 25, fontWeight: "bold", color: "#000000ff", textAlign: "center", backgroundColor: "#fff", width: "100%", padding: 10 },
  cardsContainer: { flexGrow: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", alignItems: "flex-start", paddingVertical: 15, backgroundColor: "#fff" },
  partnerCard: { width: "42%", height: 180, alignItems: "center", backgroundColor: "#27B9BA", borderRadius: 10, marginVertical: 8, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, overflow: "hidden" },
  cardImageWrapper: { width: "100%", height: 100, backgroundColor: "#f2f2f2", justifyContent: "center", alignItems: "center", },
  cardImage: { width: "100%", height: "100%", resizeMode: "contain", },
  cardContent: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 6 },
  nameText: { fontSize: 16, fontWeight: "bold", color: "#fff", textAlign: "center" },
  distanceText: { color: "#fff", fontSize: 12, marginTop: 4 },
  centerContainer: { justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  noResultsText: { fontSize: 18, textAlign: "center", color: "#555", paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
