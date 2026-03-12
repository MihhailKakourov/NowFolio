import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useSearchParams } from 'react-router-dom';
import { useProQuery } from './useProQuery';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useProStatus = (session: Session) => {
    const queryClient = useQueryClient();
    const { data: isPro = null, isLoading } = useProQuery(session?.user?.email);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!session?.user?.email) return;

        // После успешной оплаты — инвалидируем запрос и показываем тост
        if (searchParams.get('success') === 'true') {
            searchParams.delete('success');
            setSearchParams(searchParams, { replace: true });
            
            // Запускаем переполучение данных
            queryClient.invalidateQueries({ queryKey: ['pro-status', session.user.email] });
            toast.success('Оплата прошла успешно! Теперь у вас Pro аккаунт.');
        }
    }, [session, searchParams, setSearchParams, queryClient]);

    return { isPro, isLoading };
};
