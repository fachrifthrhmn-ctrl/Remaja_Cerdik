'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: ('user' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!allowedRoles.includes(user.role)) {
                // Redirect to appropriate dashboard based on role
                if (user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/student/dashboard');
                }
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) {
        return <LoadingScreen fullScreen message="Loading..." />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
