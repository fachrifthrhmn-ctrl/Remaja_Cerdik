'use client';

import { useHistory } from '@/hooks/queries/useReports';

export function useStudentHistory() {
    const { data: history = [], isLoading } = useHistory();

    const averageScore = history.length > 0
        ? Math.round(history.reduce((acc, h) => acc + (h.skor ?? 0), 0) / history.length)
        : 0;

    const highestScore = history.length > 0
        ? Math.max(...history.map(h => h.skor ?? 0))
        : 0;

    const passedCount = history.filter(h => (h.skor ?? 0) >= 70).length;

    return {
        history, isLoading,
        averageScore, highestScore, passedCount,
    };
}
