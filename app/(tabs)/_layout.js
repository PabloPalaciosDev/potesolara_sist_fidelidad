import React, { useContext } from "react";
import { Tabs } from "expo-router";
import {
    HomeIcon,
    ProfileIcon,
    CardMembershipIcon,
    EventIcon,
    LogoutIcon,
} from "../../components/Icons";
import { TouchableOpacity } from "react-native";
import { AuthContext } from "../../utils/AuthProvider";

export default function TabsLayout() {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        // Lógica para cerrar sesión
        logout();
    };

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    height: 60, // Altura de la barra de pestañas
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12, // Reducir el tamaño de la etiqueta
                },
                tabBarIconStyle: {
                    width: 24, // Asegurarte de que los íconos no sean demasiado grandes
                    height: 24,
                },
                headerRight: () => (
                    <TouchableOpacity
                        style={{ marginRight: 15 }}
                        onPress={handleLogout}
                    >
                        <LogoutIcon size={24} color="#fff" />
                    </TouchableOpacity>
                ),
                headerStyle: {
                    backgroundColor: "#52b62c", // Fondo de la barra superior
                },
                headerTintColor: "#fff", // Color del texto en la barra superior
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                title="Inicio"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <HomeIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <ProfileIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="cardpoints"
                options={{
                    title: "Puntos Solara",
                    tabBarIcon: ({ color, size }) => (
                        <CardMembershipIcon color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="event"
                options={{
                    title: "Talleres",
                    tabBarIcon: ({ color, size }) => (
                        <EventIcon color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
