import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// In-memory rate limiting store
const resetAttempts = new Map<string, { count: number; firstAttempt: number }>();

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000; // 1 hour in ms
    const record = resetAttempts.get(email);

    if (!record) {
        resetAttempts.set(email, { count: 1, firstAttempt: now });
        return true;
    }

    // Reset counter if more than 1 hour has passed
    if (now - record.firstAttempt > hourMs) {
        resetAttempts.set(email, { count: 1, firstAttempt: now });
        return true;
    }

    // Block if 3 or more attempts within the hour
    if (record.count >= 3) {
        return false;
    }

    record.count += 1;
    return true;
}

// POST /api/auth/forgot-password - Verify email exists
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email wajib diisi' },
                { status: 400 }
            );
        }

        // Check rate limit
        if (!checkRateLimit(email.toLowerCase())) {
            return NextResponse.json(
                { message: 'Terlalu banyak percobaan. Coba lagi dalam 1 jam.' },
                { status: 429 }
            );
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { message: 'Email tidak ditemukan dalam sistem' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email ditemukan',
            userId: user._id,
        });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/auth/forgot-password - Reset password
export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email dan password baru wajib diisi' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password minimal 6 karakter' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return NextResponse.json(
                { message: 'Email tidak ditemukan' },
                { status: 404 }
            );
        }

        // Update password (will be hashed by pre-save hook)
        user.password = password;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password berhasil diubah',
        });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
