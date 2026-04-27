'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Award, Trophy, Brain, ClipboardList, HelpCircle, Timer, AlertTriangle, LogOut } from 'lucide-react';
import Link from 'next/link';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { useTakeQuiz } from '@/hooks/pages/useTakeQuiz';

export default function TakeQuiz({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const {
        answers, result,
        quiz, questions,
        loadingQuiz, isQuizError,
        submitMutation,
        handleAnswer, handleSubmit, handleAutoSubmit,
        quizStarted, startQuiz, timeLeft
    } = useTakeQuiz(resolvedParams.id);

    if (loadingQuiz) return <LoadingScreen message="Memuat kuis..." color="border-amber-500" />;

    const totalQuestions = questions.length;

    if (isQuizError || !quiz) return null;

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

    const isPreTest = quiz.tipe === 'pre-test';

    // Start Screen
    if (!quizStarted) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-10 text-center shadow-xl border border-slate-100"
                >
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${isPreTest
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                        }`}>
                        {isPreTest ? <Brain size={48} className="text-white" /> : <ClipboardList size={48} className="text-white" />}
                    </div>

                    <h1 className="text-3xl font-black text-[#1e4d7b] mb-2">{quiz.judul}</h1>
                    <p className="text-slate-500 font-medium mb-8">{quiz.deskripsi}</p>

                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8 text-left">
                        <h3 className="font-black text-amber-800 flex items-center gap-2 mb-2">
                            <AlertTriangle size={20} /> Perhatian Sebelum Memulai
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-amber-700 font-medium space-y-2">
                            <li>Waktu pengerjaan kuis ini adalah <strong>10 menit</strong>.</li>
                            <li>Waktu akan terus berjalan setelah Anda menekan tombol mulai.</li>
                            <li>Jika waktu habis, jawaban akan tersimpan dan dikumpulkan secara otomatis.</li>
                            <li>Jika Anda keluar di tengah pengerjaan, nilai akan disimpan sesuai progres saat itu.</li>
                        </ul>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={() => {
                                if (window.confirm('Apakah Anda sudah siap? Waktu 10 menit akan mulai berjalan.')) {
                                    startQuiz();
                                }
                            }}
                            className={`flex-1 py-4 rounded-xl font-black text-white transition-all shadow-lg hover:scale-105 active:scale-95 ${isPreTest
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/30'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/30'
                                }`}
                        >
                            Mulai Kuis
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Format timer
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const isTimeRunningOut = timeLeft <= 60; // Less than 1 minute

    // Quiz screen
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
            {/* Header / Timer Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 sticky top-4 z-50"
            >
                <button
                    onClick={() => {
                        if (window.confirm('Anda yakin ingin keluar? Progress jawaban Anda saat ini akan langsung dikumpulkan sebagai nilai akhir.')) {
                            handleAutoSubmit();
                        }
                    }}
                    className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors font-bold bg-rose-50 px-4 py-2 rounded-xl"
                >
                    <LogOut size={20} /> Keluar & Simpan
                </button>

                <div className={`flex items-center gap-3 px-6 py-2 rounded-xl border-2 font-black text-lg ${isTimeRunningOut
                    ? 'border-red-500 text-red-600 bg-red-50 animate-pulse'
                    : 'border-slate-200 text-slate-700 bg-slate-50'
                    }`}>
                    <Timer size={24} className={isTimeRunningOut ? 'animate-bounce' : ''} />
                    {timeString}
                </div>
            </motion.div>

            {/* Quiz Info Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100"
            >
                <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${isPreTest
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                        }`}>
                        {isPreTest ? <Brain size={28} className="text-white" /> : <ClipboardList size={28} className="text-white" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-black text-[#1e4d7b]">{quiz.judul}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPreTest
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {quiz.tipe}
                            </span>
                        </div>
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
                    onClick={() => handleSubmit(false)}
                    disabled={submitMutation.isPending}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${isPreTest
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                        }`}
                >
                    {submitMutation.isPending ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        <>Kirim Jawaban Akhir ({Object.keys(answers).length}/{questions.length})</>
                    )}
                </motion.button>
            )}
        </div>
    );
}
