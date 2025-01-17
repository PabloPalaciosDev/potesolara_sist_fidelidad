import { apiClient, getToken } from "../utils/axios";
import { BASE_URL, GET_ALL_EVENTOS_ENDPOINT, GET_EVENTO_BY_ID_ENDPOINT, ADD_ASISTENCIA_ENDPOINT } from "@env";

export const getEventos = async () => {
    try {
        const token = await getToken();
        const response = await apiClient.get(`${BASE_URL}${GET_ALL_EVENTOS_ENDPOINT}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en getEventos:", error);
        throw error;
    }
};

export const getEventoByGuid = async (guid) => {
    try {
        const token = await getToken();
        const response = await apiClient.get(`${BASE_URL}${GET_EVENTO_BY_ID_ENDPOINT}?id=${guid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en getEventoByGuid:", error);
        throw error;
    }
};

export const crearAsistncia = async (eventoId, clienteId) => {
    try {
        const token = await getToken();
        const response = await apiClient.post(`${BASE_URL}${ADD_ASISTENCIA_ENDPOINT}?idEvento=${eventoId}&idCliente=${clienteId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error en crearAsistncia:", error);
        throw error;
    }
};