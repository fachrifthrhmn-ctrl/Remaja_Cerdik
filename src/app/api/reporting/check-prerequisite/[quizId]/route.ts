import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Quiz from '@/models/Quiz';
import Result from '@/models/Result';
import { requireAuth } from '@/lib/auth';

type Params = Promise<{ quizId: string }>;

// GET /api/reporting/check-prerequisite/[quizId]
export async function GET(request: NextRequest, { params }: { params: Params }) {
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
        const { quizId } = await params;

        // Get the quiz to check its type
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return NextResponse.json(
                { message: 'Quiz not found' },
                { status: 404 }
            );
        }

        // If this is a pre-test, no prerequisite needed
        if (quiz.tipe === 'pre-test') {
            return NextResponse.json({
                canTake: true,
                message: 'Pre-test can be taken anytime',
            });
        }

        // If this is a post-test, check if user has completed ANY pre-test
        const completedPretest = await Result.findOne({
            user_id: user._id,
        }).populate({
            path: 'kuis_id',
            match: { tipe: 'pre-test' },
        });

        const hasCompletedPretest = completedPretest && completedPretest.kuis_id !== null;

        if (hasCompletedPretest) {
            return NextResponse.json({
                canTake: true,
                message: 'Prerequisite met: Pre-test completed',
            });
        } else {
            return NextResponse.json({
                canTake: false,
                message: 'Anda harus menyelesaikan Pre-test terlebih dahulu sebelum mengerjakan Post-test',
            });
        }
    } catch (error) {
        console.error('Check prerequisite error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
