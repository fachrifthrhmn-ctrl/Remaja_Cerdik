'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { quizzesApi } from '@/lib/api';
import Modal from '@/components/shared/Modal';
import { Plus, Edit2, Trash2, Search, ClipboardList, ChevronDown, ChevronUp, HelpCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
    _id: string;
    pertanyaan: string;
    pilihan_ganda: string[];
    kunci_jawaban?: number;
}

interface Quiz {
    _id: string;
    judul: string;
    tipe: string;
    deskripsi: string;
    createdAt: string;
}

export default function ManageQuizzes() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
    const [formData, setFormData] = useState({ judul: '', tipe: 'pre-test', deskripsi: '' });
    const [questionForm, setQuestionForm] = useState({ pertanyaan: '', pilihan_ganda: ['', '', '', ''], kunci_jawaban: 0 });
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);

    useEffect(() => { loadQuizzes(); }, []);

    const loadQuizzes = async () => {
        try {
            const data = await quizzesApi.getAll() as Quiz[];
            setQuizzes(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat kuis');
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (quizId: string) => {
        try {
            const data = await quizzesApi.getQuestions(quizId) as Question[];
            setQuestions(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat soal');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editQuiz) {
                await quizzesApi.update(editQuiz._id, formData);
                toast.success('Kuis berhasil diperbarui');
            } else {
                await quizzesApi.create(formData);
                toast.success('Kuis berhasil ditambahkan');
            }
            setShowModal(false);
            resetForm();
            loadQuizzes();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kuis');
        }
    };

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuiz) return;
        try {
            if (editQuestion) {
                await quizzesApi.updateQuestion(selectedQuiz._id, editQuestion._id, questionForm);
                toast.success('Soal berhasil diperbarui');
            } else {
                await quizzesApi.addQuestion(selectedQuiz._id, questionForm);
                toast.success('Soal berhasil ditambahkan');
            }
            setShowQuestionModal(false);
            resetQuestionForm();
            loadQuestions(selectedQuiz._id);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan soal');
        }
    };

    const handleDeleteQuiz = async (id: string) => {
        if (!confirm('Hapus kuis beserta semua soalnya?')) return;
        try {
            await quizzesApi.delete(id);
            toast.success('Kuis berhasil dihapus');
            loadQuizzes();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus kuis');
        }
    };

    const handleDeleteQuestion = async (quizId: string, questionId: string) => {
        if (!confirm('Hapus soal ini?')) return;
        try {
            await quizzesApi.deleteQuestion(quizId, questionId);
            toast.success('Soal berhasil dihapus');
            loadQuestions(quizId);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus soal');
        }
    };

    const toggleExpand = async (quiz: Quiz) => {
        if (expandedQuiz === quiz._id) {
            setExpandedQuiz(null);
        } else {
            setExpandedQuiz(quiz._id);
            setSelectedQuiz(quiz);
            await loadQuestions(quiz._id);
        }
    };

    const openEditModal = (quiz: Quiz) => {
        setEditQuiz(quiz);
        setFormData({ judul: quiz.judul, tipe: quiz.tipe, deskripsi: quiz.deskripsi });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditQuiz(null);
        setFormData({ judul: '', tipe: 'pre-test', deskripsi: '' });
    };

    const resetQuestionForm = () => {
        setEditQuestion(null);
        setQuestionForm({ pertanyaan: '', pilihan_ganda: ['', '', '', ''], kunci_jawaban: 0 });
    };

    const openAddQuestion = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        resetQuestionForm();
        setShowQuestionModal(true);
    };

    const filteredQuizzes = quizzes.filter(q => q.judul.toLowerCase().includes(search.toLowerCase()));

    // Stats
    const preTestCount = quizzes.filter(q => q.tipe === 'pre-test').length;
    const postTestCount = quizzes.filter(q => q.tipe === 'post-test').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat kuis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Kelola Kuis</h1>
                    <p className="text-gray-500 mt-1">Tambah dan kelola kuis serta soal-soalnya</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                >
                    <Plus size={20} /> Tambah Kuis
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <ClipboardList size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{quizzes.length}</p>
                            <p className="text-sm text-gray-500">Total Kuis</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <HelpCircle size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{preTestCount}</p>
                            <p className="text-sm text-gray-500">Pre-Test</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <CheckCircle size={24} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{postTestCount}</p>
                            <p className="text-sm text-gray-500">Post-Test</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari kuis..."
                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Quizzes List */}
            <div className="space-y-4">
                {filteredQuizzes.map((quiz, index) => (
                    <motion.div
                        key={quiz._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                        {/* Quiz Header */}
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleExpand(quiz)}>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${quiz.tipe === 'pre-test'
                                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                        : 'bg-gradient-to-br from-amber-500 to-orange-500'
                                        }`}>
                                        <ClipboardList size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{quiz.judul}</h3>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${quiz.tipe === 'pre-test'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {quiz.tipe}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => openEditModal(quiz)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuiz(quiz._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleExpand(quiz)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {expandedQuiz === quiz._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Questions */}
                        {expandedQuiz === quiz._id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border-t border-gray-100 bg-gray-50 p-5"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                        <HelpCircle size={18} className="text-amber-500" />
                                        Soal ({questions.length})
                                    </h4>
                                    <button
                                        onClick={() => openAddQuestion(quiz)}
                                        className="flex items-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Plus size={16} /> Tambah Soal
                                    </button>
                                </div>

                                {questions.length > 0 ? (
                                    <div className="space-y-3">
                                        {questions.map((q, i) => (
                                            <div key={q._id} className="p-4 bg-white rounded-xl border border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <p className="text-gray-800 font-medium">
                                                        <span className="text-gray-400 mr-2">{i + 1}.</span>
                                                        {q.pertanyaan}
                                                    </p>
                                                    <button
                                                        onClick={() => handleDeleteQuestion(quiz._id, q._id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <div className="mt-3 grid grid-cols-2 gap-2">
                                                    {q.pilihan_ganda.map((opt, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`text-sm px-3 py-1.5 rounded-lg ${q.kunci_jawaban === idx
                                                                ? 'bg-emerald-100 text-emerald-700 font-medium'
                                                                : 'bg-gray-50 text-gray-600'
                                                                }`}
                                                        >
                                                            {String.fromCharCode(65 + idx)}. {opt}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <HelpCircle size={32} className="mx-auto text-gray-300 mb-2" />
                                        <p className="text-gray-500">Belum ada soal</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredQuizzes.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Belum ada kuis</p>
                </div>
            )}

            {/* Quiz Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editQuiz ? 'Edit Kuis' : 'Tambah Kuis'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="quiz-judul" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Judul</label>
                        <input
                            id="quiz-judul"
                            type="text"
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="quiz-tipe" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tipe</label>
                        <select
                            id="quiz-tipe"
                            value={formData.tipe}
                            onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                            className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                        >
                            <option value="pre-test">Pre-Test</option>
                            <option value="post-test">Post-Test</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quiz-deskripsi" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Deskripsi</label>
                        <textarea
                            id="quiz-deskripsi"
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                            className="w-full min-h-[100px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#bbe9fa]/50 transition-all"
                        >
                            {editQuiz ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Question Modal */}
            <Modal isOpen={showQuestionModal} onClose={() => setShowQuestionModal(false)} title={editQuestion ? 'Edit Soal' : 'Tambah Soal'} size="lg">
                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="q-pertanyaan" className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pertanyaan</label>
                        <textarea
                            id="q-pertanyaan"
                            value={questionForm.pertanyaan}
                            onChange={(e) => setQuestionForm({ ...questionForm, pertanyaan: e.target.value })}
                            className="w-full min-h-[80px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all resize-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pilihan Jawaban</label>
                        {questionForm.pilihan_ganda.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3 mb-2">
                                <input
                                    id={`q-opt-check-${i}`}
                                    type="radio"
                                    name="kunci"
                                    checked={questionForm.kunci_jawaban === i}
                                    onChange={() => setQuestionForm({ ...questionForm, kunci_jawaban: i })}
                                    className="w-5 h-5 text-[#2a9fd6] accent-[#2a9fd6]"
                                />
                                <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-xl text-sm font-black text-slate-500">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <input
                                    id={`q-opt-input-${i}`}
                                    aria-labelledby={`q-opt-check-${i}`}
                                    type="text"
                                    value={opt}
                                    onChange={(e) => {
                                        const arr = [...questionForm.pilihan_ganda];
                                        arr[i] = e.target.value;
                                        setQuestionForm({ ...questionForm, pilihan_ganda: arr });
                                    }}
                                    className="flex-1 h-10 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-medium focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                    placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                                    required
                                />
                            </div>
                        ))}
                        <p className="text-xs text-slate-400 font-medium mt-2">Pilih radio button untuk menandai jawaban benar</p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowQuestionModal(false)}
                            className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#bbe9fa]/50 transition-all"
                        >
                            {editQuestion ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
