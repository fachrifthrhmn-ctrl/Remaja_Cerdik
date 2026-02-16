import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { requireAuth } from '@/lib/auth';

// GET /api/reporting/history - Get user quiz history
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

        const results = await Result.find({ user_id: user._id })
            .populate('kuis_id', 'judul tipe')
            .sort({ tanggal_selesai: -1 });

        return NextResponse.json(results);
    } catch (error) {
        console.error('Get history error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
