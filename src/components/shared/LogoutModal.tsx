'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X } from 'lucide-react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-0 flex items-center justify-center z-[201] p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Icon */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ rotate: -10 }}
                                    animate={{ rotate: 0 }}
                                    className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center"
                                >
                                    <LogOut className="text-red-500" size={32} />
                                </motion.div>
                            </div>

                            {/* Text */}
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-black text-slate-800 mb-2">Keluar dari Akun?</h3>
                                <p className="text-slate-400 text-sm font-medium">
                                    Apakah Anda yakin ingin keluar? Anda perlu login kembali untuk mengakses akun.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all active:scale-[0.97]"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                                >
                                    <LogOut size={16} />
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
