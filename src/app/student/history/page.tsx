'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { reportingApi } from '@/lib/api';
import { History, Calendar, Award, TrendingUp, Trophy, ArrowLeft, Brain, ClipboardList, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface HistoryItem {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    kuis_id: { judul: string; tipe: string };
}

export default function StudentHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadHistory(); }, []);

    const loadHistory = async () => {
        try {
            const data = await reportingApi.getHistory() as HistoryItem[];
            setHistory(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat riwayat');
        } finally {
            setLoading(false);
        }
    };

    const averageScore = history.length > 0
        ? Math.round(history.reduce((acc, h) => acc + (h.skor ?? 0), 0) / history.length)
        : 0;

    const highestScore = history.length > 0
        ? Math.max(...history.map(h => h.skor ?? 0))
        : 0;

    const passedCount = history.filter(h => (h.skor ?? 0) >= 70).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">Memuat riwayat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            >
                <div>
                    <Link
                        href="/student/quizzes"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1e4d7b] transition-colors font-bold text-sm mb-4"
                    >
                        <ArrowLeft size={16} /> Kembali ke Kuis
                    </Link>
                    <span className="block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-black uppercase tracking-widest mb-4 w-fit">
                        Riwayat Pengerjaan
                    </span>
                    <h1 className="text-4xl font-black text-[#1e4d7b]">Riwayat Kuis</h1>
                    <p className="text-slate-500 font-bold mt-2">Pantau perkembangan dan hasil pengerjaan kuis Anda</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <History size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{history.length}</p>
                            <p className="text-sm font-bold text-white/70">Total Pengerjaan</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{averageScore}%</p>
                            <p className="text-sm font-bold text-white/70">Rata-rata Skor</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{highestScore}%</p>
                            <p className="text-sm font-bold text-white/70">Skor Tertinggi</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{passedCount}</p>
                            <p className="text-sm font-bold text-white/70">Kuis Lulus</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* History List */}
            {history.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Daftar Riwayat</h2>

                    {history.map((item, index) => {
                        const isPreTest = item.kuis_id?.tipe === 'pre-test';
                        const isPassed = (item.skor ?? 0) >= 70;

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${isPreTest
                                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                            : 'bg-gradient-to-br from-amber-500 to-orange-500'
                                        }`}>
                                        {isPreTest ? <Brain size={24} className="text-white" /> : <ClipboardList size={24} className="text-white" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#1e4d7b]">{item.kuis_id?.judul || 'Kuis'}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isPreTest
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {item.kuis_id?.tipe || 'Quiz'}
                                            </span>
                                            <span className="text-sm text-slate-400 font-medium flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(item.tanggal_selesai).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 sm:text-right">
                                    <div>
                                        <p className={`text-3xl font-black ${isPassed ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {item.skor ?? 0}%
                                        </p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${isPassed
                                                ? 'bg-emerald-100 text-emerald-600'
                                                : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {isPassed ? 'Lulus' : 'Perlu Belajar'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200"
                >
                    <LayoutGrid size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold text-lg">Belum ada riwayat pengerjaan kuis</p>
                    <p className="text-sm text-slate-400 font-medium mt-2">Mulai kerjakan kuis untuk melihat riwayat Anda di sini</p>
                    <Link
                        href="/student/quizzes"
                        className="inline-block mt-6 px-6 py-3 bg-[#1e4d7b] hover:bg-[#2a6094] text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        Mulai Kuis
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
