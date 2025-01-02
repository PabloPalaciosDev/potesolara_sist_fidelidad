import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
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
                    <Text style={styles.title}>Iniciar Sesión</Text>
                    <Image
                        source={require("../assets/potessolara.png")}
                        style={styles.image}
                    />
                    <TextInput
                        placeholder="Correo electrónico"
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        style={styles.input}
                    />
                    {touched.username && errors.username && (
                        <Text style={styles.error}>{errors.username}</Text>
                    )}
                    <TextInput
                        placeholder="Contraseña"
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry
                        style={styles.input}
                    />
                    {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                    )}
                    <TouchableOpacity
                        style={[styles.loginButton, loading && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={isSubmitting || loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Iniciando..." : "Iniciar Sesión"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => router.push("/register")}
                    >
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 20,
        padding: 8,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    registerButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
});
