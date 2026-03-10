import { supabase } from '../../../supabase';

export const authApi = {
    loginWithEmail: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    loginWithGoogle: async () => {
        const redirectUrl = import.meta.env.VITE_CLIENT_URL || window.location.origin;
        return await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${redirectUrl}/` },
        });
    },

    register: async (email: string, password: string, username: string) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    full_name: username,
                },
            },
        });
    },

    logout: async () => {
        return await supabase.auth.signOut();
    }
};
