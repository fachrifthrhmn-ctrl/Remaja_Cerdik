import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// GET /api/auth/profile
export async function GET(request: NextRequest) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        const { user } = result;

        return NextResponse.json({
            _id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            sekolah: user.sekolah,
            usia: user.usia,
        });
    } catch (error) {
        console.error('Profile error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
