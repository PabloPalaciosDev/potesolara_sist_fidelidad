import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

export const apiClient = axios.create({
    baseURL: "https://localhost:7273/api/v1",
    timeout: 10000,
});

// Función para limpiar el token del almacenamiento
export const clearToken = async () => {
    try {
        if (Platform.OS === "web") {
            localStorage.removeItem("token");
        } else {
            await SecureStore.deleteItemAsync("token");
            await AsyncStorage.removeItem("token");
        }
    } catch (error) {
        console.error("Error al limpiar el token:", error);
    }
};

export const handleUnauthorizedError = async (router) => {
    await clearToken();
    Alert.alert(
        "Sesión finalizada",
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
    );
    router.replace("/login");
};

// Función para redirigir al login
export const redirectToLogin = (router) => {
    Alert.alert(
        "Sesión finalizada",
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
    );
    router.replace("/login"); // Redirigir al login
};

// Función para obtener el token
export const getToken = async () => {
    try {
        let token;
        if (Platform.OS === "web") {
            token = localStorage.getItem("token");
        } else {
            token =
                (await SecureStore.getItemAsync("token")) ||
                (await AsyncStorage.getItem("token"));
        }

        if (!token) {
            console.warn("No se encontró un token almacenado.");
        }
        return token;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        return null;
    }
};

// Interceptor de solicitudes
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            } else {
            }
        } catch (error) {
            console.error("Error en el interceptor de solicitud:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas
apiClient.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            const status = error.response.status;
            console.error("Error en la respuesta HTTP:", error.response.data);

            if (status === 401) {
                // Disparar un evento global para que el componente maneje el 401
                return Promise.reject({ isUnauthorized: true });
            }
        } else if (error.request) {
            console.error(
                "No se recibió respuesta del servidor:",
                error.request
            );
        } else {
            console.error(
                "Error en la configuración de la solicitud:",
                error.message
            );
        }
        return Promise.reject(error);
    }
);
