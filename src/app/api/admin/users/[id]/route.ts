import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Result from '@/models/Result';
import { requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// GET /api/admin/users/[id] - Get user by ID with quiz results
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { id } = await params;
        const user = await User.findById(id).select('-password');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Get user's quiz results
        const results = await Result.find({ user_id: id })
            .populate('kuis_id', 'judul tipe')
            .sort({ tanggal_selesai: -1 });

        return NextResponse.json({
            user,
            quizResults: results,
            totalAttempts: results.length,
            averageScore: results.length > 0
                ? Math.round(results.reduce((acc, r) => acc + r.skor, 0) / results.length * 100) / 100
                : 0,
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(request: NextRequest, { params }: { params: Params }) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { id } = await params;
        const { nama, email, sekolah, usia } = await request.json();

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        user.nama = nama || user.nama;
        user.email = email || user.email;
        user.sekolah = sekolah || user.sekolah;
        user.usia = usia || user.usia;

        const updatedUser = await user.save();

        return NextResponse.json({
            _id: updatedUser._id,
            nama: updatedUser.nama,
            email: updatedUser.email,
            role: updatedUser.role,
            sekolah: updatedUser.sekolah,
            usia: updatedUser.usia,
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { id } = await params;
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return NextResponse.json(
                { message: 'Cannot delete admin users' },
                { status: 400 }
            );
        }

        // Delete user's quiz results
        await Result.deleteMany({ user_id: id });

        // Delete user
        await user.deleteOne();

        return NextResponse.json({ message: 'User and associated data removed' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
