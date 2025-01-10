import React, { useEffect, useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
} from "react-native";
import { useNavigation, Stack, useRouter } from "expo-router";
import { Screen } from "./Screen";
import { getEventos } from "../services/events";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";

export default function Main() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const router = useRouter(); // Para redirigir al login
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchEventos() {
            setLoading(true);
            try {
                const data = await getEventos();
                setEventos(data.data);
            } catch (error) {
                if (error.isUnauthorized) {
                    // Manejar el error 401 limpiando el token y redirigiendo al login
                    await handleUnauthorizedError(router);
                } else {
                    console.error("Error al cargar eventos:", error);
                    Alert.alert(
                        "Error",
                        "Ocurrió un problema al cargar los eventos."
                    );
                }
            } finally {
                setLoading(false);
            }
        }
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
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        Bienvenido, {user?.nombre} {user?.lastname}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title}>Talleres</Text>
                    {loading ? (
                        <Text style={styles.loadingText}>
                            Cargando talleres...
                        </Text>
                    ) : eventos.length > 0 ? (
                        <FlatList
                            data={eventos}
                            keyExtractor={(item) => item.idEvento}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.eventItem}
                                    onPress={() =>
                                        navigation.navigate(`[idevento]`, {
                                            idevento: item.idEvento,
                                        })
                                    }
                                >
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
                                    <Text style={styles.eventDetails}>
                                        💵 Precio: {item.precioEvento}$
                                    </Text>
                                </Pressable>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separator} />
                            )}
                        />
                    ) : (
                        <Text style={styles.noEventsText}>
                            No hay Talleres para este mes
                        </Text>
                    )}
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    header: {
        padding: 16,
    },
    welcomeText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: "#666",
    },
    eventItem: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    eventName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    eventDetails: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    separator: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 8,
    },
    noEventsText: {
        fontSize: 16,
        color: "#666",
    },
});
