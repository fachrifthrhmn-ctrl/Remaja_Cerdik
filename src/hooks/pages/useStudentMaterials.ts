'use client';

import { useState } from 'react';
import { useMaterials } from '@/hooks/queries/useMaterials';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';

export const CATEGORIES = ['Semua', 'Diabetes', 'Hipertensi', 'Obesitas', 'Jantung'];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; iconBg: string }> = {
    'Diabetes': { bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    'Hipertensi': { bg: 'bg-rose-50 hover:bg-rose-100 border-rose-100', text: 'text-rose-600', iconBg: 'bg-rose-500' },
    'Obesitas': { bg: 'bg-amber-50 hover:bg-amber-100 border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-500' },
    'Jantung': { bg: 'bg-red-50 hover:bg-red-100 border-red-100', text: 'text-red-600', iconBg: 'bg-red-500' },
};

export function useStudentMaterials() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [category, setCategory] = useState('Semua');

    const { data: materials = [], isLoading } = useMaterials();

    const filteredMaterials = materials.filter(m =>
        (category === 'Semua' || m.kategori === category) &&
        m.judul.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return {
        search, setSearch,
        category, setCategory,
        materials,
        isLoading,
        filteredMaterials,
    };
}
