'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    History,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Heart,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoutModal from '@/components/shared/LogoutModal';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
    { href: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/student/materials', label: 'Materi', icon: <BookOpen size={20} /> },
    { href: '/student/quizzes', label: 'Kuis', icon: <ClipboardList size={20} /> },
    { href: '/student/history', label: 'Riwayat', icon: <History size={20} /> },
    { href: '/student/profile', label: 'Profil Saya', icon: <GraduationCap size={20} /> },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Heart size={24} className="text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">RemajaCerdik</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
                >
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {(sidebarOpen || typeof window !== 'undefined') && (
                    <>
                        {/* Mobile Backdrop */}
                        {sidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="lg:hidden fixed inset-0 z-40 bg-black/60"
                                onClick={() => setSidebarOpen(false)}
                            />
                        )}

                        {/* Sidebar Content */}
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: sidebarOpen ? 0 : -280 }}
                            className={`fixed lg:translate-x-0 lg:static top-0 left-0 z-50 w-[280px] h-screen glass border-r border-white/10 flex flex-col transition-transform duration-300 ${!sidebarOpen ? 'lg:translate-x-0 -translate-x-full' : ''
                                }`}
                            style={{ transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'translateX(0)' : undefined }}
                        >
                            {/* Logo */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                        <Heart size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">RemajaCerdik</h1>
                                        <p className="text-xs text-white/50">Belajar Kesehatan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {studentNavItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {item.icon}
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Health Tips */}
                            <div className="p-4">
                                <div className="glass rounded-xl p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap size={18} className="text-emerald-400" />
                                        <span className="text-sm font-medium text-emerald-300">Tips Sehat</span>
                                    </div>
                                    <p className="text-xs text-white/60">
                                        Minum air putih minimal 8 gelas sehari untuk menjaga tubuh tetap terhidrasi! 💧
                                    </p>
                                </div>
                            </div>

                            {/* User Info & Logout */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex items-center gap-3 mb-4 px-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                        {user?.nama?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{user?.nama}</p>
                                        <p className="text-xs text-white/50 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowLogoutModal(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span>Keluar</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="lg:ml-[280px] min-h-screen pt-16 lg:pt-0">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => { logout(); setShowLogoutModal(false); }}
            />
        </div>
    );
}
