'use client';

import { useEffect, useState } from 'react';
import { reportingApi } from '@/lib/api';
import { BarChart3, Search, Calendar, Award, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Result {
    _id: string;
    skor: number;
    tanggal_selesai: string;
    user_id: { nama: string; email: string; sekolah: string };
    kuis_id: { judul: string; tipe: string };
}

export default function ManageReports() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { loadResults(); }, []);

    const loadResults = async () => {
        try {
            const data = await reportingApi.getAdminRecap() as Result[];
            setResults(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gagal memuat laporan');
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(r =>
        r.user_id?.nama?.toLowerCase().includes(search.toLowerCase()) ||
        r.kuis_id?.judul?.toLowerCase().includes(search.toLowerCase())
    );

    // Calculate stats
    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.skor, 0) / results.length)
        : 0;
    const passCount = results.filter(r => r.skor >= 70).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Memuat laporan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Laporan Hasil Kuis</h1>
                    <p className="text-gray-500 mt-1">Lihat semua hasil pengerjaan kuis siswa</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <BarChart3 size={24} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{results.length}</p>
                            <p className="text-sm text-gray-500">Total Hasil</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Award size={24} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{avgScore}%</p>
                            <p className="text-sm text-gray-500">Rata-rata Skor</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <TrendingUp size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{passCount}</p>
                            <p className="text-sm text-gray-500">Lulus (≥70%)</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama siswa atau kuis..."
                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Siswa</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sekolah</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kuis</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipe</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Skor</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredResults.map((result) => (
                                <tr key={result._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                {result.user_id?.nama?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{result.user_id?.nama}</p>
                                                <p className="text-sm text-gray-500">{result.user_id?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{result.user_id?.sekolah}</td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{result.kuis_id?.judul}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.kuis_id?.tipe === 'pre-test'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {result.kuis_id?.tipe}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${result.skor >= 70 ? 'text-emerald-600' : 'text-orange-500'}`}>
                                            {result.skor}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(result.tanggal_selesai).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredResults.length === 0 && (
                    <div className="text-center py-16">
                        <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">Tidak ada data yang ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
