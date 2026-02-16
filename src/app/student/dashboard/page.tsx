'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    ChevronRight,
    Heart,
    Apple,
    Bike,
    Ban,
    Wind,
    Play,
    CheckCircle2,
    Droplets,
    Moon,
    BookOpen,
    Video,
    ClipboardList,
    ArrowRight
} from 'lucide-react';
import { materialsApi, videosApi, reportingApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Hero from '@/components/student/Hero';

// Define types for our data
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

interface DashboardStats {
    materials: number;
    quizzes: number;
    completed: number;
}

const CATEGORY_ICONS: Record<string, { icon: typeof Heart; color: string; bgColor: string }> = {
    'Diabetes': { icon: Droplets, color: 'text-blue-500', bgColor: 'bg-blue-500' },
    'Hipertensi': { icon: Heart, color: 'text-rose-500', bgColor: 'bg-rose-500' },
    'Obesitas': { icon: Apple, color: 'text-amber-500', bgColor: 'bg-amber-500' },
    'Jantung': { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-500' },
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        materials: 0,
        quizzes: 0,
        completed: 0
    });
    const [materials, setMaterials] = useState<Material[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [allMaterials, allVideos, completionData] = await Promise.all([
                    materialsApi.getAll(),
                    videosApi.getAll(),
                    reportingApi.getCompletionStatus()
                ]);

                const materialsData = allMaterials as Material[];
                const videosData = allVideos as VideoItem[];
                setMaterials(materialsData.slice(0, 4)); // Show first 4 materials
                setVideos(videosData.slice(0, 2)); // Show first 2 videos

                const quizStatus = (completionData as any).quizStatus || [];
                setStats({
                    materials: materialsData.length,
                    quizzes: quizStatus.length,
                    completed: quizStatus.filter((q: any) => q.isCompleted).length
                });
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                toast.error('Gagal memuat data dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="flex flex-col gap-0 pb-20 bg-white">
            {/* --- HERO SECTION --- */}
            <Hero stats={stats} itemVariants={itemVariants} />

            {/* --- TENTANG APLIKASI (with ID for hash navigation) --- */}
            <section id="about" className="bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-24 px-6 relative overflow-hidden scroll-mt-20">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-video rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl shadow-blue-200/50"
                    >
                        <Image
                            src="/illustrations/medical_team.png"
                            alt="Tim Medis Remaja Cerdik"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                Tentang Kami
                            </span>
                            <h2 className="text-4xl font-black text-[#1e4d7b] mb-4">Tentang Aplikasi REMAJA CERDIK</h2>
                            <p className="text-[#1e4d7b]/60 font-semibold text-lg leading-relaxed">
                                Aplikasi ini dirancang khusus untuk membantumu memahami pentingnya gaya hidup sehat sejak dini dan mencegah Penyakit Tidak Menular (PTM).
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { text: "Akses materi kesehatan yang mudah dipahami", icon: BookOpen },
                                { text: "Video edukasi interaktif tentang pencegahan PTM", icon: Video },
                                { text: "Kuis seru untuk mengukur pemahamanmu", icon: ClipboardList },
                                { text: "Tips hidup sehat sehari-hari untuk remaja", icon: Heart }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-[#7dc24c] flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-[#1e4d7b] font-bold">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200/30 rounded-full blur-3xl" />
            </section>

            {/* --- MATERI PTM SECTION --- */}
            <section id="materials" className="py-24 px-6 scroll-mt-20">
                <div className="max-w-7xl mx-auto text-center mb-16 px-4">
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Materi Pembelajaran
                    </span>
                    <h2 className="text-4xl font-black text-[#1e4d7b] mb-4">Kenali Berbagai Penyakit Tidak Menular</h2>
                    <p className="text-slate-500 font-bold max-w-2xl mx-auto">Pelajari lebih dalam mengenai bahaya dan cara pencegahan penyakit berikut ini.</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {materials.map((m, i) => {
                        const CategoryIcon = CATEGORY_ICONS[m.kategori]?.icon || Heart;
                        const bgColors = {
                            'Diabetes': 'bg-blue-50 hover:bg-blue-100',
                            'Hipertensi': 'bg-rose-50 hover:bg-rose-100',
                            'Obesitas': 'bg-amber-50 hover:bg-amber-100',
                            'Jantung': 'bg-red-50 hover:bg-red-100'
                        };
                        const btnColors = {
                            'Diabetes': 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/30',
                            'Hipertensi': 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30',
                            'Obesitas': 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
                            'Jantung': 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                        };
                        const iconColors = {
                            'Diabetes': 'bg-blue-500',
                            'Hipertensi': 'bg-rose-500',
                            'Obesitas': 'bg-amber-500',
                            'Jantung': 'bg-red-500'
                        };

                        return (
                            <motion.div
                                key={m._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8 }}
                                className={`rounded-3xl p-8 border-2 border-white flex flex-col items-center text-center transition-all duration-300 shadow-lg ${bgColors[m.kategori as keyof typeof bgColors]}`}
                            >
                                <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center ${iconColors[m.kategori as keyof typeof iconColors]} text-white shadow-xl`}>
                                    <CategoryIcon size={36} />
                                </div>
                                <h3 className="text-2xl font-black text-[#1e4d7b] mb-3">{m.kategori}</h3>
                                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">{m.konten_teks}</p>
                                <Link
                                    href={`/student/materials/${m._id}`}
                                    className={`w-full py-3.5 rounded-2xl text-white font-black text-sm transition-all active:scale-95 shadow-lg ${btnColors[m.kategori as keyof typeof btnColors]}`}
                                >
                                    Pelajari Materi
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/student/materials"
                        className="inline-flex items-center gap-2 text-[#1e4d7b] font-black text-sm uppercase tracking-widest hover:gap-4 transition-all group"
                    >
                        Lihat Semua Materi
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* --- HEALTH TIPS / PREVENTION SECTION (with ID for hash navigation) --- */}
            <section id="health-tips" className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-24 px-6 scroll-mt-20">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Tips Kesehatan
                    </span>
                    <h2 className="text-4xl font-black text-[#1e4d7b] mb-4">Cara Mencegah PTM Sejak Remaja</h2>
                    <p className="text-slate-500 font-bold max-w-2xl mx-auto">Lakukan kebiasaan sehat ini setiap hari agar tubuh tetap cerdik dan berstamina.</p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { title: "Makan Sehat", desc: "Perbanyak sayur & buah", icon: Apple, color: "from-rose-500 to-pink-500" },
                        { title: "Rajin Olahraga", desc: "Minimal 30 menit/hari", icon: Bike, color: "from-emerald-500 to-teal-500" },
                        { title: "Hindari Rokok", desc: "Jauhi asap rokok", icon: Ban, color: "from-slate-600 to-slate-800" },
                        { title: "Kelola Stres", desc: "Istirahat yang cukup", icon: Wind, color: "from-blue-500 to-cyan-500" }
                    ].map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 group shadow-lg border border-gray-100"
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                                <p.icon size={28} />
                            </div>
                            <div className="text-center">
                                <span className="block text-sm font-black text-[#1e4d7b] mb-1">{p.title}</span>
                                <span className="text-xs text-slate-400 font-medium">{p.desc}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Tips */}
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-12">
                    {[
                        { title: "Minum Air Putih", desc: "8 gelas per hari untuk menjaga hidrasi tubuh", icon: Droplets, color: "from-cyan-500 to-blue-500" },
                        { title: "Tidur Cukup", desc: "7-9 jam per malam untuk regenerasi sel", icon: Moon, color: "from-indigo-500 to-purple-500" }
                    ].map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl p-6 flex items-center gap-6 group shadow-lg border border-gray-100"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                                <p.icon size={24} />
                            </div>
                            <div>
                                <span className="block text-lg font-black text-[#1e4d7b]">{p.title}</span>
                                <span className="text-sm text-slate-500 font-medium">{p.desc}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- MEDIA INTERAKTIF / VIDEOS --- */}
            <section id="videos" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        Video Edukasi
                    </span>
                    <h2 className="text-4xl font-black text-[#1e4d7b] mb-4">Media Interaktif</h2>
                    <p className="text-slate-500 font-bold">Tonton video edukasi interaktif untuk pemahaman yang lebih seru!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {videos.length > 0 ? videos.map((video, i) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-3xl overflow-hidden group shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-purple-600 shadow-xl group-hover:scale-110 transition-transform z-10">
                                    <Play fill="currentColor" size={24} />
                                </div>
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold">
                                    {video.durasi}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black text-[#1e4d7b] mb-2">{video.judul}</h3>
                                <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4">{video.deskripsi}</p>
                                <button className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-purple-500/20">
                                    Tonton Video
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <>
                            {[
                                { title: "Bahaya Diabetes", cat: "Edukasi" },
                                { title: "Cegah Hipertensi", cat: "Tips Sehat" }
                            ].map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-3xl overflow-hidden group shadow-lg border border-gray-100"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
                                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-purple-600 shadow-xl group-hover:scale-110 transition-transform z-10">
                                            <Play fill="currentColor" size={24} />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    <div className="p-6 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest">{v.cat}</span>
                                            <h3 className="text-xl font-black text-[#1e4d7b]">{v.title}</h3>
                                        </div>
                                        <button className="py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold text-xs">
                                            Tonton
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/student/materials"
                        className="inline-flex items-center gap-2 text-[#1e4d7b] font-black text-sm uppercase tracking-widest hover:gap-4 transition-all group"
                    >
                        Lihat Semua Video
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="max-w-7xl mx-auto px-6 pb-12">
                <div className="bg-gradient-to-r from-[#1e4d7b] via-[#2a6094] to-[#1e4d7b] rounded-3xl p-12 text-center text-white relative overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-black mb-4">Siap Menguji Pengetahuanmu?</h2>
                        <p className="text-white/70 font-medium mb-8 max-w-xl mx-auto">
                            Setelah mempelajari materi, uji pemahamanmu dengan mengerjakan kuis Pre-Test dan Post-Test!
                        </p>
                        <Link
                            href="/student/quizzes"
                            className="inline-flex items-center gap-3 bg-white text-[#1e4d7b] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:gap-5 transition-all shadow-xl"
                        >
                            Mulai Kuis Sekarang
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {/* Decorative */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                </div>
            </section>
        </div>
    );
}
