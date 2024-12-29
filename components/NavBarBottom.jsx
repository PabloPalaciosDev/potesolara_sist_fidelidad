import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { HomeIcon, CardMembershipIcon, ProfileIcon } from "../components/Icons";

export default function NavBarBottom() {
    return (
        <View style={styles.bottomBar}>
            <Link asChild href={"/cardpoints"}>
                <Pressable style={styles.menuItem}>
                    {({ pressed }) => (
                        <>
                            <CardMembershipIcon
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                            <Text style={styles.menuText}>Puntos</Text>
                        </>
                    )}
                </Pressable>
            </Link>
            <Link asChild href={"/profile"}>
                <Pressable style={styles.menuItem}>
                    {({ pressed }) => (
                        <>
                            <ProfileIcon
                                style={{ opacity: pressed ? 0.5 : 1 }}
                            />
                            <Text style={styles.menuText}>Perfil</Text>
                        </>
                    )}
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: "row", // Alineación horizontal
        backgroundColor: "#52b62c", // Color de la barra
        paddingVertical: 10, // Espaciado vertical
        justifyContent: "space-around", // Espaciado entre ítems
        alignItems: "center",
    },
    menuItem: {
        alignItems: "center",
    },
    menuText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 5, // Espaciado entre ícono y texto
    },
});
