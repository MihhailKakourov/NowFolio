import { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useSearchParams } from 'react-router-dom';
import { userApi } from '../../auth/api/userApi';
import toast from 'react-hot-toast';

export const useProStatus = (session: Session) => {
    const [isPro, setIsPro] = useState<boolean | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const pollProStatus = useCallback(async (email: string, attempts = 10) => {
        for (let i = 0; i < attempts; i++) {
            const status = await userApi.getProStatus(email);
            if (status) {
                setIsPro(true);
                toast.success('Оплата прошла успешно! Теперь у вас Pro аккаунт.');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        toast('Оплата обрабатывается. Pro статус появится в течение минуты.', { icon: '⏳' });
    }, []);

    useEffect(() => {
        let cancelled = false;

        const checkStatus = async () => {
            if (!session?.user?.email) return;

            // После успешной оплаты — поллим статус
            if (searchParams.get('success') === 'true') {
                searchParams.delete('success');
                setSearchParams(searchParams, { replace: true });
                await pollProStatus(session.user.email);
                return;
            }

            const currentStatus = await userApi.getProStatus(session.user.email);
            if (!cancelled) setIsPro(currentStatus);
        };

        checkStatus();
        return () => { cancelled = true; };
    }, [session, searchParams, setSearchParams, pollProStatus]);

    return { isPro, setIsPro };
};
