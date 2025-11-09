import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Partner } from '@backend-types/partner';

export default function PartnerDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const partner = params as unknown as Partner;

    if (!partner || !partner.id) {
        return (
            <View style={styles.center}>
                <Text>Taller no encontrado o datos incompletos.</Text>
            </View>
        );
    }
    return (
        <>
            <Stack.Screen options={{ title: partner.location , headerStyle: { backgroundColor: '#27B9BA' },headerTintColor: '#fff', }} />
            <ScrollView style={styles.container}>
                <Image
                    source={
                        partner.logo_url
                            ? { uri: partner.logo_url }
                            : require("@/assets/images/taller-electrico-automotriz.jpg")
                    }
                    style={styles.partnerImage}
                />
                <View style={styles.content}>
                    <Text style={styles.partnerName}>{partner.location || "Centro Automotriz Caballero"}</Text>
                    <Text style={styles.partnerSubtitle}>Taller certificado</Text>
                    <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={20} color="#27B9BA" />
                        <Text style={styles.detailText}>{partner.location || "Valle de Bravo Estado de México"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="call-outline" size={20} color="#27B9BA" />
                        <Text style={styles.detailText}>{"1234567890"}</Text>
                    </View>
                    <Text style={styles.partnerInfo}>
                        <Ionicons name="star" size={25} color="#FFD700" />
                        <Ionicons name="star" size={25} color="#FFD700" />
                        <Ionicons name="star" size={25} color="#FFD700" />
                        <Ionicons name="star" size={25} color="#FFD700" />
                        <Ionicons name="star-outline" size={25} color="#FFD700" />
                        <Text style={{ marginLeft: 5, color: '#333', fontWeight: '600' }}>4.0</Text>
                    </Text>
                    <Text style={styles.sectionTitle}>Servicios</Text>
                    <Text style={styles.descriptionText}>Diagnóstico computarizado, Mantenimiento preventivo, Sistema de frenos, Suspensión y dirección, Reparación de motor, Aire acondicionado automotriz, Sistema eléctrico.</Text>
                    <Text style={styles.sectionTitle}>Ventajas</Text>
                    <Text style={styles.descriptionText}>Garantía en cada servicio, Técnicos certificados, Herramientas profesionales, Escáner automotriz de última generación, Refacciones de calidad.</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ccc' }]}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.actionButtonText}>Cerrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#27B9BA' }]}
                            onPress={() => console.log('Confirmado')}
                        >
                            <Text style={styles.actionButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    partnerImage: { width: '100%', height: 250, resizeMode: 'cover' },
    content: { padding: 20 },
    partnerName: { fontSize: 30, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    partnerSubtitle: { fontSize: 20, color: '#2e2d2dff', marginBottom: 20 },
    detailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailText: { marginLeft: 10, fontSize: 16, color: '#555' },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#27B9BA', marginTop: 15, marginBottom: 5 },
    descriptionText: { fontSize: 16, color: '#666', lineHeight: 22, marginBottom: 10 },
    partnerInfo: { fontSize: 25, marginVertical: 10, },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 20, },
    actionButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 5, },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, },
});