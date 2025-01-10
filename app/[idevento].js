import React from "react";
import { useLocalSearchParams } from "expo-router";
import EventScreen from "../components/Event";

export default function EventPage() {
    const { idevento } = useLocalSearchParams();

    return <EventScreen idevento={idevento} />;
}
