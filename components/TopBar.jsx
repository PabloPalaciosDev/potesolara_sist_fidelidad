import { StyleSheet, Text, View } from "react-native";

export default function TopBar() {
    return (
        <View style={styles.topBar}>
            <Text style={styles.title}>Sistema Solara</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        width: "100%",
        backgroundColor: "#52b62c", // Color de fondo de la barra
        paddingVertical: 15,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#fff", // Color del borde inferior
    },
    title: {
        color: "#fff", // Color del texto
        fontSize: 20,
        fontWeight: "bold",
    },
});
