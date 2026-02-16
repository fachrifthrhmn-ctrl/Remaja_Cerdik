import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import { requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string; questionId: string }>;

// PUT /api/quizzes/[id]/questions/[questionId]
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
        const { questionId } = await params;
        const { pertanyaan, pilihan_ganda, kunci_jawaban } = await request.json();

        const question = await Question.findById(questionId);

        if (!question) {
            return NextResponse.json(
                { message: 'Question not found' },
                { status: 404 }
            );
        }

        question.pertanyaan = pertanyaan || question.pertanyaan;
        question.pilihan_ganda = pilihan_ganda || question.pilihan_ganda;
        question.kunci_jawaban = kunci_jawaban !== undefined ? kunci_jawaban : question.kunci_jawaban;

        const updatedQuestion = await question.save();

        return NextResponse.json(updatedQuestion);
    } catch (error) {
        console.error('Update question error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/quizzes/[id]/questions/[questionId]
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
        const { questionId } = await params;
        const question = await Question.findById(questionId);

        if (!question) {
            return NextResponse.json(
                { message: 'Question not found' },
                { status: 404 }
            );
        }

        await question.deleteOne();

        return NextResponse.json({ message: 'Question removed' });
    } catch (error) {
        console.error('Delete question error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
