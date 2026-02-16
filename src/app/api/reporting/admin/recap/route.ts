import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { requireAdmin } from '@/lib/auth';

// GET /api/reporting/admin/recap - Get all students results
export async function GET(request: NextRequest) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();

        const results = await Result.find({})
            .populate('user_id', 'nama email sekolah')
            .populate('kuis_id', 'judul tipe')
            .sort({ tanggal_selesai: -1 });

        return NextResponse.json(results);
    } catch (error) {
        console.error('Get admin recap error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
