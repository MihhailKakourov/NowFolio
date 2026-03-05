import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const paymentApi = {
    createCheckoutSession: async (email: string, userId: string): Promise<{ url: string }> => {
        const response = await axios.post<{ url: string }>(`${API_URL}/create-checkout-session`, {
            email,
            userId,
        });
        return response.data;
    }
};
