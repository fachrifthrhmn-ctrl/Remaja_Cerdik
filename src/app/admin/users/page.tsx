'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import Modal from '@/components/shared/Modal';
import { Search, Edit2, Trash2, Users, UserPlus, Calendar, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface User {
    _id: string;
    nama: string;
    email: string;
    sekolah: string;
    usia: number;
    createdAt: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ nama: '', email: '', sekolah: '', usia: '' });

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const data = await adminApi.getUsers() as User[];
            setUsers(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat pengguna');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        try {
            await adminApi.updateUser(editUser._id, { ...formData, usia: parseInt(formData.usia) });
            toast.success('Pengguna berhasil diperbarui');
            setShowModal(false);
            loadUsers();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memperbarui pengguna');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus pengguna ini beserta semua data hasil kuisnya?')) return;
        try {
            await adminApi.deleteUser(id);
            toast.success('Pengguna berhasil dihapus');
            loadUsers();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus pengguna');
        }
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setFormData({ nama: user.nama, email: user.email, sekolah: user.sekolah, usia: String(user.usia) });
        setShowModal(true);
    };

    const filteredUsers = users.filter(u =>
        u.nama.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.sekolah.toLowerCase().includes(search.toLowerCase())
    );

    // Unique schools count
    const schoolsCount = new Set(users.map(u => u.sekolah)).size;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat pengguna...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
                    <p className="text-gray-500 mt-1">Lihat dan kelola data siswa terdaftar</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                            <p className="text-sm text-gray-500">Total Siswa</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <GraduationCap size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{schoolsCount}</p>
                            <p className="text-sm text-gray-500">Sekolah</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <UserPlus size={24} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">
                                {users.filter(u => {
                                    const created = new Date(u.createdAt);
                                    const now = new Date();
                                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                            <p className="text-sm text-gray-500">Baru Bulan Ini</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, email, atau sekolah..."
                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sekolah</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usia</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Terdaftar</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                                {user.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{user.nama}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.sekolah}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                                            {user.usia} tahun
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-16">
                        <Users size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Tidak ada pengguna yang ditemukan</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Pengguna">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="user-nama" className="block text-sm font-bold text-gray-700 mb-1.5">Nama</label>
                        <input
                            id="user-nama"
                            type="text"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                        <input
                            id="user-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user-sekolah" className="block text-sm font-bold text-gray-700 mb-1.5">Sekolah</label>
                        <input
                            id="user-sekolah"
                            type="text"
                            value={formData.sekolah}
                            onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            autoComplete="organization"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user-usia" className="block text-sm font-bold text-gray-700 mb-1.5">Usia</label>
                        <input
                            id="user-usia"
                            type="number"
                            value={formData.usia}
                            onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
