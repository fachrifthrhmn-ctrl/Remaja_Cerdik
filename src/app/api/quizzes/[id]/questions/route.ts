import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { requireAuth, requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// GET /api/quizzes/[id]/questions - Get questions for a quiz
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { id } = await params;

        // Exclude kunci_jawaban for security
        const questions = await Question.find({ kuis_id: id }).select('-kunci_jawaban');

        return NextResponse.json(questions);
    } catch (error) {
        console.error('Get questions error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// POST /api/quizzes/[id]/questions - Add question to quiz (Admin only)
export async function POST(request: NextRequest, { params }: { params: Params }) {
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

        // Check if quiz exists
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return NextResponse.json(
                { message: 'Quiz not found' },
                { status: 404 }
            );
        }

        const { pertanyaan, pilihan_ganda, kunci_jawaban } = await request.json();

        const question = await Question.create({
            kuis_id: id,
            pertanyaan,
            pilihan_ganda,
            kunci_jawaban,
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error('Add question error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
