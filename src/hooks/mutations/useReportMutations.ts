'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportingApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const useResetUserQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => reportingApi.resetUserQuiz(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal mereset kuis'),
    });
};
