import { View } from "react-native";

export function Screen({ children }) {
    return (
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            {children}
        </View>
    );
}
