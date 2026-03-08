'use client';

interface LoadingScreenProps {
    message?: string;
    color?: string;
    fullScreen?: boolean;
}

export default function LoadingScreen({
    message = 'Memuat data...',
    color = 'border-purple-500',
    fullScreen = false,
}: LoadingScreenProps) {
    return (
        <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'h-[50vh]'}`}>
            <div className="flex flex-col items-center gap-4">
                <div className={`w-12 h-12 border-4 ${color} border-t-transparent rounded-full animate-spin`} />
                <p className={`font-medium ${fullScreen ? 'text-white/70' : 'text-gray-500'}`}>{message}</p>
            </div>
        </div>
    );
}
