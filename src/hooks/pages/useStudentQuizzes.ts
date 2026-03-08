'use client';

import { useQuizzes } from '@/hooks/queries/useQuizzes';
import { useCompletionStatus } from '@/hooks/queries/useReports';
import type { Quiz } from '@/types';

export function useStudentQuizzes() {
    const { data: quizzes = [], isLoading: loadingQuizzes } = useQuizzes();
    const { data: completionData, isLoading: loadingCompletion } = useCompletionStatus();

    const isLoading = loadingQuizzes || loadingCompletion;

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

    const completedCount = completionData?.quizStatus.filter(q => q.isCompleted).length || 0;
    const totalQuizzes = quizzes.length;
    const progressPercent = totalQuizzes > 0 ? Math.round((completedCount / totalQuizzes) * 100) : 0;

    const completedQuizzes = completionData?.quizStatus.filter(q => q.isCompleted && q.score !== null) || [];
    const avgScore = completedQuizzes.length > 0
        ? Math.round(completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes.length)
        : 0;

    const pretests = quizzes.filter(q => q.tipe === 'pre-test');
    const posttests = quizzes.filter(q => q.tipe === 'post-test');

    return {
        quizzes, completionData, isLoading,
        getQuizStatus, canTakeQuiz,
        completedCount, totalQuizzes, progressPercent,
        avgScore, pretests, posttests,
    };
}
