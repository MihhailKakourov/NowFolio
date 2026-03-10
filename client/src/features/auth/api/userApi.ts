import axios from 'axios';
import { supabase } from '../../../supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/** Получить текущий access token из Supabase сессии */
const getAuthHeader = async (): Promise<Record<string, string>> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        return { Authorization: `Bearer ${session.access_token}` };
    }
    return {};
};

export const userApi = {
    syncUser: async (email: string, slug?: string, token?: string) => {
        const headers = token ? { Authorization: `Bearer ${token}` } : await getAuthHeader();
        const response = await axios.post(`${API_URL}/users/sync`, { email, slug }, { headers });
        return response.data;
    },

    getProStatus: async (email: string, token?: string): Promise<boolean> => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : await getAuthHeader();
            const response = await axios.get(`${API_URL}/users/${email}/pro-status`, { headers });
            return response.data.isPro;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('API Error (getProStatus):', message);
            return false;
        }
    },

    findEmailByUsername: async (username: string): Promise<string | null> => {
        try {
            const response = await axios.post(`${API_URL}/users/find-email`, { username });
            return response.data.email;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('API Error (findEmailByUsername):', message);
            throw new Error('Ошибка связи с сервером');
        }
    }
};
