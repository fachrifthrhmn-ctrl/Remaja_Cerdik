'use client';

import Modal from '@/components/shared/Modal';
import SearchInput from '@/components/shared/SearchInput';
import LoadingScreen from '@/components/shared/LoadingScreen';
import EmptyState from '@/components/shared/EmptyState';
import StatCard from '@/components/shared/StatCard';
import { Edit2, Trash2, Users, UserPlus, GraduationCap, Loader2, ChevronDown } from 'lucide-react';
import { useManageUsers } from '@/hooks/pages/useManageUsers';

export default function ManageUsers() {
    const {
        search, setSearch,
        showModal, setShowModal,
        editUser,
        formData, setFormData,
        users, isLoading,
        updateMutation,
        filteredUsers,
        handleSubmit, handleDelete, openEditModal,
    } = useManageUsers();

    const schoolsCount = new Set(users.map(u => u.kelas)).size;
    const newThisMonth = users.filter(u => {
        const created = new Date(u.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    if (isLoading) return <LoadingScreen message="Memuat pengguna..." color="border-blue-500" />;

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
                <StatCard icon={Users} label="Total Siswa" value={users.length} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
                <StatCard icon={GraduationCap} label="Kelas" value={schoolsCount} iconBgColor="bg-emerald-100" iconColor="text-emerald-600" delay={0.1} />
                <StatCard icon={UserPlus} label="Baru Bulan Ini" value={newThisMonth} iconBgColor="bg-purple-100" iconColor="text-purple-600" delay={0.2} />
            </div>

            {/* Search */}
            <SearchInput value={search} onChange={setSearch} placeholder="Cari nama, email, atau kelas..." />

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kelas</th>
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
                                    <td className="px-6 py-4 text-gray-600">{user.kelas}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
                                            {user.usia} tahun
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1">
                                            <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(user._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                    <EmptyState icon={Users} message="Tidak ada pengguna yang ditemukan" />
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Edit Pengguna">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="user-nama" className="block text-sm font-bold text-gray-700 mb-1.5">Nama</label>
                        <input id="user-nama" type="text" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" autoComplete="name" required />
                    </div>
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                        <input id="user-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" autoComplete="email" required />
                    </div>
                    <div>
                        <label htmlFor="user-kelas" className="block text-sm font-bold text-gray-700 mb-1.5">Kelas</label>
                        <div className="relative">
                            <select id="user-kelas" name="kelas" value={formData.kelas} onChange={(e) => setFormData({ ...formData, kelas: e.target.value })} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer" required>
                                <option value="" disabled>Pilih Kelas</option>
                                <option value="10">Kelas 10</option>
                                <option value="11">Kelas 11</option>
                                <option value="12">Kelas 12</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <ChevronDown size={18} />
                            </span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="user-usia" className="block text-sm font-bold text-gray-700 mb-1.5">Usia</label>
                        <input id="user-usia" type="number" value={formData.usia} onChange={(e) => setFormData({ ...formData, usia: e.target.value })} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" required />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">Batal</button>
                        <button type="submit" className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 size={20} className="animate-spin mx-auto" /> : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
