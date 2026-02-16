'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ChevronRight,
    Play,
} from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
    stats: {
        materials: number;
        quizzes: number;
        completed: number;
    };
    itemVariants: any;
}

const Hero = ({ stats, itemVariants }: HeroProps) => {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center pt-32 pb-16 overflow-hidden bg-gradient-to-b from-[#f0f9ff] to-white">
            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-flutter" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 animate-flutter" style={{ animationDelay: '2s' }} />

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="text-center lg:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-black text-[#1e4d7b] leading-[1.1] mb-6 drop-shadow-sm">
                            Yuk Kenali <br />
                            <span className="text-[#4fb2f0]">Penyakit Tidak</span> <br />
                            <span className="text-[#7dc24c]">Menular</span> Sejak Remaja!
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Ayo mulai hidup sehat dari sekarang untuk masa depan yang lebih gemilang bersama Remaja Cerdik.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4"
                    >
                        <Link
                            href="/student/materials"
                            className="btn-play-green group"
                        >
                            <span>Mulai Belajar</span>
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/student/quizzes"
                            className="btn-play-orange group"
                        >
                            <span>Tes Pengetahuan</span>
                            <Play className="w-5 h-5 fill-current" />
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Main Hero Illustration */}
                    <div className="relative z-10 animate-flutter">
                        <div className="relative aspect-[4/3] w-full max-w-[600px] mx-auto overflow-hidden rounded-[3rem] shadow-2xl shadow-blue-200/50 border-8 border-white">
                            <Image
                                src="/illustrations/hero.png"
                                alt="Dua siswa cerdik"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#fbb03b] rounded-3xl -rotate-12 z-0 opacity-20" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7dc24c] rounded-[2.5rem] rotate-12 z-0 opacity-10" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
