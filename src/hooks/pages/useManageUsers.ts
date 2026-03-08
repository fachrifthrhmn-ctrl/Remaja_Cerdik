'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/queries/useUsers';
import { useUpdateUser, useDeleteUser } from '@/hooks/mutations/useUserMutations';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';
import type { AdminUser } from '@/types';

export function useManageUsers() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({ nama: '', email: '', sekolah: '', usia: '' });

    const { data: users = [], isLoading } = useUsers();
    const updateMutation = useUpdateUser();
    const deleteMutation = useDeleteUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        updateMutation.mutate(
            { id: editUser._id, payload: { ...formData, usia: parseInt(formData.usia) } },
            { onSuccess: () => setShowModal(false) }
        );
    };

    const handleDelete = (id: string) => {
        if (!confirm('Hapus pengguna ini beserta semua data hasil kuisnya?')) return;
        deleteMutation.mutate(id);
    };

    const openEditModal = (user: AdminUser) => {
        setEditUser(user);
        setFormData({ nama: user.nama, email: user.email, sekolah: user.sekolah, usia: String(user.usia) });
        setShowModal(true);
    };

    const filteredUsers = users.filter(u =>
        u.nama.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.sekolah.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const adminCount = users.length;
    const userCount = filteredUsers.length;

    return {
        // State
        search, setSearch,
        showModal, setShowModal,
        editUser,
        formData, setFormData,
        // Data
        users, isLoading,
        updateMutation,
        // Computed
        filteredUsers, adminCount, userCount,
        // Handlers
        handleSubmit, handleDelete, openEditModal,
    };
}
