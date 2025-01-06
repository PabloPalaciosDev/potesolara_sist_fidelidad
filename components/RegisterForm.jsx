import React, { useContext, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView,
    SafeAreaView,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importar DateTimePicker
import { AuthContext } from "../utils/AuthProvider";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";

const RegisterForm = () => {
    const { register, login } = useContext(AuthContext);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // Esquema de validación con Yup
    const validationSchema = Yup.object().shape({
        cedula: Yup.string()
            .required("La cédula es obligatoria")
            .matches(/^\d+$/, "La cédula debe contener solo números"),
        nombre: Yup.string()
            .required("El nombre es obligatorio")
            .min(2, "El nombre debe tener al menos 2 caracteres"),
        apellido: Yup.string()
            .required("El apellido es obligatorio")
            .min(2, "El apellido debe tener al menos 2 caracteres"),
        telefono: Yup.string()
            .required("El teléfono es obligatorio")
            .matches(/^\d+$/, "El teléfono debe contener solo números")
            .min(8, "El teléfono debe tener al menos 8 dígitos"),
        email: Yup.string()
            .email("Correo electrónico inválido")
            .required("El correo es obligatorio"),
        password: Yup.string()
            .required("La contraseña es obligatoria")
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        fechaNacimiento: Yup.date()
            .required("La fecha de nacimiento es obligatoria")
            .nullable(), // Permitir valores nulos temporalmente hasta que el usuario seleccione una fecha
    });

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            const response = await register(values);

            if (response?.success) {
                setModalMessage("¡Registro exitoso! Ahora se iniciará sesión.");
                setModalVisible(true);
            } else {
                console.log("Error del servidor:", response);
                setModalMessage(response?.message || "Error al registrar.");
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            setModalMessage(
                "Ocurrió un error inesperado. Por favor, inténtalo nuevamente."
            );
            setModalVisible(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalClose = async () => {
        setModalVisible(false);
        if (modalMessage.includes("Registro exitoso")) {
            const loginResponse = await login();
            if (loginResponse) {
                router.replace("/");
            } else {
                Alert.alert("Error", "No se pudo iniciar sesión");
            }
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Formik
                    initialValues={{
                        cedula: "",
                        nombre: "",
                        apellido: "",
                        telefono: "",
                        email: "",
                        password: "",
                        fechaNacimiento: null, // Inicializar fecha de nacimiento como nulo
                        showDatePicker: false, // Estado interno para mostrar el DateTimePicker
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <View style={styles.container}>
                            <Text style={styles.title}>Registrarse</Text>
                            <Image
                                source={require("../assets/potessolara.png")}
                                style={styles.image}
                            />
                            <TextInput
                                placeholder="Cédula"
                                value={values.cedula}
                                onChangeText={handleChange("cedula")}
                                onBlur={handleBlur("cedula")}
                                style={styles.input}
                            />
                            {touched.cedula && errors.cedula && (
                                <Text style={styles.error}>
                                    {errors.cedula}
                                </Text>
                            )}
                            <TextInput
                                placeholder="Nombre"
                                value={values.nombre}
                                onChangeText={handleChange("nombre")}
                                onBlur={handleBlur("nombre")}
                                style={styles.input}
                            />
                            {touched.nombre && errors.nombre && (
                                <Text style={styles.error}>
                                    {errors.nombre}
                                </Text>
                            )}
                            <TextInput
                                placeholder="Apellido"
                                value={values.apellido}
                                onChangeText={handleChange("apellido")}
                                onBlur={handleBlur("apellido")}
                                style={styles.input}
                            />
                            {touched.apellido && errors.apellido && (
                                <Text style={styles.error}>
                                    {errors.apellido}
                                </Text>
                            )}
                            <TextInput
                                placeholder="Teléfono"
                                value={values.telefono}
                                onChangeText={handleChange("telefono")}
                                onBlur={handleBlur("telefono")}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                            {touched.telefono && errors.telefono && (
                                <Text style={styles.error}>
                                    {errors.telefono}
                                </Text>
                            )}
                            <TextInput
                                placeholder="Email"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                keyboardType="email-address"
                                style={styles.input}
                            />
                            {touched.email && errors.email && (
                                <Text style={styles.error}>{errors.email}</Text>
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
                                <Text style={styles.error}>
                                    {errors.password}
                                </Text>
                            )}

                            {/* Campo de selección de fecha de nacimiento */}
                            <View style={styles.datePickerContainer}>
                                <TouchableOpacity
                                    onPress={() =>
                                        setFieldValue("showDatePicker", true)
                                    }
                                    style={styles.datePickerButton}
                                >
                                    <Text style={styles.datePickerText}>
                                        {values.fechaNacimiento
                                            ? new Date(
                                                  values.fechaNacimiento
                                              ).toLocaleDateString()
                                            : "Seleccionar fecha de nacimiento"}
                                    </Text>
                                </TouchableOpacity>

                                {touched.fechaNacimiento &&
                                    errors.fechaNacimiento && (
                                        <Text style={styles.error}>
                                            {errors.fechaNacimiento}
                                        </Text>
                                    )}

                                {/* Mostrar DateTimePicker si el usuario presiona el botón */}
                                {values.showDatePicker && (
                                    <DateTimePicker
                                        value={
                                            values.fechaNacimiento
                                                ? new Date(
                                                      values.fechaNacimiento
                                                  )
                                                : new Date()
                                        }
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setFieldValue(
                                                "showDatePicker",
                                                false
                                            );
                                            if (selectedDate) {
                                                setFieldValue(
                                                    "fechaNacimiento",
                                                    selectedDate.toISOString()
                                                );
                                            }
                                        }}
                                    />
                                )}
                            </View>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.buttonText}>
                                    {isSubmitting
                                        ? "Registrando..."
                                        : "Registrarse"}
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{ flexDirection: "row", marginTop: 20 }}
                            >
                                <Text>¿Ya tienes una cuenta? </Text>
                                <TouchableOpacity
                                    onPress={() => router.replace("/login")}
                                >
                                    <Text style={{ color: "#4CAF50" }}>
                                        Inicia sesión
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Modal para mostrar mensajes */}
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalText}>
                                            {modalMessage}
                                        </Text>
                                        <Pressable
                                            style={styles.modalButton}
                                            onPress={handleModalClose}
                                        >
                                            <Text style={styles.buttonText}>
                                                Continuar
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterForm;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    container: {
        alignItems: "center",
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
    registerButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    datePickerContainer: {
        width: "100%",
        marginBottom: 20,
    },
    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    datePickerText: {
        fontSize: 16,
        color: "#333",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        elevation: 5,
        width: "80%",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: "center",
    },
    modalButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
});
