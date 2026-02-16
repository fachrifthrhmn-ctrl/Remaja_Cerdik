'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { videosApi } from '@/lib/api';
import Modal from '@/components/shared/Modal';
import { Plus, Edit2, Trash2, Search, Video, Play, Clock, Film } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoItem {
    _id: string;
    judul: string;
    url_video: string;
    deskripsi: string;
    durasi: string;
    tanggal_upload: string;
}

export default function ManageVideos() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editVideo, setEditVideo] = useState<VideoItem | null>(null);
    const [formData, setFormData] = useState({ judul: '', url_video: '', deskripsi: '', durasi: '' });

    useEffect(() => { loadVideos(); }, []);

    const loadVideos = async () => {
        try {
            const data = await videosApi.getAll() as VideoItem[];
            setVideos(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat video');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editVideo) {
                await videosApi.update(editVideo._id, formData);
                toast.success('Video berhasil diperbarui');
            } else {
                await videosApi.create(formData);
                toast.success('Video berhasil ditambahkan');
            }
            setShowModal(false);
            resetForm();
            loadVideos();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan video');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;
        try {
            await videosApi.delete(id);
            toast.success('Video berhasil dihapus');
            loadVideos();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus video');
        }
    };

    const openEditModal = (video: VideoItem) => {
        setEditVideo(video);
        setFormData({ judul: video.judul, url_video: video.url_video, deskripsi: video.deskripsi, durasi: video.durasi });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditVideo(null);
        setFormData({ judul: '', url_video: '', deskripsi: '', durasi: '' });
    };

    const filteredVideos = videos.filter(v => v.judul.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat video...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Video</h1>
                    <p className="text-gray-500 mt-1">Tambah dan edit video pembelajaran</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Tambah Video
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
                        placeholder="Cari video..."
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl font-medium">
                    <Film size={18} />
                    <span>{videos.length} video</span>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                    <motion.div
                        key={video._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                        {/* Card Header */}
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500" />

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Video size={24} className="text-white" />
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(video)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{video.judul}</h3>
                            <div className="flex items-center gap-2 text-sm text-purple-600 font-medium mb-3">
                                <Clock size={14} />
                                <span>{video.durasi}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{video.deskripsi}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredVideos.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Video size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                        {search ? 'Tidak ada video yang ditemukan' : 'Belum ada video. Klik tombol "Tambah Video" untuk memulai.'}
                    </p>
                </div>
            )}

            {/* Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editVideo ? 'Edit Video' : 'Tambah Video'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="vid-judul" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Judul</label>
                        <input
                            id="vid-judul"
                            type="text"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="vid-url" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">URL Video (YouTube embed)</label>
                        <input
                            id="vid-url"
                            type="text"
                            value={formData.url_video}
                            onChange={(e) => setFormData({ ...formData, url_video: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            placeholder="https://www.youtube.com/embed/..."
                            autoComplete="url"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="vid-durasi" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Durasi</label>
                        <input
                            id="vid-durasi"
                            type="text"
                            value={formData.durasi}
                            onChange={(e) => setFormData({ ...formData, durasi: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            placeholder="10:30"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="vid-deskripsi" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi</label>
                        <textarea
                            id="vid-deskripsi"
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            className="w-full min-h-[100px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all resize-none"
                            required
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
                            {editVideo ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
