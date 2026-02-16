'use client';

import ProfileContent from '@/components/shared/ProfileContent';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function ProfilePage() {
    return (
        <ProtectedRoute allowedRoles={['user', 'admin']}>
            <ProfileContent />
        </ProtectedRoute>
    );
}
