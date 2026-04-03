'use client';

import { motion } from 'framer-motion';
import Modal from '@/components/shared/Modal';
import SearchInput from '@/components/shared/SearchInput';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { Plus, Edit2, Trash2, BookOpen, FileText, Loader2 } from 'lucide-react';
import { useManageMaterials } from '@/hooks/pages/useManageMaterials';

export default function ManageMaterials() {
    const {
        search, setSearch,
        showModal, setShowModal,
        editMaterial,
        formData, setFormData,
        materials, isLoading,
        createMutation, updateMutation,
        filteredMaterials,
        handleSubmit, handleDelete, openEditModal, openAddModal,
    } = useManageMaterials();

    if (isLoading) return <LoadingScreen message="Memuat materi..." color="border-emerald-500" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Materi</h1>
                    <p className="text-gray-500 mt-1">Tambah dan edit materi pembelajaran kesehatan</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Tambah Materi
                </button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Cari materi..." className="flex-1" />
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
                    <FileText size={18} />
                    <span>{materials.length} materi</span>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material, index) => {
                    const gradient = 'from-blue-500 to-cyan-500';
                    return (
                        <motion.div
                            key={material._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <BookOpen size={24} className="text-white" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(material)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(material._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{material.judul}</h3>
                                <p className="text-sm text-gray-500 mt-3 line-clamp-2">{material.konten_teks}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredMaterials.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                        {search ? 'Tidak ada materi yang ditemukan' : 'Belum ada materi. Klik tombol "Tambah Materi" untuk memulai.'}
                    </p>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editMaterial ? 'Edit Materi' : 'Tambah Materi'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="mat-judul" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Judul</label>
                        <input id="mat-judul" type="text" value={formData.judul} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all" autoComplete="off" required />
                    </div>
                    <div>
                        <label htmlFor="mat-konten" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Konten</label>
                        <textarea id="mat-konten" value={formData.konten_teks} onChange={(e) => setFormData({ ...formData, konten_teks: e.target.value })} className="w-full min-h-[150px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all resize-none" required />
                    </div>
                    <div>
                        <label htmlFor="mat-gambar" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL Gambar (opsional)</label>
                        <input id="mat-gambar" type="text" value={formData.url_gambar} onChange={(e) => setFormData({ ...formData, url_gambar: e.target.value })} className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all" autoComplete="url" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-colors">Batal</button>
                        <button type="submit" className="flex-1 h-12 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#bbe9fa]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled={createMutation.isPending || updateMutation.isPending}>
                            {(createMutation.isPending || updateMutation.isPending) ? <Loader2 size={20} className="animate-spin mx-auto" /> : (editMaterial ? 'Simpan' : 'Tambah')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
