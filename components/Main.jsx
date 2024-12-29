import React, { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { AuthContext } from "../utils/AuthProvider";

export default function Main() {
    const { user, login, logout } = useContext(AuthContext);
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
                    {user ? (
                        <Button
                            title="Cerrar Sesión"
                            onPress={logout}
                            color="#52b62c"
                        />
                    ) : (
                        <Button
                            title="Iniciar Sesión"
                            onPress={() => login("testuser", "password123")}
                            color="#52b62c"
                        />
                    )}
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
});
