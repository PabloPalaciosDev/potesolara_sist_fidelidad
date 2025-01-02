import { apiClient, getToken } from "../utils/axios";

export const getCards = async (idTarjeta) => {
    try {
        const token = await getToken();
        const response = await apiClient.get(
            `/TarjetaFidelidad/GetByGuid?id=${idTarjeta}`,
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
