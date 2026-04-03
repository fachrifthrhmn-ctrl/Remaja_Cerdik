import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

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
            kelas: user.kelas,
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

// PUT /api/auth/profile
export async function PUT(request: NextRequest) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { nama, kelas, usia } = await request.json();

        const updated = await User.findByIdAndUpdate(
            result.user._id,
            { nama, kelas, usia: Number(usia) },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json({
            _id: updated._id,
            nama: updated.nama,
            email: updated.email,
            role: updated.role,
            kelas: updated.kelas,
            usia: updated.usia,
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
