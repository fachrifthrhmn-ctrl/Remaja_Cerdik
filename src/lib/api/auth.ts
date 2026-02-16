import { getAuthHeader, handleResponse } from './base';

export const authApi = {
    login: async (email: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (userData: Record<string, unknown>) => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    getProfile: async () => {
        const response = await fetch('/api/auth/profile', {
            headers: { ...getAuthHeader() },
        });
        return handleResponse(response);
    },
};
