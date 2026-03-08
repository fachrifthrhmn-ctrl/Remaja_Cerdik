import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Result from '@/models/Result';
import { requireAdmin } from '@/lib/auth';

// DELETE /api/reporting/admin/reset/[userId] - Reset all quiz results for a user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        const { userId } = await params;

        await connectDB();

        const deleteResult = await Result.deleteMany({ user_id: userId });

        return NextResponse.json({
            message: `${deleteResult.deletedCount} hasil kuis berhasil direset`,
            deletedCount: deleteResult.deletedCount,
        });
    } catch (error) {
        console.error('Reset quiz error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
