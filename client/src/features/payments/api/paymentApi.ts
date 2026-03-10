import axios from 'axios';
import { supabase } from '../../../supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
    }
    return {};
};

export const paymentApi = {
    createCheckoutSession: async (email: string, userId: string): Promise<{ url: string }> => {
        const headers = await getAuthHeader();
        const response = await axios.post<{ url: string }>(`${API_URL}/create-checkout-session`, {
            email,
            userId,
        }, { headers });
        return response.data;
    }
};
