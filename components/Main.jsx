import React, { useContext, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { AuthContext } from "../utils/AuthProvider";
import { getEventos } from "../services/events";

export default function Main() {
    const { user, login, logout } = useContext(AuthContext);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar eventos al montar el componente
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await getEventos();
                setEventos(response.data); // Guardar los eventos en el estado
            } catch (error) {
                console.error("Error al obtener eventos:", error);
            } finally {
                setLoading(false); // Desactivar el indicador de carga
            }
        };

        fetchEventos();
    }, []);

    return (
        <Screen>
            <Stack.Screen
                options={{
                    title: "Inicio",
                    headerStyle: {
                        backgroundColor: "#52b62c",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            />
            <View style={styles.content}>
                <View style={styles.panel}>
                    <Text style={styles.panelText}>
                        {user
                            ? `¡Bienvenido, ${user.nombre} ${user.lastname}!`
                            : "Por favor, inicia sesión"}
                    </Text>
                    {/* Sección de noticias */}
                    <View style={styles.news}>
                        {/* Título con mes corriente */}
                        <Text style={styles.newsTitle}>
                            Eventos de{" "}
                            {new Date().toLocaleString("es-ES", {
                                month: "long",
                            })}
                        </Text>
                        {loading ? (
                            <Text style={styles.loadingText}>
                                Cargando eventos...
                            </Text>
                        ) : eventos.length > 0 ? (
                            <FlatList
                                data={eventos}
                                keyExtractor={(item) => item.idEvento}
                                renderItem={({ item }) => (
                                    <View style={styles.eventItem}>
                                        <Text style={styles.eventName}>
                                            {item.nombreEvento}
                                        </Text>
                                        <Text style={styles.eventDetails}>
                                            📅 Fecha:{" "}
                                            {new Date(
                                                item.fechaEvento
                                            ).toLocaleDateString("es-ES")}
                                        </Text>
                                        <Text style={styles.eventDetails}>
                                            🕒 Hora: {item.horaEvento}
                                        </Text>
                                        <Text style={styles.eventDetails}>
                                            📍 Lugar: {item.lugarEvento}
                                        </Text>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={styles.separator} />
                                )}
                            />
                        ) : (
                            <Text style={styles.noEventsText}>
                                No hay eventos para este mes
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    panel: {
        width: "90%",
        alignItems: "center",
    },
    panelText: {
        color: "#52b62c",
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
    },
    news: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: "100%",
        maxHeight: 400, // Altura máxima para la lista de eventos
        elevation: 3, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    newsTitle: {
        color: "#52b62c",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    loadingText: {
        color: "#333",
        fontSize: 16,
    },
    noEventsText: {
        color: "#666",
        fontSize: 16,
    },
    eventItem: {
        padding: 15,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        elevation: 2, // Sombra en Android
        shadowColor: "#000", // Sombra en iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    eventName: {
        color: "#52b62c",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    eventDetails: {
        color: "#555",
        fontSize: 14,
        marginBottom: 3,
    },
    separator: {
        height: 10,
    },
});
