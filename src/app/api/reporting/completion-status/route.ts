import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Result from '@/models/Result';
import { requireAuth } from '@/lib/auth';

// GET /api/reporting/completion-status
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
        await connectDB();

        // Get all quizzes
        const quizzes = await Quiz.find({});

        // Get user's completed quizzes
        const completedResults = await Result.find({ user_id: user._id });
        const completedQuizIds = completedResults.map((r) => r.kuis_id.toString());

        // Map quiz status
        const quizStatus = quizzes.map((quiz) => ({
            quizId: quiz._id,
            judul: quiz.judul,
            tipe: quiz.tipe,
            isCompleted: completedQuizIds.includes(quiz._id.toString()),
            score: completedResults.find((r) => r.kuis_id.toString() === quiz._id.toString())?.skor || null,
        }));

        // Check if any pre-test is completed
        const hasCompletedPretest = quizStatus.some((q) => q.tipe === 'pre-test' && q.isCompleted);

        return NextResponse.json({
            quizStatus,
            hasCompletedPretest,
            canTakePosttest: hasCompletedPretest,
        });
    } catch (error) {
        console.error('Get completion status error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
