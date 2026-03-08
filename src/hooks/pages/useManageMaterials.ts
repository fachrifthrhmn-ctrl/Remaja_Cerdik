'use client';

import { useState } from 'react';
import { useMaterials } from '@/hooks/queries/useMaterials';
import { useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from '@/hooks/mutations/useMaterialMutations';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';
import type { Material } from '@/types';

export const CATEGORIES = ['Diabetes', 'Hipertensi', 'Obesitas', 'Jantung'];

export const CATEGORY_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    'Diabetes': { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-500' },
    'Hipertensi': { bg: 'bg-rose-100', text: 'text-rose-700', gradient: 'from-rose-500 to-pink-500' },
    'Obesitas': { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-500' },
    'Jantung': { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-500 to-rose-500' },
};

export function useManageMaterials() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [showModal, setShowModal] = useState(false);
    const [editMaterial, setEditMaterial] = useState<Material | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
        kategori: CATEGORIES[0],
        konten_teks: '',
        url_gambar: '',
    });

    const { data: materials = [], isLoading } = useMaterials();
    const createMutation = useCreateMaterial();
    const updateMutation = useUpdateMaterial();
    const deleteMutation = useDeleteMaterial();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editMaterial) {
            updateMutation.mutate(
                { id: editMaterial._id, payload: formData },
                { onSuccess: () => { setShowModal(false); resetForm(); } }
            );
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => { setShowModal(false); resetForm(); }
            });
        }
    };

    const handleDelete = (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
        deleteMutation.mutate(id);
    };

    const openEditModal = (material: Material) => {
        setEditMaterial(material);
        setFormData({
            judul: material.judul,
            kategori: material.kategori,
            konten_teks: material.konten_teks,
            url_gambar: material.url_gambar || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMaterial(null);
        setFormData({ judul: '', kategori: CATEGORIES[0], konten_teks: '', url_gambar: '' });
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const filteredMaterials = materials.filter(m =>
        m.judul.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.kategori.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return {
        search, setSearch,
        showModal, setShowModal,
        editMaterial,
        formData, setFormData,
        materials, isLoading,
        createMutation, updateMutation,
        filteredMaterials,
        handleSubmit, handleDelete, openEditModal, openAddModal,
    };
}
