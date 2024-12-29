import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import { AuthContext } from "../utils/AuthProvider";
import { useRouter } from "expo-router";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            router.replace("/"); // Redirige al layout de las pestañas tras el login
        } catch (error) {
            Alert.alert("Error", "No se pudo iniciar sesión");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
                Iniciar Sesión
            </Text>
            <Image source={require("../assets/potessolara.png")} />
            <TextInput
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                style={{
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    padding: 8,
                }}
            />
            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderBottomWidth: 1,
                    marginBottom: 20,
                    padding: 8,
                }}
            />
            <Button title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    );
};

export default LoginForm;
