'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export function useRegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        password: '',
        sekolah: '',
        usia: '',
    });

    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = await register({
                nama: formData.nama,
                email: formData.email,
                password: formData.password,
                sekolah: formData.sekolah,
                usia: parseInt(formData.usia),
            });
            toast.success(`Akun berhasil dibuat! Selamat datang, ${userData.nama}!`);
            router.push('/student/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat pendaftaran');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return {
        showPassword, setShowPassword,
        loading, formData,
        handleSubmit, handleChange,
    };
}
