'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconBgColor?: string;
    iconColor?: string;
    delay?: number;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    iconBgColor = 'bg-blue-100',
    iconColor = 'text-blue-600',
    delay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                    <Icon size={24} className={iconColor} />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}
