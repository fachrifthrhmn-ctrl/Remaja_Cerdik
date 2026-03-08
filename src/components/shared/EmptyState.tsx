'use client';

import { LucideIcon, LayoutGrid } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon: Icon = LayoutGrid, message, action }: EmptyStateProps) {
    return (
        <div className="text-center py-16">
            <Icon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">{message}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 text-blue-600 font-bold text-sm underline"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
