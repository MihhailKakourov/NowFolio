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
        } catch (error) {
            console.error('Failed to get pro status', error);
            return false;
        }
    },

    upgradeToPro: async (email: string): Promise<boolean> => {
        try {
            const response = await axios.post(`${API_URL}/users/upgrade-pro`, { email });
            return response.data.isPro;
        } catch (error) {
            console.error('Failed to upgrade to pro', error);
            return false;
        }
    }
};
