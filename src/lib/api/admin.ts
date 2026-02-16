import { getAuthHeader, handleResponse } from './base';

export const adminApi = {
    getStatistics: async () => {
        const response = await fetch('/api/admin/statistics', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getUsers: async () => {
        const response = await fetch('/api/admin/users', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getUserById: async (id: string) => {
        const response = await fetch(`/api/admin/users/${id}`, {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    updateUser: async (id: string, data: Record<string, unknown>) => {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deleteUser: async (id: string) => {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },
};
