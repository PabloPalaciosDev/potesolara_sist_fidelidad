import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, getToken, writeLog } from "./axios"; // Importa writeLog

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Usuario autenticado
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const loadUser = async () => {
            try {
                await writeLog("Iniciando validación del token almacenado...");
                const token = await getToken();
                if (token) {
                    await writeLog(`Token encontrado: ${token}`);
                    const response = await apiClient.get(
                        "/ClienteParticipantes/ValidateToken"
                    );
                    await writeLog(
                        `Respuesta de ValidateToken: ${response.data.message}`
                    );
                    setUser({ token });
                    await writeLog("Usuario autenticado con token válido.");
                } else {
                    await writeLog("No se encontró un token almacenado.");
                }
            } catch (error) {
                console.error("Error en ValidateToken:", error);
                await writeLog(`Error en ValidateToken: ${error.message}`);
                await AsyncStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
                await writeLog("Finalizó la validación del token.");
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            await writeLog("Intentando iniciar sesión...");
            const response = await apiClient.post(
                "/ClienteParticipantes/Login",
                {
                    email,
                    password,
                }
            );

            const userMapped = {
                id: response.data.idCliente,
                nombre: response.data.name,
                lastname: response.data.lastname,
                cedula: response.data.cedula,
                token: response.data.token,
                email: response.data.email,
            };

            await AsyncStorage.setItem("token", userMapped.token);
            await writeLog(`Token guardado: ${userMapped.token}`);

            setUser(userMapped);
            await writeLog(
                `Inicio de sesión exitoso para el usuario: ${userMapped.email}`
            );
        } catch (error) {
            console.error("Error en el login:", error);
            await writeLog(`Error en el login: ${error.message}`);
        }
    };

    const logout = async () => {
        try {
            await writeLog("Cerrando sesión...");
            await AsyncStorage.removeItem("token");
            setUser(null);
            await writeLog("Sesión cerrada y token eliminado.");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            await writeLog(`Error al cerrar sesión: ${error.message}`);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
