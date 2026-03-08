'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const useCreateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => materialsApi.create(data),
        onSuccess: () => {
            toast.success('Materi berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan materi'),
    });
};

export const useUpdateMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            materialsApi.update(id, payload),
        onSuccess: () => {
            toast.success('Materi berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan materi'),
    });
};

export const useDeleteMaterial = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => materialsApi.delete(id),
        onSuccess: () => {
            toast.success('Materi berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus materi'),
    });
};
