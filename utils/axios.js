import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiClient = axios.create({
    baseURL: "https://localhost:7273/api/v1",
    timeout: 10000,
});

export const getToken = async () => {
    try {
        const token =
            (await SecureStore.getItemAsync("token")) ||
            (await AsyncStorage.getItem("token"));
        return token;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        return null;
    }
};

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error en el interceptor de solicitud:", error);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("Error en la respuesta HTTP:", error.response.data);
            if (error.response.status === 401) {
                console.warn(
                    "Token expirado o inválido. Considera redirigir al login."
                );
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
