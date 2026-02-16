import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Result from '@/models/Result';
import { requireAuth } from '@/lib/auth';

type Params = Promise<{ id: string }>;

interface AnswerSubmission {
    soal_id: string;
    jawaban_user: number;
}

// POST /api/quizzes/[id]/submit - Submit quiz answers
export async function POST(request: NextRequest, { params }: { params: Params }) {
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
        const { id } = await params;
        const { answers } = await request.json() as { answers: AnswerSubmission[] };

        // Validate answers array
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return NextResponse.json(
                { message: 'Answers array is required' },
                { status: 400 }
            );
        }

        const questions = await Question.find({ kuis_id: id });

        if (!questions || questions.length === 0) {
            return NextResponse.json(
                { message: 'Quiz/Questions not found' },
                { status: 404 }
            );
        }

        const totalQuestions = questions.length;

        // Check if user answered all questions
        if (answers.length !== totalQuestions) {
            return NextResponse.json(
                { message: `You must answer all ${totalQuestions} questions. You provided ${answers.length} answers.` },
                { status: 400 }
            );
        }

        // Create map for faster lookup
        const questionMap: Record<string, number> = {};
        questions.forEach((q) => {
            questionMap[q._id.toString()] = q.kunci_jawaban;
        });

        let correctCount = 0;
        const detailJawaban: { soal_id: string; jawaban_user: number }[] = [];

        // Calculate score
        answers.forEach((ans) => {
            const correctAns = questionMap[ans.soal_id];
            if (correctAns !== undefined && correctAns === ans.jawaban_user) {
                correctCount++;
            }
            detailJawaban.push({
                soal_id: ans.soal_id,
                jawaban_user: ans.jawaban_user,
            });
        });

        const score = (correctCount / totalQuestions) * 100;

        // Save Result
        const quizResult = await Result.create({
            user_id: user._id,
            kuis_id: id,
            skor: score,
            detail_jawaban_user: detailJawaban,
        });

        return NextResponse.json({
            message: 'Quiz submitted successfully',
            score,
            totalQuestions,
            correctCount,
            resultId: quizResult._id,
        }, { status: 201 });
    } catch (error) {
        console.error('Submit quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
