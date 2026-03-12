import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { paymentApi } from '../api/paymentApi';
import toast from 'react-hot-toast';

interface UseCheckoutOptions {
    onAlreadyPro: () => void;
}

export const useCheckout = (session: Session, options: UseCheckoutOptions) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const response = await paymentApi.createCheckoutSession(
                session.user.email || '',
                session.user.id
            );
            if (response.url) {
                window.location.href = response.url;
            }
        } catch (error: unknown) {
            const axiosError = error as { response?: { status?: number } };
            if (axiosError.response?.status === 409) {
                options.onAlreadyPro();
                toast.success('У вас уже есть Pro подписка!');
            } else {
                console.error('Payment error:', error);
                toast.error('Не удалось создать платеж');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSubscribe, isLoading };
};
