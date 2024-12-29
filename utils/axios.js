import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const apiClient = axios.create({
    baseURL: "https://localhost:7273/api/v1",
    timeout: 10000,
});

// Ruta del archivo de logs
const logFilePath = `${FileSystem.documentDirectory}logs.txt`;

// Función para escribir en el archivo de logs
const writeLog = async (message) => {
    try {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        await FileSystem.writeAsStringAsync(
            logFilePath,
            logMessage,
            { encoding: FileSystem.EncodingType.UTF8, append: true } // Añade al archivo
        );
        console.log("Log registrado:", logMessage);
    } catch (error) {
        console.error("Error al escribir en el archivo de logs:", error);
    }
};

// Función para obtener el token
export const getToken = async () => {
    try {
        const token =
            (await SecureStore.getItemAsync("token")) ||
            (await AsyncStorage.getItem("token"));
        return token;
    } catch (error) {
        console.error("Error al obtener el token:", error);
        await writeLog(`Error al obtener el token: ${error.message}`);
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
                await writeLog(
                    `Solicitud: ${config.method.toUpperCase()} ${
                        config.url
                    } con token`
                );
            } else {
                await writeLog(
                    `Solicitud: ${config.method.toUpperCase()} ${
                        config.url
                    } sin token`
                );
            }
        } catch (error) {
            console.error("Error en el interceptor de solicitud:", error);
            await writeLog(
                `Error en el interceptor de solicitud: ${error.message}`
            );
        }
        return config;
    },
    (error) => {
        writeLog(`Error al configurar la solicitud: ${error.message}`);
        return Promise.reject(error);
    }
);

// Interceptor de respuestas
apiClient.interceptors.response.use(
    async (response) => {
        await writeLog(
            `Respuesta exitosa: ${response.status} en ${response.config.url}`
        );
        return response;
    },
    async (error) => {
        if (error.response) {
            console.error("Error en la respuesta HTTP:", error.response.data);
            await writeLog(
                `Error en respuesta HTTP: ${error.response.status} en ${
                    error.response.config.url
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            console.error(
                "No se recibió respuesta del servidor:",
                error.request
            );
            await writeLog(
                `No se recibió respuesta del servidor en ${error.config?.url}`
            );
        } else {
            console.error(
                "Error en la configuración de la solicitud:",
                error.message
            );
            await writeLog(
                `Error en configuración de solicitud: ${error.message}`
            );
        }
        return Promise.reject(error);
    }
);

// Función para leer los logs (opcional)
export const readLogs = async () => {
    try {
        const logs = await FileSystem.readAsStringAsync(logFilePath, {
            encoding: FileSystem.EncodingType.UTF8,
        });
        console.log("Contenido del archivo de logs:\n", logs);
    } catch (error) {
        console.error("Error al leer el archivo de logs:", error);
    }
};
