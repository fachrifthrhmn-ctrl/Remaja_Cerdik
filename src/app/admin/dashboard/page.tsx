'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    Users,
    BookOpen,
    Video,
    ClipboardList,
    TrendingUp,
    Award,
    Plus,
    ArrowRight,
    Sparkles,
    Activity,
    Calendar,
    GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Statistics {
    counts: {
        totalUsers: number;
        totalAdmins: number;
        totalMaterials: number;
        totalVideos: number;
        totalQuizzes: number;
        totalAttempts: number;
    };
    averageScore: number;
    recentResults: Array<{
        _id: string;
        skor: number;
        tanggal_selesai: string;
        user_id: { nama: string; email: string; sekolah: string };
        kuis_id: { judul: string; tipe: string };
    }>;
    recentUsers: Array<{
        _id: string;
        nama: string;
        email: string;
        sekolah: string;
        createdAt: string;
    }>;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'results' | 'users'>('results');

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            const data = await adminApi.getStatistics() as Statistics;
            setStats(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat statistik');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat data...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            icon: <Users size={24} />,
            label: 'Total Siswa',
            value: stats?.counts.totalUsers || 0,
            gradient: 'from-blue-500 to-cyan-400',
            shadowColor: 'shadow-blue-500/30'
        },
        {
            icon: <BookOpen size={24} />,
            label: 'Materi Edukasi',
            value: stats?.counts.totalMaterials || 0,
            gradient: 'from-emerald-500 to-teal-400',
            shadowColor: 'shadow-emerald-500/30'
        },
        {
            icon: <Video size={24} />,
            label: 'Video Pembelajaran',
            value: stats?.counts.totalVideos || 0,
            gradient: 'from-purple-500 to-violet-400',
            shadowColor: 'shadow-purple-500/30'
        },
        {
            icon: <ClipboardList size={24} />,
            label: 'Total Kuis',
            value: stats?.counts.totalQuizzes || 0,
            gradient: 'from-amber-500 to-orange-400',
            shadowColor: 'shadow-amber-500/30'
        },
        {
            icon: <TrendingUp size={24} />,
            label: 'Pengerjaan Kuis',
            value: stats?.counts.totalAttempts || 0,
            gradient: 'from-rose-500 to-pink-400',
            shadowColor: 'shadow-rose-500/30'
        },
        {
            icon: <Award size={24} />,
            label: 'Rata-rata Nilai',
            value: `${Math.round(stats?.averageScore || 0)}%`,
            gradient: 'from-indigo-500 to-blue-400',
            shadowColor: 'shadow-indigo-500/30'
        },
    ];

    // Chart Data
    const barData = {
        labels: ['Siswa', 'Materi', 'Video', 'Kuis', 'Percobaan'],
        datasets: [
            {
                label: 'Jumlah Data',
                data: [
                    stats?.counts.totalUsers || 0,
                    stats?.counts.totalMaterials || 0,
                    stats?.counts.totalVideos || 0,
                    stats?.counts.totalQuizzes || 0,
                    stats?.counts.totalAttempts || 0,
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                ],
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const doughnutData = {
        labels: ['Materi', 'Video', 'Kuis'],
        datasets: [
            {
                data: [
                    stats?.counts.totalMaterials || 0,
                    stats?.counts.totalVideos || 0,
                    stats?.counts.totalQuizzes || 0,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.9)',
                    'rgba(139, 92, 246, 0.9)',
                    'rgba(245, 158, 11, 0.9)',
                ],
                borderColor: 'white',
                borderWidth: 4,
                hoverOffset: 8,
            },
        ],
    };

    const quickActions = [
        { label: 'Tambah Materi', href: '/admin/materials', icon: <BookOpen size={18} />, color: 'bg-emerald-500 hover:bg-emerald-600' },
        { label: 'Tambah Video', href: '/admin/videos', icon: <Video size={18} />, color: 'bg-purple-500 hover:bg-purple-600' },
        { label: 'Kelola Kuis', href: '/admin/quizzes', icon: <ClipboardList size={18} />, color: 'bg-amber-500 hover:bg-amber-600' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20"
            >
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-purple-200 text-sm font-medium mb-2">
                        <Sparkles size={16} />
                        <span>Panel Administrator</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Selamat Datang, {user?.nama?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-purple-100 max-w-xl">
                        Kelola konten edukasi kesehatan remaja dan pantau perkembangan siswa dari dashboard ini.
                    </p>

                    {/* Quick Stats in Banner */}
                    <div className="flex flex-wrap gap-6 mt-6">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                            <Users size={20} />
                            <div>
                                <p className="text-2xl font-bold">{stats?.counts.totalUsers || 0}</p>
                                <p className="text-xs text-purple-200">Siswa Aktif</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                            <Activity size={20} />
                            <div>
                                <p className="text-2xl font-bold">{stats?.counts.totalAttempts || 0}</p>
                                <p className="text-xs text-purple-200">Kuis Dikerjakan</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                            <Award size={20} />
                            <div>
                                <p className="text-2xl font-bold">{Math.round(stats?.averageScore || 0)}%</p>
                                <p className="text-xs text-purple-200">Nilai Rata-rata</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl translate-y-1/2" />
                <GraduationCap className="absolute right-8 bottom-8 w-24 h-24 text-white/10" />
            </motion.div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={action.href}
                            className={`${action.color} text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95`}
                        >
                            <Plus size={16} />
                            {action.label}
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} rounded-2xl p-6 text-white shadow-xl ${stat.shadowColor} hover:scale-[1.02] transition-transform`}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                                <p className="text-4xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                        </div>
                        {/* Decorative circle */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500" />
                            Statistik Platform
                        </h3>
                        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                            Real-time
                        </span>
                    </div>
                    <div className="h-[300px] w-full">
                        <Bar
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                    legend: { display: false }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(0,0,0,0.05)' }
                                    },
                                    x: {
                                        grid: { display: false }
                                    }
                                }
                            }}
                            data={barData}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Award size={20} className="text-amber-500" />
                        Distribusi Konten
                    </h3>
                    <div className="h-[260px] w-full flex justify-center">
                        <Doughnut
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                cutout: '65%',
                                plugins: {
                                    legend: { position: 'bottom' as const }
                                }
                            }}
                            data={doughnutData}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity - Tabbed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {/* Tab Headers */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'results'
                                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <ClipboardList size={18} />
                            Hasil Kuis Terbaru
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'users'
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Users size={18} />
                            Siswa Terbaru
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-0">
                    {activeTab === 'results' && (
                        <div className="divide-y divide-gray-50">
                            {stats?.recentResults && stats.recentResults.length > 0 ? (
                                stats.recentResults.map((result) => (
                                    <div key={result._id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20">
                                                {result.user_id?.nama?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{result.user_id?.nama}</p>
                                                <p className="text-sm text-gray-500">{result.kuis_id?.judul}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-3 py-1.5 rounded-xl text-sm font-bold ${result.skor >= 70
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {result.skor} Poin
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                                                <Calendar size={12} />
                                                {new Date(result.tanggal_selesai).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-12">Belum ada hasil kuis</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="divide-y divide-gray-50">
                            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                                stats.recentUsers.map((user) => (
                                    <div key={user._id} className="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                                                {user.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{user.nama}</p>
                                                <p className="text-sm text-gray-500">{user.sekolah || user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-center py-12">Belum ada siswa terdaftar</p>
                            )}
                        </div>
                    )}
                </div>

                {/* View All Link */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <Link
                        href={activeTab === 'results' ? '/admin/reports' : '/admin/users'}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center justify-center gap-1 group"
                    >
                        Lihat Semua
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
