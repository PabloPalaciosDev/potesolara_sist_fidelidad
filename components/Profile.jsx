import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Card, Text, Button } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Screen } from "./Screen";
import { Stack } from "expo-router";
import { AuthContext } from "../utils/AuthProvider";
import { getToken } from "../utils/axios";

export default function ProfileScreen() {
	const { user } = useContext(AuthContext);
	console.log("Usuario:", user);
	console.log("Token:", getToken());

	return (
		<Screen>
			<Stack.Screen
				options={{
					title: "Perfil",
					headerStyle: {
						backgroundColor: "#52b62c",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			/>
			<View style={styles.container}>
				{/* Encabezado con avatar */}
				<Card style={styles.headerCard}>
					<Card.Content style={styles.headerContent}>
						<Avatar.Icon size={100} icon="account" style={styles.avatar} />
						<Text style={styles.userName}>
							{user?.nombre} {user?.lastname}
						</Text>
					</Card.Content>
				</Card>

				{/* Detalles del perfil */}
				<Card style={styles.detailsCard}>
					<Card.Content>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>Cédula:</Text>
							<Text style={styles.detailValue}>{user?.cedula}</Text>
						</View>
						<View style={styles.detailItem}>
							<Text style={styles.detailLabel}>Correo:</Text>
							<Text style={styles.detailValue}>{user?.email}</Text>
						</View>
					</Card.Content>
				</Card>

				{/* Acciones 
                <View style={styles.actionsContainer}>
                    <Button
                        mode="contained"
                        style={styles.actionButton}
                        onPress={() => console.log("Editar perfil")}
                    >
                        Editar perfil
                    </Button>
                    <Button
                        mode="contained"
                        buttonColor="#e74c3c"
                        style={styles.actionButtonSecondary}
                        onPress={() => console.log("Cerrar sesión")}
                    >
                        Cerrar sesión
                    </Button>
                </View>
                */}
			</View>
		</Screen>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f4f4f4",
	},
	headerCard: {
		alignItems: "center",
		marginBottom: 20,
		elevation: 3,
		borderRadius: 10,
	},
	headerContent: {
		alignItems: "center",
		padding: 20,
	},
	avatar: {
		backgroundColor: "#52b62c",
	},
	userName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginTop: 10,
	},
	detailsCard: {
		elevation: 3,
		borderRadius: 10,
		marginBottom: 20,
	},
	detailItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	detailLabel: {
		fontSize: 16,
		color: "#333",
	},
	detailValue: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#52b62c",
	},
	actionsContainer: {
		alignItems: "center",
		marginTop: 20,
	},
	actionButton: {
		width: "90%",
		marginBottom: 10,
	},
	actionButtonSecondary: {
		width: "90%",
	},
});
