import React, { useContext, useState, useEffect } from "react";
import { AuthProvider, AuthContext } from "../utils/AuthProvider";
import { Stack, Slot, useRouter } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";

export default function Layout() {
	return (
		<AuthProvider>
			<AuthConsumerLayout />
		</AuthProvider>
	);
}

function AuthConsumerLayout() {
	const { user, loading } = useContext(AuthContext);
	const [isReady, setIsReady] = useState(false);
	const router = useRouter();

	useEffect(() => {
		// Marca el layout como listo una vez montado
		setIsReady(true);
	}, []);

	useEffect(() => {
		if (isReady && !loading && !user) {
			// Redirige al login solo después de que todo esté listo
			router.replace("/login");
		}
	}, [isReady, loading, user, router]);

	// Mientras se carga el estado de autenticación o el layout no está listo
	if (loading || !isReady) {
		return null; // Puedes mostrar un spinner o una pantalla de carga
	}

	// Si el usuario está autenticado, renderiza las rutas hijas
	return (
		<PaperProvider>
			<Stack
				screenOptions={{
					headerShown: false, // Oculta encabezados globales
				}}
			>
				<Slot />
			</Stack>
		</PaperProvider>
	);
}
