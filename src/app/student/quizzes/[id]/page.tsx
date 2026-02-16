'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { quizzesApi, reportingApi } from '@/lib/api';
import { ArrowLeft, CheckCircle, XCircle, Award, Trophy, Brain, ClipboardList, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Question {
    _id: string;
    pertanyaan: string;
    pilihan_ganda: string[];
}

interface Quiz {
    _id: string;
    judul: string;
    tipe: string;
    deskripsi: string;
}

interface SubmitResult {
    message: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    resultId: string;
}

export default function TakeQuiz({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubmitResult | null>(null);
    const [canTake, setCanTake] = useState(true);
    const router = useRouter();

    useEffect(() => { loadQuiz(); }, [resolvedParams.id]);

    const loadQuiz = async () => {
        try {
            // Check prerequisite
            const prereq = await reportingApi.checkPrerequisite(resolvedParams.id) as { canTake: boolean; message: string };
            if (!prereq.canTake) {
                toast.error(prereq.message);
                setCanTake(false);
                router.push('/student/quizzes');
                return;
            }

            const [quizData, questionsData] = await Promise.all([
                quizzesApi.getById(resolvedParams.id),
                quizzesApi.getQuestions(resolvedParams.id),
            ]);
            setQuiz(quizData as Quiz);
            setQuestions(questionsData as Question[]);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat kuis');
            router.push('/student/quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length !== questions.length) {
            toast.error('Harap jawab semua pertanyaan');
            return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([soal_id, jawaban_user]) => ({
                soal_id,
                jawaban_user,
            }));
            const submitResult = await quizzesApi.submit(resolvedParams.id, formattedAnswers) as SubmitResult;
            setResult(submitResult);
            toast.success('Kuis berhasil diselesaikan!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal mengirim jawaban');
        } finally {
            setSubmitting(false);
        }
    };

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

    if (!canTake || !quiz) return null;

    // Result screen
    if (result) {
        const isPassed = (result.score ?? 0) >= 70;
        return (
            <div className="max-w-2xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100"
                >
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${isPassed
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                        }`}>
                        <Trophy size={48} className="text-white" />
                    </div>

                    <h1 className="text-3xl font-black text-[#1e4d7b] mb-2">
                        {isPassed ? 'Selamat! 🎉' : 'Terus Semangat! 💪'}
                    </h1>
                    <p className="text-slate-500 font-medium mb-6">{quiz.judul}</p>

                    <div className={`text-6xl font-black mb-2 ${isPassed ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {Math.round(result.score ?? 0)}%
                    </div>
                    <p className="text-slate-500 mb-8">
                        {result.correctCount ?? 0} dari {result.totalQuestions ?? 0} jawaban benar
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <CheckCircle className="text-emerald-500 mx-auto mb-2" size={28} />
                            <p className="text-3xl font-black text-emerald-600">{result.correctCount ?? 0}</p>
                            <p className="text-sm text-emerald-600/70 font-bold">Benar</p>
                        </div>
                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                            <XCircle className="text-red-500 mx-auto mb-2" size={28} />
                            <p className="text-3xl font-black text-red-600">{(result.totalQuestions ?? 0) - (result.correctCount ?? 0)}</p>
                            <p className="text-sm text-red-600/70 font-bold">Salah</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href="/student/quizzes"
                            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} /> Kembali
                        </Link>
                        <Link
                            href="/student/history"
                            className="flex-1 py-4 bg-[#1e4d7b] hover:bg-[#2a6094] text-white rounded-xl font-bold text-sm transition-colors"
                        >
                            Lihat Riwayat
                        </Link>
                    </div>
                </motion.div >
            </div >
        );
    }

    // Quiz screen
    const isPreTest = quiz.tipe === 'pre-test';

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#1e4d7b] transition-colors font-bold"
                >
                    <ArrowLeft size={20} /> Kembali
                </button>
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${isPreTest
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {quiz.tipe}
                </span>
            </motion.div>

            {/* Quiz Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >
                <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isPreTest
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                        }`}>
                        {isPreTest ? <Brain size={28} className="text-white" /> : <ClipboardList size={28} className="text-white" />}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-black text-[#1e4d7b] mb-2">{quiz.judul}</h1>
                        <p className="text-slate-500 font-medium">{quiz.deskripsi}</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-500">Progress Jawaban</span>
                        <span className="text-sm font-black text-[#1e4d7b]">
                            {Object.keys(answers).length}/{questions.length}
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 rounded-full ${isPreTest ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                            style={{ width: `${questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Questions */}
            {questions.length === 0 ? (
                <div className="bg-slate-50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                    <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">Belum ada soal untuk kuis ini</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-[#1e4d7b] font-bold text-sm underline"
                    >
                        Kembali ke daftar kuis
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <motion.div
                            key={question._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
                        >
                            <p className="text-lg font-bold text-[#1e4d7b] mb-6">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 text-sm font-black mr-3">
                                    {index + 1}
                                </span>
                                {question.pertanyaan}
                            </p>

                            <div className="space-y-3">
                                {question.pilihan_ganda.map((option, optIndex) => {
                                    const isSelected = answers[question._id] === optIndex;
                                    return (
                                        <button
                                            key={optIndex}
                                            onClick={() => handleAnswer(question._id, optIndex)}
                                            className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${isSelected
                                                ? isPreTest
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-transparent hover:border-slate-200'
                                                }`}
                                        >
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 ${isSelected
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-200 text-slate-500'
                                                }`}>
                                                {String.fromCharCode(65 + optIndex)}
                                            </span>
                                            <span className="font-medium">{option}</span>
                                            {isSelected && (
                                                <CheckCircle size={20} className="ml-auto text-white" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Submit Button */}
            {questions.length > 0 && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length !== questions.length}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${isPreTest
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                        }`}
                >
                    {submitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        <>Kirim Jawaban ({Object.keys(answers).length}/{questions.length})</>
                    )}
                </motion.button>
            )}
        </div>
    );
}
