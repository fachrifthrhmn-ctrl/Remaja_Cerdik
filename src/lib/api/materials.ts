import { getAuthHeader, handleResponse } from './base';

export const materialsApi = {
    getAll: async () => {
        const response = await fetch('/api/education/materials', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    getById: async (id: string) => {
        const response = await fetch(`/api/education/materials/${id}`, {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },

    create: async (data: Record<string, unknown>) => {
        const response = await fetch('/api/education/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    update: async (id: string, data: Record<string, unknown>) => {
        const response = await fetch(`/api/education/materials/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    delete: async (id: string) => {
        const response = await fetch(`/api/education/materials/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },
};
