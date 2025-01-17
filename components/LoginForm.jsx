import React, { useContext, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { TextInput, Button, Card, Text, Title, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../utils/AuthProvider";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Estado de carga

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        username: Yup.string().required("El usuario es obligatorio"),
        password: Yup.string().required("La contraseña es obligatoria"),
    });

    const handleLogin = async (values, { setSubmitting }) => {
        setLoading(true);
        try {
            const loginResponse = await login(values.username, values.password);
            if (loginResponse) {
                router.replace("/");
            } else {
                Alert.alert("Error", "No se pudo iniciar sesión");
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error inesperado");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
            }) => (
                <View style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.title}>Iniciar Sesión</Title>
                            <Image
                                source={require("../assets/potessolara.png")}
                                style={styles.image}
                            />
                            <TextInput
                                label="Correo electrónico"
                                mode="outlined"
                                value={values.username}
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                style={styles.input}
                                error={touched.username && !!errors.username}
                            />
                            {touched.username && errors.username && (
                                <Text style={styles.error}>{errors.username}</Text>
                            )}
                            <TextInput
                                label="Contraseña"
                                mode="outlined"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry
                                style={styles.input}
                                error={touched.password && !!errors.password}
                            />
                            {touched.password && errors.password && (
                                <Text style={styles.error}>{errors.password}</Text>
                            )}
                            <Button
                                mode="contained"
                                onPress={handleSubmit}
                                loading={loading}
                                disabled={isSubmitting || loading}
                                style={styles.loginButton}
                            >
                                {loading ? "Iniciando..." : "Iniciar Sesión"}
                            </Button>
                            <Button
                                mode="text"
                                onPress={() => router.push("/register")}
                                style={styles.registerButton}
                            >
                                Registrarse
                            </Button>
                        </Card.Content>
                    </Card>
                </View>
            )}
        </Formik>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        padding: 20,
    },
    card: {
        padding: 16,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 20,
    },
    input: {
        marginBottom: 16,
    },
    loginButton: {
        marginTop: 10,
        backgroundColor: "#4CAF50"
    },
    registerButton: {
        marginTop: 10,
        alignSelf: "center",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
});
