'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { materialsApi, videosApi } from '@/lib/api';
import { BookOpen, Video, Search, ArrowRight, Play, LayoutGrid, Clock, Sparkles, Heart, Droplets, Apple } from 'lucide-react';
import toast from 'react-hot-toast';

interface Material {
    _id: string;
    judul: string;
    kategori: string;
    konten_teks: string;
}

interface VideoItem {
    _id: string;
    judul: string;
    url_video: string;
    deskripsi: string;
    durasi: string;
}

const CATEGORIES = ['Semua', 'Diabetes', 'Hipertensi', 'Obesitas', 'Jantung'];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; iconBg: string }> = {
    'Diabetes': { bg: 'bg-blue-50 hover:bg-blue-100 border-blue-100', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    'Hipertensi': { bg: 'bg-rose-50 hover:bg-rose-100 border-rose-100', text: 'text-rose-600', iconBg: 'bg-rose-500' },
    'Obesitas': { bg: 'bg-amber-50 hover:bg-amber-100 border-amber-100', text: 'text-amber-600', iconBg: 'bg-amber-500' },
    'Jantung': { bg: 'bg-red-50 hover:bg-red-100 border-red-100', text: 'text-red-600', iconBg: 'bg-red-500' },
};

const CATEGORY_ICONS: Record<string, typeof Heart> = {
    'Diabetes': Droplets,
    'Hipertensi': Heart,
    'Obesitas': Apple,
    'Jantung': Heart,
};

export default function StudentMaterials() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Semua');
    const [activeTab, setActiveTab] = useState<'materials' | 'videos'>('materials');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [mats, vids] = await Promise.all([materialsApi.getAll(), videosApi.getAll()]);
            setMaterials(mats as Material[]);
            setVideos(vids as VideoItem[]);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const filteredMaterials = materials.filter(m =>
        (category === 'Semua' || m.kategori === category) &&
        m.judul.toLowerCase().includes(search.toLowerCase())
    );

    const filteredVideos = videos.filter(v => v.judul.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#1e4d7b] border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">Memuat konten pembelajaran...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            {/* Header */}
            <div className="text-center lg:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Pusat Pembelajaran
                    </span>
                    <h1 className="text-4xl font-black text-[#1e4d7b]">Materi PTM & Video Edukasi</h1>
                    <p className="text-slate-500 font-bold mt-3 max-w-xl">
                        Pelajari berbagai materi menarik dan tonton video edukasi untuk menjaga kesehatanmu!
                    </p>
                </motion.div>
            </div>

            {/* Stats Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
                <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#1e4d7b]">{materials.length}</p>
                        <p className="text-xs font-bold text-slate-500">Materi</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                        <Video size={20} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#1e4d7b]">{videos.length}</p>
                        <p className="text-xs font-bold text-slate-500">Video</p>
                    </div>
                </div>
            </motion.div>

            {/* Controls Section */}
            <div className="flex flex-col gap-6">
                {/* Tabs Selection */}
                <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto lg:mx-0 shadow-inner">
                    <button
                        onClick={() => setActiveTab('materials')}
                        className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'materials'
                                ? 'bg-[#1e4d7b] text-white shadow-lg'
                                : 'text-slate-400 hover:text-[#1e4d7b]'
                            }`}
                    >
                        <BookOpen size={16} /> Materi Bacaan
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'videos'
                                ? 'bg-purple-500 text-white shadow-lg'
                                : 'text-slate-400 hover:text-purple-500'
                            }`}
                    >
                        <Video size={16} /> Video Edukasi
                    </button>
                </div>

                {/* Search & Categories */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Cari ${activeTab === 'materials' ? 'judul materi' : 'judul video'}...`}
                            className="w-full h-14 bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1e4d7b] transition-colors shadow-sm"
                        />
                    </div>
                    {activeTab === 'materials' && (
                        <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${category === cat
                                            ? 'bg-[#1e4d7b] text-white shadow-lg'
                                            : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content List */}
            {activeTab === 'materials' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMaterials.map((material, index) => {
                        const colors = CATEGORY_COLORS[material.kategori] || { bg: 'bg-slate-50', text: 'text-slate-600', iconBg: 'bg-slate-500' };
                        const CategoryIcon = CATEGORY_ICONS[material.kategori] || BookOpen;

                        return (
                            <motion.div
                                key={material._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/student/materials/${material._id}`}
                                    className={`block p-8 rounded-3xl border-2 h-full group transition-all duration-300 hover:shadow-xl ${colors.bg}`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                            <CategoryIcon size={28} />
                                        </div>
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colors.text} bg-white shadow-sm`}>
                                            {material.kategori}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-[#1e4d7b] mb-3 group-hover:text-[#2a6094] transition-colors">
                                        {material.judul}
                                    </h3>
                                    <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed mb-6">
                                        {material.konten_teks}
                                    </p>

                                    <div className="flex items-center gap-2 text-[#1e4d7b] font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        <Sparkles size={14} />
                                        Mulai Belajar
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredVideos.map((video, index) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-3xl overflow-hidden group shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 relative">
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 shadow-2xl group-hover:scale-110 transition-transform">
                                        <Play fill="currentColor" size={24} />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold z-10 flex items-center gap-1">
                                    <Clock size={12} />
                                    {video.durasi}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black text-[#1e4d7b] mb-2">{video.judul}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">{video.deskripsi}</p>
                                <button className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                                    Tonton Sekarang
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {((activeTab === 'materials' && filteredMaterials.length === 0) || (activeTab === 'videos' && filteredVideos.length === 0)) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
                >
                    <LayoutGrid size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
                        {search ? 'Tidak ada konten yang cocok dengan pencarian' : 'Belum ada konten tersedia'}
                    </p>
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="mt-4 text-[#1e4d7b] font-bold text-sm underline"
                        >
                            Hapus pencarian
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
