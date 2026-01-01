import axios from 'axios'

const API_URL = "http://localhost:3000/api/v1/webhooks"

export const fetchCTOMetrics = async(userId)=>{
    try {
        const response = await axios.get(`${API_URL}/metrics/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Metrics लाने में त्रुटि:", error);
        throw error;
    }
}