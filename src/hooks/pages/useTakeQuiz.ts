'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { quizzesApi, reportingApi } from '@/lib/api';
import { useSubmitQuiz } from '@/hooks/mutations/useQuizMutations';
import toast from 'react-hot-toast';
import type { Quiz, Question, SubmitResult } from '@/types';

export function useTakeQuiz(quizId: string) {
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<SubmitResult | null>(null);
    const router = useRouter();

    const { data: quizData, isLoading: loadingQuiz, isError: isQuizError } = useQuery({
        queryKey: ['student-quiz', quizId],
        queryFn: async () => {
            const prereq = await reportingApi.checkPrerequisite(quizId) as { canTake: boolean; message: string };
            if (!prereq.canTake) {
                toast.error(prereq.message);
                router.push('/student/quizzes');
                throw new Error(prereq.message);
            }

            const [quiz, questions] = await Promise.all([
                quizzesApi.getById(quizId),
                quizzesApi.getQuestions(quizId),
            ]);
            return { quiz: quiz as Quiz, questions: questions as Question[] };
        },
        retry: false
    });

    const submitMutation = useSubmitQuiz();

    const handleAnswer = (questionId: string, answerIndex: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    };

    const handleSubmit = () => {
        const questions = quizData?.questions || [];
        if (Object.keys(answers).length !== questions.length) {
            toast.error('Harap jawab semua pertanyaan');
            return;
        }

        const formattedAnswers = Object.entries(answers).map(([soal_id, jawaban_user]) => ({
            soal_id,
            jawaban_user,
        }));
        submitMutation.mutate(
            { quizId, answers: formattedAnswers },
            {
                onSuccess: (data: any) => {
                    setResult(data as SubmitResult);
                    toast.success('Kuis berhasil diselesaikan!');
                }
            }
        );
    };

    const quiz = quizData?.quiz;
    const questions = quizData?.questions || [];

    return {
        answers, result,
        quiz, questions,
        loadingQuiz, isQuizError,
        submitMutation,
        handleAnswer, handleSubmit,
    };
}
