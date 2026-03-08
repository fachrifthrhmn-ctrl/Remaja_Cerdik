'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export function useLoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = await login(formData.email, formData.password);
            toast.success(`Selamat datang kembali, ${userData.nama}!`);
            if (userData.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return {
        showPassword, setShowPassword,
        loading, formData,
        handleSubmit, handleChange,
    };
}
