'use client';

import { useMaterials } from '@/hooks/queries/useMaterials';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';

export function useStudentMaterials() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();

    const { data: materials = [], isLoading } = useMaterials();

    const filteredMaterials = materials.filter(m =>
        m.judul.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return {
        search, setSearch,
        materials,
        isLoading,
        filteredMaterials,
    };
}
