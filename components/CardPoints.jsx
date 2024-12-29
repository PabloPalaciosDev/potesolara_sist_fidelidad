import { StyleSheet, Text, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "./Screen";
import { Stack } from "expo-router";

export default function CardScreen() {
    const puntos = 7; // Puntos quemados para demostración

    const renderPuntitos = () => {
        const puntitos = [];
        for (let i = 0; i < 10; i++) {
            puntitos.push(
                <Ionicons
                    key={i}
                    name="ellipse"
                    size={24}
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
                    <Text style={styles.cardPoints}>{puntos}/10</Text>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
});
