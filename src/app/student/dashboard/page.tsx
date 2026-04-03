'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    Activity,
    ChevronRight,
    Heart,
    Apple,
    Bike,
    Ban,
    Wind,
    CheckCircle2,
    Droplets,
    Moon,
    BookOpen,
    ClipboardList,
    ArrowRight,
    Calendar1,
    CalendarArrowDownIcon
} from 'lucide-react';
import { materialsApi, reportingApi } from '@/lib/api';
import Hero from '@/components/student/Hero';
import { useQuery } from '@tanstack/react-query';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import type { Material } from '@/types';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

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
    const { data, isLoading } = useQuery({
        queryKey: ['student-dashboard'],
        queryFn: async () => {
            const [allMaterials, completionData] = await Promise.all([
                materialsApi.getAll(),
                reportingApi.getCompletionStatus()
            ]);

            const materialsData = allMaterials as Material[];
            const quizStatus = (completionData as any).quizStatus || [];

            // Find PTM material specifically to ensure the hook always finds it
            const ptmMaterial = materialsData.find(m =>
                m.judul.toLowerCase().includes('ptm') ||
                m.judul.toLowerCase().includes('penyakit tidak menular')
            );

            return {
                materials: materialsData.slice(0, 4),
                ptmMaterialId: ptmMaterial?._id || '',
                stats: {
                    materials: materialsData.length,
                    quizzes: quizStatus.length,
                    completed: quizStatus.filter((q: any) => q.isCompleted).length
                }
            };
        }
    });

    const materials = data?.materials || [];
    const ptmMaterialId = data?.ptmMaterialId || '';
    const stats = data?.stats || { materials: 0, quizzes: 0, completed: 0 };

    useEffect(() => {
        const ctx = gsap.context(() => {
            ScrollSmoother.create({
                wrapper: "#smooth-wrapper",
                content: "#smooth-content",
                smooth: 1.5,
                effects: true
            });
        });

        return () => ctx.revert();
    }, []);

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div id="smooth-wrapper">
            <div id="smooth-content">
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
                                        { text: "Kuis seru untuk mengukur pemahamanmu", icon: ClipboardList },
                                        { text: "Pantau progres belajarmu secara real-time", icon: CheckCircle2 },
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
                                Materi Utama
                            </span>
                            <h2 className="text-4xl font-black text-[#1e4d7b] mb-4">Mengenal Penyakit Tidak Menular</h2>
                            <p className="text-slate-500 font-bold max-w-2xl mx-auto">Pelajari lebih dalam mengenai definisi, jenis, faktor risiko, dan cara pencegahan Penyakit Tidak Menular (PTM) di sini.</p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-br from-blue-500 to-[#1e4d7b] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

                                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-cyan-200 mb-8 border border-white/20 shadow-inner">
                                    <BookOpen size={48} />
                                </div>

                                <h3 className="text-3xl md:text-4xl font-black mb-6 relative z-10 leading-tight">
                                    Pengenalan & Bahaya PTM <br className="hidden md:block" />(Penyakit Tidak Menular)
                                </h3>

                                <p className="text-blue-100 font-medium text-lg mb-10 max-w-2xl relative z-10">
                                    Materi ini merangkum seluruh informasi penting dari WHO dan Kemenkes RI mengenai bahaya PTM hingga panduan pencegahannya.
                                </p>

                                <Link
                                    href={ptmMaterialId ? `/student/materials/${ptmMaterialId}` : '/student/materials'}
                                    onClick={() => {
                                        if (!ptmMaterialId) {
                                            alert("Materi PTM belum ditambahkan oleh Admin. Mengarahkan ke daftar materi umum.");
                                        }
                                    }}
                                    className="relative z-10 bg-white text-[#1e4d7b] px-10 py-5 rounded-2xl font-black text-base uppercase tracking-widest flex items-center gap-4 hover:gap-6 hover:scale-105 active:scale-95 transition-all shadow-xl group"
                                >
                                    Mulai Belajar
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform text-blue-500" />
                                </Link>
                            </motion.div>
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

                        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { title: "Cek Kesehatan", desc: "Periksa tensi & gula darah", icon: Activity, color: "from-blue-500 to-cyan-500" },
                                { title: "Enyahkan Asap Rokok", desc: "Jauhi paparan asap rokok", icon: Ban, color: "from-slate-600 to-slate-800" },
                                { title: "Rajin Olahraga", desc: "Aktivitas fisik 30 menit/hari", icon: Bike, color: "from-emerald-500 to-teal-500" },
                                { title: "Diet Seimbang", desc: "Perbanyak sayur & buah", icon: Apple, color: "from-rose-500 to-pink-500" },
                                { title: "Istirahat Cukup", desc: "Tidur 7-8 jam per malam", icon: Moon, color: "from-indigo-500 to-purple-500" },
                                { title: "Kelola Stres", desc: "Berpikir positif & refreshing", icon: Wind, color: "from-amber-500 to-orange-500" }
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
                                    <div className={`w-16 h-16 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                        <p.icon size={28} />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-sm md:text-base font-black text-[#1e4d7b] mb-1">{p.title}</span>
                                        <span className="text-xs text-slate-400 font-medium">{p.desc}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>



                    {/* --- CTA SECTION --- */}
                    <section className="max-w-7xl mx-auto px-6 pt-24 pb-12">
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
            </div>
        </div>
    );
}
