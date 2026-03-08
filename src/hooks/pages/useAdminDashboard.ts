'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useDashboardStats } from '@/hooks/queries/useDashboardStats';

export function useAdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'results' | 'users'>('results');
    const { data: stats, isLoading } = useDashboardStats();

    const barData = {
        labels: ['Siswa', 'Materi', 'Kuis', 'Percobaan'],
        datasets: [
            {
                label: 'Jumlah Data',
                data: [
                    stats?.counts.totalUsers || 0,
                    stats?.counts.totalMaterials || 0,
                    stats?.counts.totalQuizzes || 0,
                    stats?.counts.totalAttempts || 0,
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                ],
                borderRadius: 8,
                borderSkipped: false as const,
            },
        ],
    };

    const doughnutData = {
        labels: ['Materi', 'Kuis'],
        datasets: [
            {
                data: [
                    stats?.counts.totalMaterials || 0,
                    stats?.counts.totalQuizzes || 0,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.9)',
                    'rgba(245, 158, 11, 0.9)',
                ],
                borderColor: 'white',
                borderWidth: 4,
                hoverOffset: 8,
            },
        ],
    };

    return {
        user,
        activeTab, setActiveTab,
        stats, isLoading,
        barData, doughnutData,
    };
}
