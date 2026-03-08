'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User, RegisterData, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: set cookie (client-side)
function setCookie(name: string, value: string, days = 30) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try {
                    const parsed = JSON.parse(savedUser) as User;

                    // Validate token via API
                    const res = await fetch('/api/auth/me', {
                        headers: { Authorization: `Bearer ${parsed.token}` },
                    });

                    if (res.ok) {
                        const freshData = await res.json();
                        // Update user data from server but keep the token
                        const updatedUser = { ...freshData, token: parsed.token };
                        setUser(updatedUser);
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        setCookie('auth-token', parsed.token);
                    } else {
                        // Token invalid → auto-logout
                        localStorage.removeItem('user');
                        removeCookie('auth-token');
                    }
                } catch {
                    localStorage.removeItem('user');
                    removeCookie('auth-token');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setCookie('auth-token', data.token);
        return data;
    };

    const register = async (userData: RegisterData): Promise<User> => {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setCookie('auth-token', data.token);
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        removeCookie('auth-token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
