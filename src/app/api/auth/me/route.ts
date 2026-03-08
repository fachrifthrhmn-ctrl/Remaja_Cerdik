import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/auth/me - Verify token and return current user
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json(
                { message: 'Not authorized, token failed' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            _id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            sekolah: user.sekolah,
            usia: user.usia,
        });
    } catch (error) {
        console.error('Auth me error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
