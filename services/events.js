import { apiClient, getToken } from "../utils/axios";

export const getEventos = async () => {
    try {
        const token = await getToken();
        const response = await apiClient.get(`/Eventos/GetAllEventos`, {
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
