'use client';

import { useState } from 'react';
import LogoutModal from '@/components/shared/LogoutModal';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    School,
    Calendar,
    Save,
    Shield,
    GraduationCap,
    LogOut,
    ChevronLeft,
    Heart,
    Camera
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProfileContent() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [formData, setFormData] = useState({
        nama: user?.nama || '',
        email: user?.email || '',
        sekolah: user?.sekolah || '',
        usia: user?.usia?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        toast.success('Berhasil keluar!');
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // In a real app, you would call an API to update the profile here
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Profil berhasil diperbarui!');
        setIsEditing(false);
        setLoading(false);
    };

    const isAdmin = user?.role === 'admin';

    if (!user) return null;

    return (
        <>
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header / Navigation */}
                <div className="flex items-center justify-between mb-12">
                    <Link
                        href={isAdmin ? "/admin/dashboard" : "/student/dashboard"}
                        className="flex items-center gap-2 text-slate-400 hover:text-brand-blue font-black uppercase text-xs tracking-widest transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <ChevronLeft size={18} />
                        </div>
                        Kembali ke Dashboard
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Heart className="text-white" size={20} fill="white" />
                        </div>
                        <span className="text-sm font-black text-[#1e4d7b] uppercase tracking-tighter">Profil Akun</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-16">
                    <div className="relative group">
                        <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl rotate-3 group-hover:rotate-0 transition-transform ${isAdmin ? 'bg-purple-500 shadow-purple-200' : 'bg-brand-blue shadow-blue-200'
                            }`}>
                            {user?.nama?.charAt(0).toUpperCase()}
                        </div>
                        <button className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-xl text-brand-blue hover:text-blue-600 transition-colors border-2 border-slate-50">
                            <Camera size={20} />
                        </button>
                    </div>

                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-[#1e4d7b] tracking-tight">{user?.nama}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isAdmin
                                ? 'bg-purple-50 border-purple-100 text-purple-600'
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                }`}>
                                {isAdmin ? 'Administrator' : 'Siswa Cerdik'}
                            </span>
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-100 text-slate-400">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Information Column */}
                    <div className="lg:col-span-2">
                        <div className="play-card p-10 border-2 border-slate-50">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-[#1e4d7b] flex items-center gap-3 uppercase">
                                    <User size={24} className="text-brand-blue" /> Info Personal
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-xs font-black text-brand-blue uppercase tracking-widest hover:underline"
                                >
                                    {isEditing ? 'Batal' : 'Edit Profil'}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label htmlFor="profile-nama" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Nama Lengkap</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="text"
                                                id="profile-nama"
                                                name="nama"
                                                value={formData.nama}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                autoComplete="name"
                                                className={`w-full h-14 border-2 rounded-2xl pl-12 pr-6 text-sm font-bold transition-all ${isEditing
                                                    ? 'bg-white border-brand-blue ring-4 ring-blue-50'
                                                    : 'bg-slate-50 border-transparent opacity-70'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="profile-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="email"
                                                id="profile-email"
                                                name="email"
                                                value={formData.email}
                                                disabled
                                                autoComplete="email"
                                                className="w-full h-14 bg-slate-100 border-2 border-transparent rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    {!isAdmin && (
                                        <>
                                            <div className="space-y-3">
                                                <label htmlFor="profile-sekolah" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Sekolah</label>
                                                <div className="relative">
                                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                    <input
                                                        type="text"
                                                        id="profile-sekolah"
                                                        name="sekolah"
                                                        value={formData.sekolah}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        autoComplete="organization"
                                                        className={`w-full h-14 border-2 rounded-2xl pl-12 pr-6 text-sm font-bold transition-all ${isEditing
                                                            ? 'bg-white border-brand-blue ring-4 ring-blue-50'
                                                            : 'bg-slate-50 border-transparent opacity-70'
                                                            }`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label htmlFor="profile-usia" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Usia (Tahun)</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                    <input
                                                        type="number"
                                                        id="profile-usia"
                                                        name="usia"
                                                        value={formData.usia}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                        autoComplete="bday-age"
                                                        className={`w-full h-14 border-2 rounded-2xl pl-12 pr-6 text-sm font-bold transition-all ${isEditing
                                                            ? 'bg-white border-brand-blue ring-4 ring-blue-50'
                                                            : 'bg-slate-50 border-transparent opacity-70'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {isEditing && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-play-green !w-full md:!w-fit justify-center shadow-emerald-200 mt-4"
                                    >
                                        <Save size={20} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Settings Column */}
                    <div className="space-y-6">
                        <div className="play-card p-8 bg-slate-50 border-none">
                            <h3 className="text-xl font-black text-[#1e4d7b] mb-6 uppercase tracking-tight flex items-center gap-2">
                                <Shield size={20} className="text-brand-orange" /> Keamanan
                            </h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Akun</p>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        Aktif
                                    </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 px-6 bg-white hover:bg-rose-50 border-2 border-rose-50 hover:border-rose-100 rounded-2xl flex items-center justify-between text-rose-500 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-widest">Keluar Akun</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {!isAdmin && (
                            <div className="play-card p-8 bg-blue-50 border-2 border-blue-100 relative overflow-hidden">
                                <Heart className="text-brand-blue mb-4" fill="currentColor" size={32} />
                                <h3 className="text-xl font-black text-[#1e4d7b]">Progress Belajar</h3>
                                <p className="text-xs font-bold text-blue-800/60 mt-2 italic">Kamu hebat! Teruslah belajar untuk masa depan cerah.</p>

                                <div className="mt-8 space-y-4 relative z-10">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-[#1e4d7b]/40 tracking-widest">
                                        <span>Materi Selesai</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="h-4 w-full bg-white rounded-full p-1 border border-blue-100">
                                        <div className="h-full bg-brand-blue rounded-full w-[85%] shadow-inner shadow-black/5" />
                                    </div>
                                </div>

                                <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-blue-100/50" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </>
    );
}

import { Sparkles } from 'lucide-react';
