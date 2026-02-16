'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type Step = 'email' | 'reset' | 'success';

export default function ForgotPasswordPage() {
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

    // Step 1: Verify email
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

    // Step 2: Reset password
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

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#bbe9fa]/40 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#87d3f5]/40 rounded-full blur-[100px] opacity-60" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden relative z-10 border border-white p-10"
            >
                {/* Back to Login */}
                <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 text-sm font-bold">
                    <ArrowLeft size={16} />
                    Kembali ke Login
                </Link>

                <AnimatePresence mode="wait">
                    {/* Step 1: Email Verification */}
                    {step === 'email' && (
                        <motion.div
                            key="email"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-14 h-14 bg-[#bbe9fa]/30 rounded-2xl flex items-center justify-center mb-6">
                                <Mail className="text-[#2a9fd6]" size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 mb-2">Lupa Password?</h1>
                            <p className="text-slate-400 text-sm font-medium mb-8">
                                Masukkan email yang terdaftar untuk mereset password Anda.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="forgot-email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="forgot-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                        placeholder="nama@email.com"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white font-black rounded-2xl shadow-xl shadow-[#bbe9fa]/50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <span className="uppercase tracking-[0.2em] text-xs">Verifikasi Email</span>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 2: Reset Password */}
                    {step === 'reset' && (
                        <motion.div
                            key="reset"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-14 h-14 bg-[#bbe9fa]/30 rounded-2xl flex items-center justify-center mb-6">
                                <Lock className="text-[#2a9fd6]" size={28} />
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 mb-2">Reset Password</h1>
                            <p className="text-slate-400 text-sm font-medium mb-2">
                                Buat password baru untuk akun Anda.
                            </p>
                            <p className="text-[#2a9fd6] text-xs font-bold mb-8 bg-[#bbe9fa]/20 px-4 py-2 rounded-xl inline-block">
                                {email}
                            </p>

                            <form onSubmit={handleResetSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="new-password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                            placeholder="Minimal 6 karakter"
                                            minLength={6}
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

                                <div className="space-y-2">
                                    <label htmlFor="confirm-password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirm-password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-[#5bc0eb] focus:bg-white outline-none transition-all"
                                            placeholder="Masukkan ulang password"
                                            minLength={6}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-[#2a9fd6] hover:bg-[#1e8bc3] text-white font-black rounded-2xl shadow-xl shadow-[#bbe9fa]/50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShieldCheck size={18} />
                                            <span className="uppercase tracking-[0.2em] text-xs">Reset Password</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="w-full text-center text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                                >
                                    ← Kembali ke verifikasi email
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle className="text-emerald-500" size={40} />
                            </motion.div>
                            <h1 className="text-2xl font-black text-slate-800 mb-2">Berhasil!</h1>
                            <p className="text-slate-400 text-sm font-medium mb-6">
                                Password Anda telah berhasil diubah.<br />
                                Anda akan dialihkan ke halaman login...
                            </p>
                            <div className="w-8 h-8 border-3 border-[#bbe9fa] border-t-[#2a9fd6] rounded-full animate-spin mx-auto" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
