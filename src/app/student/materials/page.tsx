'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/shared/LoadingScreen';
import { useStudentMaterials } from '@/hooks/pages/useStudentMaterials';

export default function StudentMaterialsRedirect() {
    const router = useRouter();
    const { materials, isLoading } = useStudentMaterials();

    useEffect(() => {
        if (!isLoading) {
            if (materials.length > 0) {
                // Find PTM material specifically to ensure the hook always finds it
                const ptmMaterial = materials.find(m =>
                    m.judul.toLowerCase().includes('ptm') ||
                    m.judul.toLowerCase().includes('penyakit tidak menular')
                );

                if (ptmMaterial) {
                    router.replace(`/student/materials/${ptmMaterial._id}`);
                } else {
                    router.replace(`/student/materials/${materials[0]._id}`);
                }
            } else {
                // Return to dashboard if completely empty
                router.replace('/student/dashboard');
            }
        }
    }, [isLoading, materials, router]);

    return <LoadingScreen message="Menyiapkan materi PTM..." />;
}
