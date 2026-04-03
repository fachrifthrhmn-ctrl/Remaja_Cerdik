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

    // ─── Session Timeout (paling ringan) ──────────────────────────────────
    useEffect(() => {
        if (!user) return; // hanya aktif saat user sudah login

        const TIMEOUT_MS = 30 * 60 * 1000; // 30 menit
        let timer: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                // Hapus sesi dan redirect ke login
                setUser(null);
                localStorage.removeItem('user');
                document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                router.push('/login');
            }, TIMEOUT_MS);
        };

        // Hanya 2 event paling ringan — tidak pakai mousemove/scroll
        window.addEventListener('click', resetTimer);
        window.addEventListener('keydown', resetTimer);
        resetTimer(); // mulai timer saat pertama kali login

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [user, router]);

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
