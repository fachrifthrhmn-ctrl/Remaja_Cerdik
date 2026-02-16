import ProtectedRoute from '@/components/shared/ProtectedRoute';
import StudentNavbar from '@/components/layout/StudentNavbar';

export default function StudentRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute allowedRoles={['user']}>
            <div className="min-h-screen bg-[#f8fafc]">
                <StudentNavbar />
                <main className="pt-16">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
