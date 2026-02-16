'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { materialsApi } from '@/lib/api';
import Modal from '@/components/shared/Modal';
import { Plus, Edit2, Trash2, Search, BookOpen, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface Material {
    _id: string;
    judul: string;
    kategori: string;
    konten_teks: string;
    url_gambar: string;
    tanggal_upload: string;
}

const CATEGORIES = ['Diabetes', 'Hipertensi', 'Obesitas', 'Jantung'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    'Diabetes': { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-500' },
    'Hipertensi': { bg: 'bg-rose-100', text: 'text-rose-700', gradient: 'from-rose-500 to-pink-500' },
    'Obesitas': { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-500' },
    'Jantung': { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-500 to-rose-500' },
};

export default function ManageMaterials() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMaterial, setEditMaterial] = useState<Material | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
        kategori: CATEGORIES[0],
        konten_teks: '',
        url_gambar: '',
    });

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const data = await materialsApi.getAll() as Material[];
            setMaterials(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat materi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editMaterial) {
                await materialsApi.update(editMaterial._id, formData);
                toast.success('Materi berhasil diperbarui');
            } else {
                await materialsApi.create(formData);
                toast.success('Materi berhasil ditambahkan');
            }
            setShowModal(false);
            resetForm();
            loadMaterials();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan materi');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus materi ini?')) return;
        try {
            await materialsApi.delete(id);
            toast.success('Materi berhasil dihapus');
            loadMaterials();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus materi');
        }
    };

    const openEditModal = (material: Material) => {
        setEditMaterial(material);
        setFormData({
            judul: material.judul,
            kategori: material.kategori,
            konten_teks: material.konten_teks,
            url_gambar: material.url_gambar,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditMaterial(null);
        setFormData({ judul: '', kategori: CATEGORIES[0], konten_teks: '', url_gambar: '' });
    };

    const filteredMaterials = materials.filter(m =>
        m.judul.toLowerCase().includes(search.toLowerCase()) ||
        m.kategori.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat materi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Materi</h1>
                    <p className="text-gray-500 mt-1">Tambah dan edit materi pembelajaran kesehatan</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Tambah Materi
                </button>
            </div>

            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari materi..."
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium">
                    <FileText size={18} />
                    <span>{materials.length} materi</span>
                </div>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((material, index) => {
                    const colors = CATEGORY_COLORS[material.kategori] || CATEGORY_COLORS['Diabetes'];
                    return (
                        <motion.div
                            key={material._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            {/* Card Header */}
                            <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <BookOpen size={24} className="text-white" />
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(material)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(material._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{material.judul}</h3>
                                <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-bold`}>
                                    {material.kategori}
                                </span>
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
                        <input
                            id="mat-judul"
                            type="text"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mat-kategori" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Kategori</label>
                        <select
                            id="mat-kategori"
                            value={formData.kategori}
                            onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="mat-konten" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Konten</label>
                        <textarea
                            id="mat-konten"
                            value={formData.konten_teks}
                            onChange={(e) => setFormData({ ...formData, konten_teks: e.target.value })}
                            className="w-full min-h-[150px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="mat-gambar" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL Gambar (opsional)</label>
                        <input
                            id="mat-gambar"
                            type="text"
                            value={formData.url_gambar}
                            onChange={(e) => setFormData({ ...formData, url_gambar: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            autoComplete="url"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#bbe9fa]/50 transition-all"
                        >
                            {editMaterial ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
