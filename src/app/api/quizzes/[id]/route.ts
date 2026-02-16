import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Question from '@/models/Question';
import { requireAuth, requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// GET /api/quizzes/[id]
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
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return NextResponse.json(
                { message: 'Quiz not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Get quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/quizzes/[id]
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
        const { judul, tipe, deskripsi } = await request.json();

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return NextResponse.json(
                { message: 'Quiz not found' },
                { status: 404 }
            );
        }

        quiz.judul = judul || quiz.judul;
        quiz.tipe = tipe || quiz.tipe;
        quiz.deskripsi = deskripsi || quiz.deskripsi;

        const updatedQuiz = await quiz.save();

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        console.error('Update quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/quizzes/[id]
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
        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return NextResponse.json(
                { message: 'Quiz not found' },
                { status: 404 }
            );
        }

        // Delete all questions associated with this quiz
        await Question.deleteMany({ kuis_id: id });

        // Delete quiz
        await quiz.deleteOne();

        return NextResponse.json({ message: 'Quiz and associated questions removed' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
