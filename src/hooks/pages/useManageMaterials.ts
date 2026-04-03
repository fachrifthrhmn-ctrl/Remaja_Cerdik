'use client';

import { useState } from 'react';
import { useMaterials } from '@/hooks/queries/useMaterials';
import { useCreateMaterial, useUpdateMaterial, useDeleteMaterial } from '@/hooks/mutations/useMaterialMutations';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';
import type { Material } from '@/types';

export function useManageMaterials() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [showModal, setShowModal] = useState(false);
    const [editMaterial, setEditMaterial] = useState<Material | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
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
            konten_teks: material.konten_teks,
            url_gambar: material.url_gambar || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMaterial(null);
        setFormData({ judul: '', konten_teks: '', url_gambar: '' });
    };

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const filteredMaterials = materials.filter(m =>
        m.judul.toLowerCase().includes(debouncedSearch.toLowerCase())
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
