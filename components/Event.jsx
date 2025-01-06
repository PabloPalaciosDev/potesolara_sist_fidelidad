import { Text } from "react-native";
import { Screen } from "./Screen";
import { Stack } from "expo-router";

export default function EventScreen() {
    return (
        <Screen>
            <Stack.Screen
                options={{
                    title: "Puntos Solara",
                    headerStyle: {
                        backgroundColor: "#52b62c",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                }}
            />
            <Text>Event Screen</Text>
        </Screen>
    );
}
