'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ArrowRight, LayoutGrid, Sparkles, Heart, Droplets, Apple } from 'lucide-react';
import SearchInput from '@/components/shared/SearchInput';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { useStudentMaterials, CATEGORIES, CATEGORY_COLORS } from '@/hooks/pages/useStudentMaterials';

const CATEGORY_ICONS: Record<string, typeof Heart> = {
    'Diabetes': Droplets,
    'Hipertensi': Heart,
    'Obesitas': Apple,
    'Jantung': Heart,
};

export default function StudentMaterials() {
    const {
        search, setSearch,
        category, setCategory,
        materials,
        isLoading,
        filteredMaterials,
    } = useStudentMaterials();

    if (isLoading) return <LoadingScreen message="Memuat konten pembelajaran..." />;

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
                    <h1 className="text-4xl font-black text-[#1e4d7b]">Materi Edukasi PTM</h1>
                    <p className="text-slate-500 font-bold mt-3 max-w-xl">
                        Pelajari berbagai materi menarik untuk menjaga kesehatanmu!
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
            </motion.div>

            {/* Controls Section */}
            <div className="flex flex-col gap-6">
                {/* Search & Categories */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Cari judul materi..."
                        className="flex-1"
                    />
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
                </div>
            </div>

            {/* Content List */}
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

            {/* Empty State */}
            {filteredMaterials.length === 0 && (
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
