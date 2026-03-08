'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import type { AdminUser } from '@/types';

export const useUsers = () => {
    return useQuery({
        queryKey: ['admin-users'],
        queryFn: () => adminApi.getUsers() as Promise<AdminUser[]>,
    });
};
