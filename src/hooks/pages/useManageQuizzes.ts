'use client';

import { useState } from 'react';
import { useQuizzes, useQuestions } from '@/hooks/queries/useQuizzes';
import { useCreateQuiz, useUpdateQuiz, useDeleteQuiz, useAddQuestion, useUpdateQuestion, useDeleteQuestion } from '@/hooks/mutations/useQuizMutations';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';
import type { Quiz, Question } from '@/types';

export function useManageQuizzes() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [showModal, setShowModal] = useState(false);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editQuiz, setEditQuiz] = useState<Quiz | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
    const [formData, setFormData] = useState({ judul: '', tipe: 'pre-test', deskripsi: '' });
    const [questionForm, setQuestionForm] = useState({ pertanyaan: '', pilihan_ganda: ['', '', '', ''], kunci_jawaban: 0 });
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);

    const { data: quizzes = [], isLoading } = useQuizzes();
    const { data: questions = [] } = useQuestions(expandedQuiz);

    const resetQuestionForm = () => {
        setEditQuestion(null);
        setQuestionForm({ pertanyaan: '', pilihan_ganda: ['', '', '', ''], kunci_jawaban: 0 });
    };

    const createQuizMutation = useCreateQuiz();
    const updateQuizMutation = useUpdateQuiz();
    const deleteQuizMutation = useDeleteQuiz();
    const addQuestionMutation = useAddQuestion(() => { setShowQuestionModal(false); resetQuestionForm(); });
    const updateQuestionMutation = useUpdateQuestion(() => { setShowQuestionModal(false); resetQuestionForm(); });
    const deleteQuestionMutation = useDeleteQuestion();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editQuiz) {
            updateQuizMutation.mutate(
                { id: editQuiz._id, payload: formData },
                { onSuccess: () => { setShowModal(false); resetForm(); } }
            );
        } else {
            createQuizMutation.mutate(formData, {
                onSuccess: () => { setShowModal(false); resetForm(); }
            });
        }
    };

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuiz) return;
        if (editQuestion) {
            updateQuestionMutation.mutate({ quizId: selectedQuiz._id, questionId: editQuestion._id, payload: questionForm });
        } else {
            addQuestionMutation.mutate({ quizId: selectedQuiz._id, payload: questionForm });
        }
    };

    const handleDeleteQuiz = (id: string) => {
        if (!confirm('Hapus kuis beserta semua soalnya?')) return;
        deleteQuizMutation.mutate(id);
    };

    const handleDeleteQuestion = (quizId: string, questionId: string) => {
        if (!confirm('Hapus soal ini?')) return;
        deleteQuestionMutation.mutate({ quizId, questionId });
    };

    const toggleExpand = (quiz: Quiz) => {
        if (expandedQuiz === quiz._id) {
            setExpandedQuiz(null);
        } else {
            setExpandedQuiz(quiz._id);
            setSelectedQuiz(quiz);
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

    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openAddQuestion = (quiz: Quiz) => {
        setSelectedQuiz(quiz);
        resetQuestionForm();
        setShowQuestionModal(true);
    };

    const openEditQuestion = (question: Question) => {
        setEditQuestion(question);
        setQuestionForm({
            pertanyaan: question.pertanyaan,
            pilihan_ganda: [...question.pilihan_ganda],
            kunci_jawaban: question.kunci_jawaban,
        });
        setShowQuestionModal(true);
    };

    const filteredQuizzes = quizzes.filter(q => q.judul.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const preTestCount = quizzes.filter(q => q.tipe === 'pre-test').length;
    const postTestCount = quizzes.filter(q => q.tipe === 'post-test').length;

    return {
        // State
        search, setSearch,
        showModal, setShowModal,
        showQuestionModal, setShowQuestionModal,
        editQuiz, selectedQuiz, expandedQuiz,
        formData, setFormData,
        questionForm, setQuestionForm,
        editQuestion,
        // Data
        quizzes, questions, isLoading,
        createQuizMutation, updateQuizMutation,
        addQuestionMutation, updateQuestionMutation,
        // Computed
        filteredQuizzes, preTestCount, postTestCount,
        // Handlers
        handleSubmit, handleQuestionSubmit,
        handleDeleteQuiz, handleDeleteQuestion,
        toggleExpand, openEditModal, openAddModal,
        openAddQuestion, openEditQuestion,
        resetQuestionForm,
    };
}
