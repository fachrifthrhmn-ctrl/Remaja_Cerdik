'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Step = 'email' | 'reset' | 'success';

export function useForgotPassword() {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success('Email ditemukan! Silakan atur password baru.');
            setStep('reset');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Password tidak cocok!');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: formData.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success('Password berhasil diubah!');
            setStep('success');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return {
        step, setStep,
        loading,
        showPassword, setShowPassword,
        showConfirmPassword, setShowConfirmPassword,
        email, setEmail,
        formData, setFormData,
        handleEmailSubmit, handleResetSubmit,
    };
}
