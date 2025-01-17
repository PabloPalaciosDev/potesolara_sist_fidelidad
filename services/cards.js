import { apiClient, getToken } from "../utils/axios";
import { BASE_URL, GET_CARD_BY_GUID_ENDPOINT } from "@env";

export const getCards = async (idTarjeta) => {
    try {
        const token = await getToken();
        const response = await apiClient.get(`${BASE_URL}${GET_CARD_BY_GUID_ENDPOINT}?id=${idTarjeta}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en getCards:", error);
        throw error;
    }
};