'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useMaterialById } from '@/hooks/queries/useMaterials';
import LoadingScreen from '@/components/shared/LoadingScreen';
import ReactMarkdown from 'react-markdown';

export default function MaterialDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    const { data: materialData, isLoading } = useMaterialById(resolvedParams.id);

    const material = materialData;

    if (isLoading) return <LoadingScreen message="Memuat materi..." color="border-emerald-500" />;

    if (!material) return null;

    const colors = { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'from-blue-500 to-cyan-500' };

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
                                <BookOpen size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <span className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-xs font-black uppercase tracking-widest mb-2 border border-current/10`}>
                                    Penyakit Tidak Menular
                                </span>
                                <h1 className="text-3xl font-black text-[#1e4d7b] mb-2">{material.judul}</h1>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <Calendar size={14} />
                                    <span>Diperbarui {new Date(material.tanggal_upload || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
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
                        <div className="max-w-none text-slate-700 leading-relaxed text-base [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1e4d7b] [&_h3]:mt-8 [&_h3]:mb-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_li]:mb-1 [&_hr]:my-8 [&_hr]:border-slate-200 [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic">
                            <ReactMarkdown>
                                {material.konten_teks}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    {/* CTA Quiz */}
                    <div className="bg-gradient-to-br from-[#1e4d7b] to-[#2a6094] rounded-3xl p-6 text-white text-center sticky top-24">
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
