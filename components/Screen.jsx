import { View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

export function Screen({ children }) {
	return (
		<PaperProvider>
			<View style={{ flex: 1, width: "100%", height: "100%" }}>{children}</View>
		</PaperProvider>
	);
}
