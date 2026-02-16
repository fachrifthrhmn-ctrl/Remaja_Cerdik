'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Heart, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#bbe9fa]/40 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#87d3f5]/40 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden relative z-10 border border-white">
                {/* Left Side - Visual Column */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#bbe9fa] via-[#87d3f5] to-[#5bc0eb] text-slate-800 relative">
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-12 group">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-black uppercase tracking-tight">Remaja Cerdik</span>
                        </Link>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-extrabold leading-tight">
                                Mari Kita Mulai <br /> Gaya Hidup Sehat.
                            </h2>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-sm">
                                Edukasi kesehatan interaktif untuk mencegah penyakit tidak menular sejak dini demi masa depan cerah.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 grid gap-4">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <div className="w-10 h-10 bg-[#2a9fd6] rounded-xl flex items-center justify-center shadow-lg">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Informasi Terverifikasi</h4>
                                <p className="text-xs text-slate-500">Materi disusun oleh ahli medis</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Circle */}
                    <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                </div>

                {/* Right Side - Form Column */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 lg:hidden flex justify-center">
                        <div className="w-12 h-12 bg-[#2a9fd6] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Heart size={24} />
                        </div>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Selamat Datang</h1>
                        <p className="text-slate-500 font-medium">Silakan masuk untuk melanjutkan pembelajaran.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="login-email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                id="login-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label htmlFor="login-password" title="Password" className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                                <Link href="/forgot-password" className="text-[10px] font-black text-[#2a9fd6] uppercase tracking-widest hover:underline">Lupa Password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="login-password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white font-black rounded-2xl shadow-xl shadow-[#bbe9fa]/50 hover:shadow-[#87d3f5]/50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="uppercase tracking-[0.2em] text-xs">Masuk Sekarang</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <p className="text-slate-400 font-bold text-sm">
                            Belum memiliki akun? {' '}
                            <Link href="/register" className="text-[#2a9fd6] hover:underline">
                                Daftar Gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
