import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { AuthContext } from "../utils/AuthProvider";
import React, { useContext } from "react";

export default function ProfileScreen() {
    const { user } = useContext(AuthContext);
    return (
        <Screen>
            <Stack.Screen
                options={{
                    title: "Perfil",
                    headerStyle: {
                        backgroundColor: "#52b62c",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            />
            <View style={{ alignItems: "center" }}>
                {/* Encabezado con la imagen del perfil */}
                <View style={styles.header}>
                    <FontAwesome name="user" size={100} color="black" />
                    <Text style={styles.userName}>
                        {user?.nombre} {user?.lastname}
                    </Text>
                </View>

                {/* Detalles del perfil */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Cédula:</Text>
                        <Text style={styles.detailValue}>{user?.cedula}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Correo:</Text>
                        <Text style={styles.detailValue}>{user?.email}</Text>
                    </View>
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: "center",
        marginBottom: 20,
        paddingTop: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    userEmail: {
        fontSize: 16,
        color: "#666",
    },
    detailsContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
        width: "90%",
    },
    detailItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: "#333",
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#52b62c",
    },
    actionsContainer: {
        alignItems: "center",
    },
    actionButton: {
        backgroundColor: "#52b62c",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    actionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    actionButtonSecondary: {
        backgroundColor: "#e74c3c",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    actionTextSecondary: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
