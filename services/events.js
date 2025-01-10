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

export const getEventoByGuid = async (guid) => {
    try {
        const token = await getToken();
        const response = await apiClient.get(
            `/Eventos/GetEventoById?id=${guid}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en getCards:", error);
        throw error;
    }
};

export const crearAsistncia = async (eventoId, clienteId) => {
    try {
        const token = await getToken();
        const response = await apiClient.post(
            `/Eventos/AddAsistencia?idEvento=${eventoId}&idCliente=${clienteId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en getCards:", error);
        throw error;
    }
};
