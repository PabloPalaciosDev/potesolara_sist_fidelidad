import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient, getToken } from "./axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Usuario autenticado
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await getToken();
                if (token) {
                    const response = await apiClient.get(
                        "/ClienteParticipantes/ValidateToken"
                    );
                    console.log(
                        "Respuesta de ValidateToken:",
                        response.data.message
                    );
                    setUser({ token });
                }
            } catch (error) {
                console.error("Error en ValidateToken:", error);
                await AsyncStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
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

            setUser(userMapped);
        } catch (error) {
            console.error("Error en el login:", error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
