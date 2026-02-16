import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout>{children}</AdminLayout>
        </ProtectedRoute>
    );
}
