import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/quizzes - Get all quizzes
export async function GET(request: NextRequest) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const quizzes = await Quiz.find({}).sort({ createdAt: -1 });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Get quizzes error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// POST /api/quizzes - Create quiz (Admin only)
export async function POST(request: NextRequest) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { judul, tipe, deskripsi } = await request.json();

        const quiz = await Quiz.create({
            judul,
            tipe,
            deskripsi,
        });

        return NextResponse.json(quiz, { status: 201 });
    } catch (error) {
        console.error('Create quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
