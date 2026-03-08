'use client';

import { useQuery } from '@tanstack/react-query';
import { quizzesApi } from '@/lib/api';
import type { Quiz, Question } from '@/types';

export const useQuizzes = () => {
    return useQuery({
        queryKey: ['quizzes'],
        queryFn: () => quizzesApi.getAll() as Promise<Quiz[]>,
    });
};

export const useQuizById = (id: string) => {
    return useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizzesApi.getById(id) as Promise<Quiz>,
        enabled: !!id,
    });
};

export const useQuestions = (quizId: string | null) => {
    return useQuery({
        queryKey: ['questions', quizId],
        queryFn: () => quizId ? quizzesApi.getQuestions(quizId) as Promise<Question[]> : Promise.resolve([]),
        enabled: !!quizId,
    });
};
