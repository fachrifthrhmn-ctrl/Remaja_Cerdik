import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Question from '@/models/Question';
import Result from '@/models/Result';
import Quiz from '@/models/Quiz';
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

        // Validate answers array (allow empty if they didn't answer anything)
        if (!answers || !Array.isArray(answers)) {
            return NextResponse.json(
                { message: 'Answers array is required' },
                { status: 400 }
            );
        }

        // Check if user already submitted this quiz
        const existingResult = await Result.findOne({ user_id: user._id, kuis_id: id });
        if (existingResult) {
            return NextResponse.json(
                { message: 'Anda sudah mengerjakan kuis ini sebelumnya.' },
                { status: 400 }
            );
        }

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
        }
        
        let targetKuisId = id;
        if (quiz.tipe === 'post-test') {
            const preTest = await Quiz.findOne({ tipe: 'pre-test' });
            if (preTest) {
                targetKuisId = preTest._id.toString();
            }
        }

        const questions = await Question.find({ kuis_id: targetKuisId });

        if (!questions || questions.length === 0) {
            return NextResponse.json(
                { message: 'Quiz/Questions not found' },
                { status: 404 }
            );
        }

        const totalQuestions = questions.length;

        // Validasi dihapus agar user bisa mengumpulkan / auto-submit meskipun ada soal yang belum dijawab.

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
