import { getAuthHeader, handleResponse } from './base';

export const reportingApi = {
    getHistory: async () => {
        const response = await fetch('/api/reporting/history', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    checkPrerequisite: async (quizId: string) => {
        const response = await fetch(`/api/reporting/check-prerequisite/${quizId}`, {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getCompletionStatus: async () => {
        const response = await fetch('/api/reporting/completion-status', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getAdminRecap: async () => {
        const response = await fetch('/api/reporting/admin/recap', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },
};
