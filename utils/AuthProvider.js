import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, getToken } from "../utils/axios";
import { VALIDATE_TOKEN_ENDPOINT, LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "@env";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Usuario autenticado
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await getToken();
                if (token) {
                    // Verificar si ya hay un usuario en AsyncStorage
                    const storedUser = await AsyncStorage.getItem("user");
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Validar el token si no hay usuario guardado
                        const response = await apiClient.get(
                            VALIDATE_TOKEN_ENDPOINT,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                        if (response?.data?.success) {
                            const userData = { token }; // Puedes incluir más datos del usuario si los necesitas
                            setUser(userData);
                            await AsyncStorage.setItem(
                                "user",
                                JSON.stringify(userData)
                            );
                        } else {
                            await AsyncStorage.removeItem("token");
                        }
                    }
                }
            } catch (error) {
                console.error("Error en ValidateToken:", error);
                await AsyncStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post(
                LOGIN_ENDPOINT,
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
            await AsyncStorage.setItem("user", JSON.stringify(userMapped)); // Guarda los datos del usuario

            setUser(userMapped);

            return true;
        } catch (error) {
            console.error("Error en el login:", error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem("token");
            await AsyncStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const register = async (data) => {
        try {
            const response = await apiClient.post(
                REGISTER_ENDPOINT,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                return error.response.data;
            }

            return { success: false, message: "Ocurrió un error inesperado." };
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );
};