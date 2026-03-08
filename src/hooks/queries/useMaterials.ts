'use client';

import { useQuery } from '@tanstack/react-query';
import { materialsApi } from '@/lib/api';
import type { Material } from '@/types';

export const useMaterials = () => {
    return useQuery({
        queryKey: ['materials'],
        queryFn: () => materialsApi.getAll() as Promise<Material[]>,
    });
};

export const useMaterialById = (id: string) => {
    return useQuery({
        queryKey: ['material', id],
        queryFn: () => materialsApi.getById(id) as Promise<Material>,
        enabled: !!id,
    });
};
