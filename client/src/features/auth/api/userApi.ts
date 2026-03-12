import { api } from '../../../services/api';
import type { User } from '../../../types/user';

export const userApi = {
    syncUser: async (email: string, slug?: string): Promise<User> => {
        const response = await api.post('/users/sync', { email, slug });
        return response.data;
    },

    getProStatus: async (email: string): Promise<boolean> => {
        try {
            const response = await api.get<{ isPro: boolean }>(`/users/${email}/pro-status`);
            return response.data.isPro;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('API Error (getProStatus):', message);
            return false;
        }
    },

    findEmailByUsername: async (username: string): Promise<string | null> => {
        try {
            const response = await api.post('/users/find-email', { username });
            return response.data.email;
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { status?: number } }).response?.status === 404
            ) {
                return null;
            }
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.error('API Error (findEmailByUsername):', message);
            throw new Error('Ошибка связи с сервером');
        }
    }
};
