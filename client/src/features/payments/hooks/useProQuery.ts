import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../auth/api/userApi';

export const useProQuery = (email: string | undefined) => {
    return useQuery({
        queryKey: ['pro-status', email],
        queryFn: () => userApi.getProStatus(email!),
        enabled: !!email,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
