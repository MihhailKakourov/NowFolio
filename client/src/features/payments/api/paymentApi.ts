import { api } from '../../../services/api';

export const paymentApi = {
    createCheckoutSession: async (email: string, userId: string): Promise<{ url: string }> => {
        const response = await api.post<{ url: string }>('/create-checkout-session', {
            email,
            userId,
        });
        return response.data;
    }
};
