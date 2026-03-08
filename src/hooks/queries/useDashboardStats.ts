'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import type { Statistics } from '@/types';

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: () => adminApi.getStatistics() as Promise<Statistics>,
    });
};
