'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizzesApi } from '@/lib/api';
import toast from 'react-hot-toast';

export const useCreateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => quizzesApi.create(data),
        onSuccess: () => {
            toast.success('Kuis berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kuis'),
    });
};

export const useUpdateQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: any }) =>
            quizzesApi.update(id, payload),
        onSuccess: () => {
            toast.success('Kuis berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan kuis'),
    });
};

export const useDeleteQuiz = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => quizzesApi.delete(id),
        onSuccess: () => {
            toast.success('Kuis berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus kuis'),
    });
};

export const useAddQuestion = (onDone?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ quizId, payload }: { quizId: string; payload: any }) =>
            quizzesApi.addQuestion(quizId, payload),
        onSuccess: () => {
            toast.success('Soal berhasil ditambahkan');
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            onDone?.();
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan soal'),
    });
};

export const useUpdateQuestion = (onDone?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ quizId, questionId, payload }: { quizId: string; questionId: string; payload: any }) =>
            quizzesApi.updateQuestion(quizId, questionId, payload),
        onSuccess: () => {
            toast.success('Soal berhasil diperbarui');
            queryClient.invalidateQueries({ queryKey: ['questions'] });
            onDone?.();
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menyimpan soal'),
    });
};

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ quizId, questionId }: { quizId: string; questionId: string }) =>
            quizzesApi.deleteQuestion(quizId, questionId),
        onSuccess: () => {
            toast.success('Soal berhasil dihapus');
            queryClient.invalidateQueries({ queryKey: ['questions'] });
        },
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal menghapus soal'),
    });
};

export const useSubmitQuiz = () => {
    return useMutation({
        mutationFn: ({ quizId, answers }: { quizId: string; answers: any }) =>
            quizzesApi.submit(quizId, answers),
        onError: (error) =>
            toast.error(error instanceof Error ? error.message : 'Gagal mengirim jawaban'),
    });
};
