'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Heart, ArrowRight, User, GraduationCap, School, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import GuestRoute from '@/components/shared/GuestRoute';
import { useRegisterForm } from '@/hooks/pages/useRegisterForm';

export default function RegisterPage() {
    return (
        <GuestRoute>
            <RegisterForm />
        </GuestRoute>
    );
}

function RegisterForm() {
    const {
        showPassword, setShowPassword,
        loading, formData,
        handleSubmit, handleChange,
    } = useRegisterForm();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 py-12">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 lg:p-12 relative z-10 border border-white">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-100 mx-auto mb-6 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <Heart size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Daftar Akun</h1>
                    <p className="text-slate-500 font-medium mt-2">Mulai perjalanan sehatmu hari ini.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="reg-nama" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                id="reg-nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                autoComplete="name"
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                placeholder="Tulis nama lengkap"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reg-email" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Sekolah / Pribadi</label>
                        <input
                            type="email"
                            id="reg-email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                            placeholder="nama@sekolah.sch.id"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="reg-kelas" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Kelas</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                    <School size={18} />
                                </span>
                                <select
                                    id="reg-kelas"
                                    name="kelas"
                                    value={formData.kelas}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Pilih Kelas</option>
                                    <option value="10">Kelas 10</option>
                                    <option value="11">Kelas 11</option>
                                    <option value="12">Kelas 12</option>
                                </select>
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                    <ChevronDown size={18} />
                                </span>
                            </div>
                        </div>

                        {formData.kelas === '11' && (
                            <div className="space-y-2">
                                <label htmlFor="reg-jurusan" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jurusan</label>
                                <div className="relative">
                                    <select
                                        id="reg-jurusan"
                                        name="jurusan"
                                        value={formData.jurusan}
                                        onChange={handleChange}
                                        className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                        required={formData.kelas === '11'}
                                    >
                                        <option value="" disabled>Pilih Jurusan</option>
                                        <optgroup label="IPA">
                                            <option value="IPA 1">IPA 1</option>
                                            <option value="IPA 2">IPA 2</option>
                                            <option value="IPA 3">IPA 3</option>
                                            <option value="IPA 4">IPA 4</option>
                                            <option value="IPA 5">IPA 5</option>
                                            <option value="IPA 6">IPA 6</option>
                                        </optgroup>
                                        <optgroup label="IPS">
                                            <option value="IPS 1">IPS 1</option>
                                            <option value="IPS 2">IPS 2</option>
                                            <option value="IPS 3">IPS 3</option>
                                            <option value="IPS 4">IPS 4</option>
                                        </optgroup>
                                        <optgroup label="Bahasa">
                                            <option value="Bahasa 1">Bahasa 1</option>
                                        </optgroup>
                                    </select>
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                        <ChevronDown size={18} />
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="reg-usia" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Usia</label>
                            <input
                                type="number"
                                id="reg-usia"
                                name="usia"
                                value={formData.usia}
                                onChange={handleChange}
                                autoComplete="bday-age"
                                className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                placeholder="15"
                                required
                                min="10"
                                max="25"
                            />
                        </div>

                        <div className={`space-y-2 ${formData.kelas !== '11' ? 'col-span-2' : ''}`}>
                            <label htmlFor="reg-jk" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Jenis Kelamin</label>
                            <div className="relative">
                                <select
                                    id="reg-jk"
                                    name="jenis_kelamin"
                                    value={formData.jenis_kelamin}
                                    onChange={handleChange}
                                    className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Pilih Gender</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                    <ChevronDown size={18} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="reg-password" title="Password" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="reg-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-700 font-bold placeholder:text-slate-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                                placeholder="Min. 6 karakter"
                                required
                                minLength={6}
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
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 mt-4 active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="uppercase tracking-[0.2em] text-xs">Buat Akun Sekarang</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 font-bold text-sm">
                        Sudah punya akun? {' '}
                        <Link href="/login" className="text-emerald-600 hover:underline">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
