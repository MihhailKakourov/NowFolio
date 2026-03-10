import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const userApi = {
    syncUser: async (email: string, slug?: string) => {
        const response = await axios.post(`${API_URL}/users/sync`, { email, slug });
        return response.data;
    },

    getProStatus: async (email: string): Promise<boolean> => {
        try {
            const response = await axios.get(`${API_URL}/users/${email}/pro-status`);
            return response.data.isPro;
        } catch (error: any) {
            console.error('API Error (getProStatus):', error.response?.data || error.message);
            return false;
        }
    },

    upgradeToPro: async (email: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/users/upgrade-pro`, { email });
            return response.data.isPro;
        } catch (error: any) {
            console.error('API Error (upgradeToPro):', error.message);
            return false;
        }
    },

    findEmailByUsername: async (username: string): Promise<string | null> => {
        try {
            const response = await axios.post(`${API_URL}/users/find-email`, { username });
            return response.data.email;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('API Error (findEmailByUsername):', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || 'Ошибка связи с сервером');
        }
    }
};
