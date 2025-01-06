import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";

export const HomeIcon = (props) => (
    <MaterialIcons name="home" size={30} color="white" {...props} />
);

export const CardMembershipIcon = (props) => (
    <MaterialIcons name="card-membership" size={30} color="white" {...props} />
);

export const ProfileIcon = (props) => (
    <MaterialIcons name="person" size={30} color="white" {...props} />
);

export const EventIcon = (props) => (
    <MaterialIcons name="event" size={24} color="white" {...props} />
);

export const LogoutIcon = (props) => (
    <Feather name="log-out" size={24} color="black" {...props} />
);
