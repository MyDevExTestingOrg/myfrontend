import axios from 'axios'

const API_URL = `${backendUrl}/api/v1/webhooks`

export const fetchCTOMetrics = async(userId)=>{
    try {
        const response = await axios.get(`${API_URL}/metrics/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Metrics लाने में त्रुटि:", error);
        throw error;
    }
}
export const fetchTrendMetrics = async (userId )=>{
   try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        const response = await axios.get(`${backendUrl}/api/v1/webhooks/trends/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Trend fetch error:", error);
        return [];
    }
}