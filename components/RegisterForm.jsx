import React, { useContext, useState } from "react";
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Platform,
} from "react-native";
import {
    TextInput,
    Button,
    Card,
    Text,
    Modal,
    Portal,
    Paragraph,
    Title,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
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
            .nullable(),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            const response = await register(values);
            if (response?.success) {
                setModalMessage("¡Registro exitoso! Ahora se iniciará sesión.");
                setModalVisible(true);
            } else {
                setModalMessage(response?.message || "Error al registrar.");
                setModalVisible(true);
            }
        } catch (error) {
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
                        fechaNacimiento: null,
                        showDatePicker: false,
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
                        <Card style={styles.card}>
                            <Card.Content>
                                <Title style={styles.title}>
                                    Registrarse
                                </Title>
                                <Image
                                    source={require("../assets/potessolara.png")}
                                    style={styles.image}
                                />
                                <TextInput
                                    label="Cédula"
                                    value={values.cedula}
                                    onChangeText={handleChange("cedula")}
                                    onBlur={handleBlur("cedula")}
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.cedula && !!errors.cedula}
                                />
                                {touched.cedula && errors.cedula && (
                                    <Text style={styles.error}>
                                        {errors.cedula}
                                    </Text>
                                )}
                                <TextInput
                                    label="Nombre"
                                    value={values.nombre}
                                    onChangeText={handleChange("nombre")}
                                    onBlur={handleBlur("nombre")}
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.nombre && !!errors.nombre}
                                />
                                {touched.nombre && errors.nombre && (
                                    <Text style={styles.error}>
                                        {errors.nombre}
                                    </Text>
                                )}
                                <TextInput
                                    label="Apellido"
                                    value={values.apellido}
                                    onChangeText={handleChange("apellido")}
                                    onBlur={handleBlur("apellido")}
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.apellido && !!errors.apellido}
                                />
                                {touched.apellido && errors.apellido && (
                                    <Text style={styles.error}>
                                        {errors.apellido}
                                    </Text>
                                )}
                                <TextInput
                                    label="Teléfono"
                                    value={values.telefono}
                                    onChangeText={handleChange("telefono")}
                                    onBlur={handleBlur("telefono")}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.telefono && !!errors.telefono}
                                />
                                {touched.telefono && errors.telefono && (
                                    <Text style={styles.error}>
                                        {errors.telefono}
                                    </Text>
                                )}
                                <TextInput
                                    label="Email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    keyboardType="email-address"
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.email && !!errors.email}
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.error}>
                                        {errors.email}
                                    </Text>
                                )}
                                <TextInput
                                    label="Contraseña"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    secureTextEntry
                                    mode="outlined"
                                    style={styles.input}
                                    error={touched.password && !!errors.password}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.error}>
                                        {errors.password}
                                    </Text>
                                )}

                                {/* Fecha de nacimiento */}
                                <Button
                                    mode="outlined"
                                    onPress={() =>
                                        setFieldValue("showDatePicker", true)
                                    }
                                    style={styles.datePickerButton}
                                >
                                    {values.fechaNacimiento
                                        ? new Date(
                                              values.fechaNacimiento
                                          ).toLocaleDateString()
                                        : "Seleccionar fecha de nacimiento"}
                                </Button>
                                {touched.fechaNacimiento &&
                                    errors.fechaNacimiento && (
                                        <Text style={styles.error}>
                                            {errors.fechaNacimiento}
                                        </Text>
                                    )}
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
                                        display={
                                            Platform.OS === "ios"
                                                ? "inline"
                                                : "default"
                                        }
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

                                <Button
                                    mode="contained"
                                    onPress={handleSubmit}
                                    disabled={isSubmitting}
                                    style={styles.registerButton}
                                >
                                    {isSubmitting
                                        ? "Registrando..."
                                        : "Registrarse"}
                                </Button>
                                <Text style={{ marginTop: 20 }}>
                                    ¿Ya tienes una cuenta?{" "}
                                    <Text
                                        style={styles.link}
                                        onPress={() =>
                                            router.replace("/login")
                                        }
                                    >
                                        Inicia sesión
                                    </Text>
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                </Formik>
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={handleModalClose}
                        contentContainerStyle={styles.modalContent}
                    >
                        <Paragraph style={styles.modalText}>
                            {modalMessage}
                        </Paragraph>
                        <Button
                            mode="contained"
                            onPress={handleModalClose}
                            style={styles.modalButton}
                        >
                            Continuar
                        </Button>
                    </Modal>
                </Portal>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RegisterForm;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    card: {
        padding: 16,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
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
    datePickerButton: {
        marginBottom: 16,
    },
    registerButton: {
        marginTop: 20,
        backgroundColor: "#4CAF50",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    link: {
        color: "#4CAF50",
        fontWeight: "bold",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalText: {
        marginBottom: 20,
        textAlign: "center",
    },
    modalButton: {
        marginTop: 10,
    },
});
