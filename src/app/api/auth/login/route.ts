import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

// POST /api/auth/login
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            return NextResponse.json({
                _id: user._id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            });
        } else {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
