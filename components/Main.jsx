import React, { useEffect, useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native";
import { useNavigation, Stack, useRouter } from "expo-router";
import { Screen } from "./Screen";
import { getEventos } from "../services/events";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";
import { Card, Title, Paragraph, ActivityIndicator, Button } from "react-native-paper";

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
    }, [router]);

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
                    <Title style={styles.welcomeText}>
                        Bienvenido, {user?.nombre} {user?.lastname}
                    </Title>
                </View>
                <View style={styles.content}>
                    <Title style={styles.title}>Talleres</Title>
                    {loading ? (
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            color="#52b62c"
                            style={styles.loadingIndicator}
                        />
                    ) : eventos.length > 0 ? (
                        <FlatList
                            data={eventos}
                            keyExtractor={(item) => item.idEvento.toString()}
                            renderItem={({ item }) => (
                                <Card
                                    style={styles.card}
                                    onPress={() =>
                                        navigation.navigate("[idevento]", {
                                            idevento: item.idEvento,
                                        })
                                    }
                                >
                                    <Card.Content>
                                        <Title style={styles.eventName}>
                                            {item.nombreEvento}
                                        </Title>
                                        <Paragraph style={styles.eventDetails}>
                                            📅 Fecha:{" "}
                                            {new Date(
                                                item.fechaEvento
                                            ).toLocaleDateString("es-ES")}
                                        </Paragraph>
                                        <Paragraph style={styles.eventDetails}>
                                            🕒 Hora: {item.horaEvento}
                                        </Paragraph>
                                        <Paragraph style={styles.eventDetails}>
                                            📍 Lugar: {item.lugarEvento}
                                        </Paragraph>
                                        <Paragraph style={styles.eventDetails}>
                                            💵 Precio: {item.precioEvento}$
                                        </Paragraph>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button
                                            mode="contained"
                                            onPress={() =>
                                                navigation.navigate("[idevento]", {
                                                    idevento: item.idEvento,
                                                })
                                            }
                                        >
                                            Ver detalles
                                        </Button>
                                    </Card.Actions>
                                </Card>
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
    loadingIndicator: {
        marginTop: 20,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        elevation: 3,
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
        height: 8,
    },
    noEventsText: {
        fontSize: 16,
        color: "#666",
    },
});

