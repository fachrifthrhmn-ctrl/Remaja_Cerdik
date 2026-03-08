'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useReports } from '@/hooks/queries/useReports';
import { useResetUserQuiz } from '@/hooks/mutations/useReportMutations';
import { useDebounceSearch } from '@/hooks/useDebounceSearch';

export function useManageReports() {
    const { search, setSearch, debouncedSearch } = useDebounceSearch();
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetTarget, setResetTarget] = useState<{ userId: string; nama: string } | null>(null);

    const { data: results = [], isLoading } = useReports();
    const resetMutation = useResetUserQuiz();

    const openResetModal = (userId: string, nama: string) => {
        setResetTarget({ userId, nama });
        setShowResetModal(true);
    };

    const handleResetQuiz = () => {
        if (!resetTarget) return;
        resetMutation.mutate(resetTarget.userId, {
            onSuccess: (data: any) => {
                toast.success(`${data.deletedCount || 0} hasil kuis ${resetTarget?.nama} berhasil direset`);
                setShowResetModal(false);
                setResetTarget(null);
            }
        });
    };

    const filteredResults = results.filter(r =>
        r.user_id?.nama?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.kuis_id?.judul?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.skor, 0) / results.length)
        : 0;
    const passCount = results.filter(r => r.skor >= 70).length;

    const uniqueUsers = Array.from(
        new Map(results.map(r => [r.user_id?._id, r.user_id])).values()
    ).filter(Boolean);

    return {
        search, setSearch,
        showResetModal, setShowResetModal,
        resetTarget,
        results, isLoading,
        resetMutation,
        filteredResults, avgScore, passCount, uniqueUsers,
        openResetModal, handleResetQuiz,
    };
}
