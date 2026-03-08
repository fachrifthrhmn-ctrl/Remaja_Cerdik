'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            adminApi.updateUser(id, payload),
        onSuccess: () => {
            toast.success('Pengguna berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal memperbarui pengguna'),
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => adminApi.deleteUser(id),
        onSuccess: () => {
            toast.success('Pengguna berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus pengguna'),
    });
};
