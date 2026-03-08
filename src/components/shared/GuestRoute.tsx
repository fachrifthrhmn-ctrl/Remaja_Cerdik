'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function GuestRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/student/dashboard');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <LoadingScreen fullScreen message="Loading..." />;
    }

    if (user) {
        return <LoadingScreen fullScreen message="Redirecting..." />;
    }

    return <>{children}</>;
}
