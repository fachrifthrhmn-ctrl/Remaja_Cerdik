'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LogoutModal from '@/components/shared/LogoutModal';
import {
    Menu,
    X,
    LogOut,
    User,
    BookOpen,
    BrainCircuit,
    Home,
    Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentNavbar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        router.push('/login');
    };

    const navLinks = [
        { path: '/student/dashboard', label: 'Beranda', icon: Home },
        { path: '/student/dashboard#about', label: 'Tentang', icon: Heart },
        { path: '/student/materials', label: 'Materi PTM', icon: BookOpen },
        { path: '/student/quizzes', label: 'Kuis', icon: BrainCircuit },
        { path: '/student/dashboard#health-tips', label: 'Tips Sehat', icon: Heart },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-[0_4px_20px_rgb(0,0,0,0.05)] py-2'
                    : 'bg-white py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/student/dashboard" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-transform">
                            <BookOpen size={18} fill="white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-[#1e4d7b] uppercase">
                            Remaja <span className="text-brand-blue">Cerdik</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.path}
                                className={`text-sm font-black transition-all ${isActive(link.path)
                                    ? 'text-brand-blue'
                                    : 'text-slate-400 hover:text-[#1e4d7b]'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Profile/Auth Section */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <Link href="/profile" className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-black">
                                    {user.nama?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-black text-[#1e4d7b]">{user.nama}</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2 bg-brand-blue text-white text-xs font-black rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-500 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-[#1e4d7b]"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-t border-slate-50 overflow-hidden"
                        >
                            <div className="px-6 py-8 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-sm font-black text-[#1e4d7b] py-2"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-slate-50">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 text-rose-500 font-bold text-sm"
                                    >
                                        <LogOut size={18} /> Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
            />
        </>
    );
};

export default StudentNavbar;
