import {
    StyleSheet,
    Text,
    View,
    Image,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { useState, useContext } from "react";
import { getCards } from "../services/cards";
import { AuthContext } from "../utils/AuthProvider";
import { handleUnauthorizedError } from "../utils/axios";
import { useRouter } from "expo-router"; // Para redirigir al login

export default function CardScreen() {
    const { user } = useContext(AuthContext);
    const [cardData, setCardData] = useState({ puntos: 0 }); // Por defecto, puntos en 0
    const [loading, setLoading] = useState(false);
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
                // Manejar el error 401 limpiando el token y redirigiendo al login
                await handleUnauthorizedError(router);
            } else {
                console.error("Error al obtener los datos:", error);
                Alert.alert("Error", "Ocurrió un error al obtener los datos.");
            }
        } finally {
            setLoading(false);
        }
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
                <View style={styles.card}>
                    <Image
                        source={require("../assets/potessolara.png")}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardTitle}>Puntos Acumulados</Text>
                    <View style={styles.pointsContainer}>
                        {renderPuntitos()}
                    </View>
                    <Text style={styles.cardPoints}>{cardData.puntos}/12</Text>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={fetchCardData}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Consultar Puntos</Text>
                    )}
                </TouchableOpacity>
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
    },
    card: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
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
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
