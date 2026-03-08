'use client';

import { useQuery } from '@tanstack/react-query';
import { reportingApi } from '@/lib/api';
import type { ReportResult, HistoryItem, CompletionData } from '@/types';

export const useReports = () => {
    return useQuery({
        queryKey: ['admin-reports'],
        queryFn: () => reportingApi.getAdminRecap() as Promise<ReportResult[]>,
    });
};

export const useHistory = () => {
    return useQuery({
        queryKey: ['student-history'],
        queryFn: () => reportingApi.getHistory() as Promise<HistoryItem[]>,
    });
};

export const useCompletionStatus = () => {
    return useQuery({
        queryKey: ['completion-status'],
        queryFn: () => reportingApi.getCompletionStatus() as Promise<CompletionData>,
    });
};
