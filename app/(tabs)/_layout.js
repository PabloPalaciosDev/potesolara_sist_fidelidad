import { Tabs } from "expo-router";
import {
    HomeIcon,
    ProfileIcon,
    CardMembershipIcon,
} from "../../components/Icons";

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
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
                    title: "Tarjeta",
                    tabBarIcon: ({ color, size }) => (
                        <CardMembershipIcon color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
