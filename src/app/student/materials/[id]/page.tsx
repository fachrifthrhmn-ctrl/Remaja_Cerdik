'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { materialsApi, videosApi } from '@/lib/api';
import { ArrowLeft, BookOpen, Calendar, Play, Clock, Heart, Droplets, Apple, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Material {
    _id: string;
    judul: string;
    kategori: string;
    konten_teks: string;
    url_gambar: string;
    tanggal_upload: string;
}

interface VideoItem {
    _id: string;
    judul: string;
    url_video: string;
    deskripsi: string;
    durasi: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; iconBg: string }> = {
    'Diabetes': { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'from-blue-500 to-cyan-500' },
    'Hipertensi': { bg: 'bg-rose-50', text: 'text-rose-600', iconBg: 'from-rose-500 to-pink-500' },
    'Obesitas': { bg: 'bg-amber-50', text: 'text-amber-600', iconBg: 'from-amber-500 to-orange-500' },
    'Jantung': { bg: 'bg-red-50', text: 'text-red-600', iconBg: 'from-red-500 to-rose-500' },
};

const CATEGORY_ICONS: Record<string, typeof Heart> = {
    'Diabetes': Droplets,
    'Hipertensi': Heart,
    'Obesitas': Apple,
    'Jantung': Heart,
};

export default function MaterialDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [material, setMaterial] = useState<Material | null>(null);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
    const router = useRouter();

    // Helper function to convert YouTube URL to embed format
    const getYouTubeEmbedUrl = (url: string): string => {
        if (!url) return '';

        // Already an embed URL
        if (url.includes('youtube.com/embed/')) {
            return url;
        }

        // Extract video ID from various YouTube URL formats
        let videoId = '';

        // Format: https://www.youtube.com/watch?v=VIDEO_ID or https://m.youtube.com/watch?v=VIDEO_ID
        const watchMatch = url.match(/[?&]v=([^&]+)/);
        if (watchMatch) {
            videoId = watchMatch[1];
        }

        // Format: https://youtu.be/VIDEO_ID
        const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
        if (shortMatch) {
            videoId = shortMatch[1];
        }

        // Format: youtube.com/v/VIDEO_ID
        const vMatch = url.match(/youtube\.com\/v\/([^?&]+)/);
        if (vMatch) {
            videoId = vMatch[1];
        }

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }

        // If no match, return original URL (might be another video platform)
        return url;
    };

    useEffect(() => { loadData(); }, [resolvedParams.id]);

    const loadData = async () => {
        try {
            const [materialData, videosData] = await Promise.all([
                materialsApi.getById(resolvedParams.id),
                videosApi.getAll()
            ]);
            setMaterial(materialData as Material);
            const allVideos = videosData as VideoItem[];
            setVideos(allVideos.slice(0, 3)); // Show up to 3 videos
            if (allVideos.length > 0) {
                setActiveVideo(allVideos[0]);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat materi');
            router.push('/student/materials');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">Memuat materi...</p>
                </div>
            </div>
        );
    }

    if (!material) return null;

    const colors = CATEGORY_COLORS[material.kategori] || { bg: 'bg-slate-50', text: 'text-slate-600', iconBg: 'from-slate-500 to-gray-500' };
    const CategoryIcon = CATEGORY_ICONS[material.kategori] || BookOpen;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-[#1e4d7b] transition-colors font-bold"
            >
                <ArrowLeft size={20} /> Kembali ke Materi
            </motion.button>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Material Content - 2 columns */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 space-y-8"
                >
                    {/* Header Card */}
                    <div className={`${colors.bg} rounded-3xl p-8 border border-white`}>
                        <div className="flex items-start gap-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${colors.iconBg} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0`}>
                                <CategoryIcon size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-black uppercase tracking-widest mb-2 border border-current/10`}>
                                    {material.kategori}
                                </span>
                                <h1 className="text-3xl font-black text-[#1e4d7b] mb-2">{material.judul}</h1>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <Calendar size={14} />
                                    <span>Diperbarui {new Date(material.tanggal_upload).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image if exists */}
                    {material.url_gambar && (
                        <div className="rounded-3xl overflow-hidden shadow-lg">
                            <img
                                src={material.url_gambar}
                                alt={material.judul}
                                className="w-full object-cover max-h-[400px]"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
                        <h2 className="text-xl font-black text-[#1e4d7b] mb-6 flex items-center gap-3">
                            <BookOpen size={24} className={colors.text} />
                            Isi Materi
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">
                                {material.konten_teks}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar - Videos */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* Active Video Player */}
                    {activeVideo && (
                        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 sticky top-24">
                            <div className="aspect-video bg-slate-900">
                                <iframe
                                    src={getYouTubeEmbedUrl(activeVideo.url_video)}
                                    title={activeVideo.judul}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-black text-[#1e4d7b] mb-2">{activeVideo.judul}</h3>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2">{activeVideo.deskripsi}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-3">
                                    <Clock size={12} />
                                    <span>{activeVideo.durasi}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video List */}
                    {videos.length > 1 && (
                        <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
                            <h3 className="text-sm font-black text-[#1e4d7b] uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Video size={16} className="text-purple-500" />
                                Video Lainnya
                            </h3>
                            <div className="space-y-3">
                                {videos.map((video) => (
                                    <button
                                        key={video._id}
                                        onClick={() => setActiveVideo(video)}
                                        className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${activeVideo?._id === video._id
                                            ? 'bg-purple-100 border-2 border-purple-300'
                                            : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activeVideo?._id === video._id ? 'bg-purple-500' : 'bg-slate-200'
                                            }`}>
                                            <Play size={16} className="text-white" fill="white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${activeVideo?._id === video._id ? 'text-purple-700' : 'text-slate-700'
                                                }`}>
                                                {video.judul}
                                            </p>
                                            <p className="text-xs text-slate-400">{video.durasi}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Videos */}
                    {videos.length === 0 && (
                        <div className="bg-slate-50 rounded-3xl p-8 text-center border-2 border-dashed border-slate-200">
                            <Video size={32} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-400 font-bold text-sm">Belum ada video edukasi</p>
                        </div>
                    )}

                    {/* CTA Quiz */}
                    <div className="bg-gradient-to-br from-[#1e4d7b] to-[#2a6094] rounded-3xl p-6 text-white text-center">
                        <h3 className="font-black text-lg mb-2">Sudah Paham?</h3>
                        <p className="text-white/70 text-sm font-medium mb-4">Uji pemahamanmu dengan mengerjakan kuis!</p>
                        <Link
                            href="/student/quizzes"
                            className="block w-full py-3 bg-white text-[#1e4d7b] rounded-xl font-black text-sm hover:bg-slate-100 transition-colors"
                        >
                            Kerjakan Kuis
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
