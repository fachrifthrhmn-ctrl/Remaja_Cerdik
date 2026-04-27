import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/auth/me - Verify token and return current user
export async function GET(request: NextRequest) {
    try {
        const authUser = await getUserFromRequest(request);

        if (!authUser) {
            return NextResponse.json(
                { message: 'Not authorized, token failed' },
                { status: 401 }
            );
        }

        await connectDB();
        const user = await User.findById(authUser._id);

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            _id: user._id,
            nama: user.nama,
            email: user.email,
            role: user.role,
            kelas: user.kelas,
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
