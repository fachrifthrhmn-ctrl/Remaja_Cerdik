'use client';

export const getAuthHeader = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};

    const user = localStorage.getItem('user');
    if (user) {
        try {
            const parsed = JSON.parse(user);
            return { Authorization: `Bearer ${parsed.token}` };
        } catch {
            return {};
        }
    }
    return {};
};

export async function handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}
