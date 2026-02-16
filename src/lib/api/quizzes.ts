import { getAuthHeader, handleResponse } from './base';

export const quizzesApi = {
    getAll: async () => {
        const response = await fetch('/api/quizzes', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getById: async (id: string) => {
        const response = await fetch(`/api/quizzes/${id}`, {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    create: async (data: Record<string, unknown>) => {
        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await fetch(`/api/quizzes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id: string) => {
        const response = await fetch(`/api/quizzes/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getQuestions: async (id: string) => {
        const response = await fetch(`/api/quizzes/${id}/questions`, {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    addQuestion: async (quizId: string, data: Record<string, unknown>) => {
        const response = await fetch(`/api/quizzes/${quizId}/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    updateQuestion: async (quizId: string, questionId: string, data: Record<string, unknown>) => {
        const response = await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deleteQuestion: async (quizId: string, questionId: string) => {
        const response = await fetch(`/api/quizzes/${quizId}/questions/${questionId}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    submit: async (id: string, answers: Array<{ soal_id: string; jawaban_user: number }>) => {
        const response = await fetch(`/api/quizzes/${id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ answers }),
        });
        return handleResponse(response);
    },
};
