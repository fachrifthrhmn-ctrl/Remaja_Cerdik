import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

// POST /api/auth/register
export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { nama, email, password, role, sekolah, usia } = await request.json();

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            nama,
            email,
            password,
            role: role || 'user',
            sekolah,
            usia,
        });

        if (user) {
            return NextResponse.json({
                _id: user._id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            }, { status: 201 });
        } else {
            return NextResponse.json(
                { message: 'Invalid user data' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
