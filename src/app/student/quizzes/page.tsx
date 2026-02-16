'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { quizzesApi, reportingApi } from '@/lib/api';
import { ClipboardList, Lock, CheckCircle, ArrowRight, AlertCircle, Sparkles, Brain, Trophy, Target, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface Quiz {
    _id: string;
    judul: string;
    tipe: string;
    deskripsi: string;
}

interface QuizStatus {
    quizId: string;
    judul: string;
    tipe: string;
    isCompleted: boolean;
    score: number | null;
}

interface CompletionData {
    quizStatus: QuizStatus[];
    hasCompletedPretest: boolean;
    canTakePosttest: boolean;
}

export default function StudentQuizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [completionData, setCompletionData] = useState<CompletionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [quizzesData, completionStatus] = await Promise.all([
                quizzesApi.getAll(),
                reportingApi.getCompletionStatus(),
            ]);
            setQuizzes(quizzesData as Quiz[]);
            setCompletionData(completionStatus as CompletionData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const getQuizStatus = (quizId: string) => {
        return completionData?.quizStatus.find(q => q.quizId === quizId);
    };

    const canTakeQuiz = (quiz: Quiz) => {
        const status = getQuizStatus(quiz._id);
        if (status?.isCompleted) return { can: false, reason: 'completed' };
        if (quiz.tipe === 'post-test' && !completionData?.hasCompletedPretest) {
            return { can: false, reason: 'locked' };
        }
        return { can: true, reason: 'available' };
    };

    // Calculate progress
    const completedCount = completionData?.quizStatus.filter(q => q.isCompleted).length || 0;
    const totalQuizzes = quizzes.length;
    const progressPercent = totalQuizzes > 0 ? Math.round((completedCount / totalQuizzes) * 100) : 0;

    // Calculate average score
    const completedQuizzes = completionData?.quizStatus.filter(q => q.isCompleted && q.score !== null) || [];
    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
        : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold">Memuat kuis...</p>
                </div>
            </div>
        );
    }

    const pretests = quizzes.filter(q => q.tipe === 'pre-test');
    const posttests = quizzes.filter(q => q.tipe === 'post-test');

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center lg:text-left"
            >
                <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                    Uji Pengetahuan
                </span>
                <h1 className="text-4xl font-black text-[#1e4d7b]">Tes Pengetahuanmu!</h1>
                <p className="text-slate-500 font-bold mt-3 max-w-xl">
                    Uji pemahamanmu setelah mempelajari materi kesehatan. Selesaikan Pre-Test dan Post-Test untuk mengetahui progressmu!
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{completedCount}/{totalQuizzes}</p>
                            <p className="text-sm font-bold text-white/70">Kuis Selesai</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{avgScore}%</p>
                            <p className="text-sm font-bold text-white/70">Rata-rata Skor</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-3xl font-black">{progressPercent}%</p>
                            <p className="text-sm font-bold text-white/70">Progress</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
            >
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-black uppercase text-[#1e4d7b] tracking-widest">Progress Kuis</span>
                    <span className="text-2xl font-black text-[#1e4d7b]">{progressPercent}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                </div>
                <p className="text-sm text-slate-500 font-medium mt-2">
                    {completedCount === totalQuizzes
                        ? '🎉 Selamat! Kamu telah menyelesaikan semua kuis!'
                        : `${totalQuizzes - completedCount} kuis lagi untuk menyelesaikan semua tes`
                    }
                </p>
            </motion.div>

            {/* Alert for Locked Post-test */}
            {!completionData?.hasCompletedPretest && posttests.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-orange-50 rounded-2xl p-6 border-2 border-orange-100 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
                >
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 flex-shrink-0">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-orange-800">Post-Test Terkunci</h4>
                        <p className="text-orange-700/70 font-bold text-sm">
                            Selesaikan <strong>Pre-Test</strong> terlebih dahulu sebelum dapat mengakses Post-Test.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Quiz Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pre-tests */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <Brain size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1e4d7b]">Pre-Test</h2>
                            <p className="text-sm text-slate-500 font-medium">Tes awal sebelum belajar</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {pretests.map((quiz) => {
                            const status = getQuizStatus(quiz._id);
                            return (
                                <motion.div
                                    key={quiz._id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${status?.isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                                            }`}>
                                            {status?.isCompleted ? <CheckCircle size={24} /> : <Sparkles size={24} />}
                                        </div>
                                        {status?.isCompleted && (
                                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                                                Selesai
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-[#1e4d7b] mb-2">{quiz.judul}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{quiz.deskripsi}</p>

                                    {status?.isCompleted ? (
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                                            <Trophy size={24} className="text-amber-500" />
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Skor Kamu</span>
                                                <p className="text-2xl font-black text-blue-600">{status.score}%</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/student/quizzes/${quiz._id}`}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                                        >
                                            Mulai Kuis <ArrowRight size={18} />
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}

                        {pretests.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <Brain size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-slate-400 font-bold">Belum ada Pre-Test tersedia</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Post-tests */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1e4d7b]">Post-Test</h2>
                            <p className="text-sm text-slate-500 font-medium">Tes akhir setelah belajar</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {posttests.map((quiz) => {
                            const status = getQuizStatus(quiz._id);
                            const { reason } = canTakeQuiz(quiz);

                            return (
                                <motion.div
                                    key={quiz._id}
                                    whileHover={reason !== 'locked' ? { scale: 1.02 } : {}}
                                    className={`bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm transition-shadow ${reason === 'locked' ? 'opacity-60' : 'hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${reason === 'locked'
                                                ? 'bg-slate-400'
                                                : status?.isCompleted
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                            }`}>
                                            {reason === 'locked'
                                                ? <Lock size={24} />
                                                : status?.isCompleted
                                                    ? <CheckCircle size={24} />
                                                    : <ClipboardList size={24} />
                                            }
                                        </div>
                                        {reason === 'locked' && (
                                            <span className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest">
                                                Terkunci
                                            </span>
                                        )}
                                        {status?.isCompleted && (
                                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                                                Selesai
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-black text-[#1e4d7b] mb-2">{quiz.judul}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{quiz.deskripsi}</p>

                                    {status?.isCompleted ? (
                                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
                                            <Trophy size={24} className="text-amber-500" />
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase">Skor Kamu</span>
                                                <p className="text-2xl font-black text-amber-600">{status.score}%</p>
                                            </div>
                                        </div>
                                    ) : reason === 'locked' ? (
                                        <div className="text-center py-4 bg-slate-100 rounded-xl">
                                            <Lock size={20} className="mx-auto text-slate-400 mb-1" />
                                            <p className="text-xs font-bold text-slate-500">Selesaikan Pre-Test terlebih dahulu</p>
                                        </div>
                                    ) : (
                                        <Link
                                            href={`/student/quizzes/${quiz._id}`}
                                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                                        >
                                            Ujian Akhir <ArrowRight size={18} />
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}

                        {posttests.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <ClipboardList size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-slate-400 font-bold">Belum ada Post-Test tersedia</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* History Link */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
            >
                <Link
                    href="/student/history"
                    className="inline-flex items-center gap-2 text-[#1e4d7b] font-black text-sm uppercase tracking-widest hover:gap-4 transition-all group"
                >
                    Lihat Riwayat Kuis
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        </div>
    );
}
