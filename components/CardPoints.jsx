import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { ActivityIndicator, Card, Text, Button, Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { getCards } from "../services/cards";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";
import { useRouter } from "expo-router";

export default function CardScreen() {
    const { user } = useContext(AuthContext);
    const [cardData, setCardData] = useState({ puntos: 0 }); // Por defecto, puntos en 0
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const router = useRouter();

    const fetchCardData = async () => {
        setLoading(true);
        try {
            const response = await getCards(user?.id);
            if (response?.success) {
                setCardData(response.data);
            } else {
                Alert.alert(
                    "Error",
                    response?.message || "No se pudo obtener los datos."
                );
            }
        } catch (error) {
            if (error.isUnauthorized) {
                await handleUnauthorizedError(router);
            } else {
                console.error("Error al obtener los datos:", error);
                Alert.alert("Error", "Ocurrió un error al obtener los datos.");
            }
        } finally {
            setLoading(false);
        }
    };

    const isBirthdayToday = () => {
        if (!user?.nacimiento) return false;

        const today = new Date();
        const birthDate = new Date(user.nacimiento);

        return (
            today.getDate() === birthDate.getDate() &&
            today.getMonth() === birthDate.getMonth()
        );
    };

    const handleClaimReward = (pointsRequired) => {
        if (cardData.puntos >= pointsRequired) {
            setSnackbarMessage(`¡Puedes reclamar tu premio de ${pointsRequired} puntos con Potes Solara!`);
        } else {
            setSnackbarMessage(`Necesitas ${pointsRequired} puntos para reclamar este premio.`);
        }
        setSnackbarVisible(true);
    };

    const handleClaimBirthdayReward = () => {
        if (isBirthdayToday()) {
            setSnackbarMessage("¡Feliz cumpleaños! 🎉 Puedes reclamar tu recompensa.");
        } else {
            setSnackbarMessage("Hoy no es tu cumpleaños.");
        }
        setSnackbarVisible(true);
    };

    const renderPuntitos = () => {
        const puntitos = [];
        const puntos = cardData?.puntos || 0;

        for (let i = 0; i < 12; i++) {
            puntitos.push(
                <Ionicons
                    key={i}
                    name="ellipse"
                    size={15}
                    color={i < puntos ? "#FFD700" : "#ccc"} // Amarillo para puntos llenos, gris para vacíos
                    style={styles.pointIcon}
                />
            );
        }
        return puntitos;
    };

    return (
        <Screen>
            <Stack.Screen
                options={{
                    title: "Puntos Solara",
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
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Image
                            source={require("../assets/potessolara.png")}
                            style={styles.cardImage}
                        />
                        <Text style={styles.cardTitle}>Puntos Acumulados</Text>
                        <View style={styles.pointsContainer}>
                            {renderPuntitos()}
                        </View>
                        <Text style={styles.cardPoints}>
                            {cardData.puntos}/12
                        </Text>
                    </Card.Content>
                </Card>
                <Button
                    mode="contained"
                    onPress={fetchCardData}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Consultando..." : "Consultar Puntos"}
                </Button>

                {/* Sección de recompensas */}
                <View style={styles.rewardsContainer}>
                    <Card style={styles.rewardCard}>
                        <Card.Content>
                            <Text style={styles.rewardTitle}>Recompensas</Text>
                            {/* Premio por 6 puntos */}
                            <View style={styles.rewardItem}>
                                <Text style={styles.rewardText}>
                                    Premio por 6 puntos:
                                </Text>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleClaimReward(6)}
                                    icon={
                                        cardData.puntos >= 6
                                            ? "check-circle"
                                            : "alert-circle-outline"
                                    }
                                    textColor={
                                        cardData.puntos >= 6
                                            ? "#52b62c"
                                            : "#ccc"
                                    }
                                    style={styles.rewardButton}
                                >
                                    {cardData.puntos >= 6
                                        ? "Disponible"
                                        : "No disponible"}
                                </Button>
                            </View>
                            {/* Premio por 12 puntos */}
                            <View style={styles.rewardItem}>
                                <Text style={styles.rewardText}>
                                    Premio por 12 puntos:
                                </Text>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleClaimReward(12)}
                                    icon={
                                        cardData.puntos >= 12
                                            ? "check-circle"
                                            : "alert-circle-outline"
                                    }
                                    textColor={
                                        cardData.puntos >= 12
                                            ? "#52b62c"
                                            : "#ccc"
                                    }
                                    style={styles.rewardButton}
                                >
                                    {cardData.puntos >= 12
                                        ? "Disponible"
                                        : "No disponible"}
                                </Button>
                            </View>
                            {/* Premio de cumpleaños */}
                            <View style={styles.rewardItem}>
                                <Text style={styles.rewardText}>
                                    Recompensa de cumpleaños:
                                </Text>
                                <Button
                                    mode="outlined"
                                    onPress={handleClaimBirthdayReward}
                                    icon={
                                        isBirthdayToday()
                                            ? "gift"
                                            : "calendar-alert"
                                    }
                                    textColor={
                                        isBirthdayToday() ? "#52b62c" : "#ccc"
                                    }
                                    style={styles.rewardButton}
                                >
                                    {isBirthdayToday()
                                        ? "Disponible"
                                        : "No disponible"}
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </View>

                {/* Snackbar para notificaciones */}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    action={{
                        label: "Cerrar",
                        onPress: () => setSnackbarVisible(false),
                    }}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f4f4f4",
    },
    card: {
        width: "90%",
        borderRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    cardContent: {
        alignItems: "center",
        padding: 20,
    },
    cardImage: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    pointsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    pointIcon: {
        marginHorizontal: 5,
    },
    cardPoints: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#52b62c",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#52b62c",
        width: "90%",
        paddingVertical: 10,
        borderRadius: 5,
    },
    rewardsContainer: {
        width: "90%",
        marginTop: 20,
    },
    rewardCard: {
        borderRadius: 10,
        elevation: 3,
    },
    rewardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    rewardItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    rewardText: {
        fontSize: 16,
    },
    rewardButton: {
        borderRadius: 20,
    },
});
