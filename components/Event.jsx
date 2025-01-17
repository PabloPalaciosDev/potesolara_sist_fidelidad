import React, { useEffect, useState, useContext } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import {
    Card,
    Button,
    Modal,
    Portal,
    Text,
    ActivityIndicator,
    IconButton,
} from "react-native-paper";
import { getEventoByGuid, crearAsistncia } from "../services/events";
import PropTypes from "prop-types";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";

export default function EventScreen({ idevento }) {
    const { user } = useContext(AuthContext);
    const [evento, setEvento] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [asistido, setAsistido] = useState(false);

    useEffect(() => {
        async function fetchEvento() {
            try {
                const data = await getEventoByGuid(idevento);
                setEvento(data.data);
            } catch (error) {
                console.error("Error al cargar el evento:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEvento();
    }, [idevento]);

    const handleAsistencia = async () => {
        try {
            const response = await crearAsistncia(idevento, user?.id);
            setResponseMessage(response?.message || "¡Operación completada!");
            setAsistido(true);
        } catch (error) {
            if (error.isUnauthorized) {
                await handleUnauthorizedError(router);
            } else {
                console.error("Error en handleAsistencia:", error);
                setResponseMessage(
                    error?.response?.message ||
                        "Hubo un error al registrar tu asistencia"
                );
            }
        } finally {
            setModalVisible(false);
            setResponseModalVisible(true);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con botón de regreso */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    color="white"
                    size={24}
                    onPress={() => router.replace("/")}
                />
                <Text style={styles.headerTitle}>{evento?.nombreEvento}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.eventName}>
                            {evento?.nombreEvento}
                        </Text>
                        <Text style={styles.eventDetails}>
                            📅 Fecha:{" "}
                            {new Date(evento?.fechaEvento).toLocaleDateString(
                                "es-ES"
                            )}
                        </Text>
                        <Text style={styles.eventDetails}>
                            🕒 Hora: {evento?.horaEvento}
                        </Text>
                        <Text style={styles.eventDetails}>
                            📍 Lugar: {evento?.lugarEvento}
                        </Text>
                        <Text style={styles.eventDetails}>
                            💵 Precio: {evento?.precioEvento}
                        </Text>

                        <Text style={styles.detailsHeader}>
                            Detalles del Taller:
                        </Text>
                        <Text style={styles.detailsText}>
                            📋 {evento?.descripcionEvento}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Botón Apuntarse */}
                <View style={styles.attendButtonContainer}>
                    {evento?.asistenciaEventos.find(
                        (asistencia) => asistencia.idCliente === user?.id
                    ) ? (
                        <Button
                            mode="contained"
                            style={styles.alreadyAttendedButton}
                            
                        >
                            ¡Ya estás apuntado a este taller!
                        </Button>
                    ) : (
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(true)}
                            style={styles.attendButton}
                            disabled={asistido}
                        >
                            {asistido
                                ? "¡Ya estás apuntado a este taller!"
                                : "Apuntarse al taller 📝"}
                        </Button>
                    )}
                </View>
            </ScrollView>

            {/* Modal de confirmación */}
            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text style={styles.modalText}>
                        ¿Deseas apuntarte a este taller?
                    </Text>
                    <View style={styles.modalButtons}>
                        <Button
                            mode="outlined"
                            onPress={() => setModalVisible(false)}
                            style={styles.modalButtonCancel}
                        >
                            Cancelar
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleAsistencia}
                            style={styles.modalButtonConfirm}
                        >
                            Confirmar
                        </Button>
                    </View>
                </Modal>
            </Portal>

            {/* Modal de respuesta */}
            <Portal>
                <Modal
                    visible={responseModalVisible}
                    onDismiss={() => setResponseModalVisible(false)}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text style={styles.modalText}>{responseMessage}</Text>
                    <Button
                        mode="contained"
                        onPress={() => setResponseModalVisible(false)}
                        style={styles.modalButtonConfirm}
                    >
                        Cerrar
                    </Button>
                </Modal>
            </Portal>
        </View>
    );
}

EventScreen.propTypes = {
    idevento: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 80,
        backgroundColor: "#52b62c",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    headerTitle: {
        fontSize: 22,
        color: "white",
        fontWeight: "bold",
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 16,
        elevation: 3,
        borderRadius: 8,
    },
    eventName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    eventDetails: {
        fontSize: 16,
        marginBottom: 6,
    },
    detailsHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
    },
    detailsText: {
        fontSize: 16,
    },
    attendButtonContainer: {
        alignItems: "center",
        marginVertical: 20,
    },
    attendButton: {
        width: "80%",
        color: "white",
    },
    alreadyAttendedButton: {
        backgroundColor: "#52b62c",
        color: "white",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButtonCancel: {
        flex: 1,
        marginRight: 8,
    },
    modalButtonConfirm: {
        flex: 1,
    },
});
