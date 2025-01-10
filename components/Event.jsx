import React, { useEffect, useState, useContext } from "react";
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { getEventoByGuid, crearAsistncia } from "../services/events";
import PropTypes from "prop-types";
import { ComeBackIcon } from "./Icons";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";

export default function EventScreen({ idevento }) {
    const { user } = useContext(AuthContext);
    const [evento, setEvento] = useState(null);
    const [idEvento, setIdEvento] = useState(idevento);
    const [modalVisible, setModalVisible] = useState(false);
    const [responseModalVisible, setResponseModalVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const router = useRouter();
    const [asistido, setAsistido] = useState(false);

    useEffect(() => {
        async function fetchEvento() {
            const data = await getEventoByGuid(idevento);
            setEvento(data.data);
        }
        fetchEvento();
    }, [idevento]);

    const handleAsistencia = async () => {
        try {
            const response = await crearAsistncia(idEvento, user?.id);
            setResponseMessage(response?.message || "¡Operación completada!");
            setAsistido(true);
        } catch (error) {
            if (error.isUnauthorized) {
                // Llamar a handleUnauthorizedError solo si el error es un 401
                await handleUnauthorizedError(router);
            } else {
                console.error("Error en handleAsistencia:", error);
                setResponseMessage(
                    error?.response?.message ||
                        "Hubo un error al registrar tu asistencia"
                );
            }
        } finally {
            setModalVisible(false); // Cerrar el modal de confirmación
            setResponseModalVisible(true); // Abrir el modal con el mensaje de respuesta
        }
    };

    if (!evento) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con botón de regreso */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/")}
                >
                    <ComeBackIcon size={24} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>{evento?.nombreEvento}</Text>
            </View>

            {/* Botón Apuntarse */}
            <View style={styles.attendButtonContainer}>
                {/*buscar en el arreglo de evento?.asistenciaEventos si esta el id del cliente de user?id */}
                {evento?.asistenciaEventos.find(
                    (asistencia) => asistencia.idCliente === user?.id
                ) ? (
                    <Text style={styles.modalButtonAsistido}>
                        ¡Ya estás apuntado a este taller!
                    </Text>
                ) : (
                    <Pressable
                        style={styles.attendButton}
                        onPress={() => setModalVisible(true)}
                    >
                        {/*con emoji de lapiz de tarea */}
                        <Text style={styles.attendButtonText}>
                            {asistido
                                ? "¡Ya estás apuntado a este taller!"
                                : "Apuntarse al taller 📝"}
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* Modal de confirmación */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>
                            ¿Deseas apuntarte a este taller?
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[
                                    styles.modalButton,
                                    styles.modalButtonCancel,
                                ]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>
                                    Cancelar
                                </Text>
                            </Pressable>
                            <Pressable
                                style={[
                                    styles.modalButton,
                                    styles.modalButtonConfirm,
                                ]}
                                onPress={handleAsistencia}
                            >
                                <Text style={styles.modalButtonText}>
                                    Confirmar
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de respuesta */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={responseModalVisible}
                onRequestClose={() => setResponseModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{responseMessage}</Text>
                        <Pressable
                            style={[
                                styles.modalButton,
                                styles.modalButtonConfirm,
                            ]}
                            onPress={() => setResponseModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.eventItem}>
                    <Text style={styles.eventName}>{evento?.nombreEvento}</Text>
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

                    {/* Sección de detalles adicionales */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.detailsHeader}>
                            Detalles del Taller:
                        </Text>
                        <Text style={styles.detailsText}>
                            📋 {evento?.descripcionEvento}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

EventScreen.propTypes = {
    idevento: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    header: {
        height: 80,
        backgroundColor: "#52b62c",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    headerTitle: {
        fontSize: 22,
        color: "white",
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 20,
        color: "#666",
    },
    eventItem: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
        width: "100%",
    },
    eventName: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
        textAlign: "center",
    },
    eventDetails: {
        fontSize: 16,
        color: "#666",
        marginBottom: 6,
    },
    detailsSection: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    detailsHeader: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    detailsText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 6,
    },
    attendButtonContainer: {
        padding: 16,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    attendButton: {
        backgroundColor: "#52b62c",
        padding: 16,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    attendButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 8,
    },
    modalButtonCancel: {
        backgroundColor: "#ccc",
    },
    modalButtonConfirm: {
        backgroundColor: "#52b62c",
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    //estilo  de cuando ya asisti
    modalButtonAsistido: {
        backgroundColor: "#52b62c",
        color: "white",
        fontSize: 18,
        padding: 16,
        borderRadius: 10,
        fontWeight: "bold",
    },
});
