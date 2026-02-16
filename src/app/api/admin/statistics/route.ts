import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Material from '@/models/Material';
import Video from '@/models/Video';
import Quiz from '@/models/Quiz';
import Result from '@/models/Result';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/statistics - Get admin dashboard statistics
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

        // Count totals
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalMaterials = await Material.countDocuments({});
        const totalVideos = await Video.countDocuments({});
        const totalQuizzes = await Quiz.countDocuments({});
        const totalAttempts = await Result.countDocuments({});

        // Calculate average score
        const scoreAggregate = await Result.aggregate([
            {
                $group: {
                    _id: null,
                    averageScore: { $avg: '$skor' },
                },
            },
        ]);

        const averageScore = scoreAggregate.length > 0
            ? Math.round(scoreAggregate[0].averageScore * 100) / 100
            : 0;

        // Get recent activity (last 5)
        const recentResults = await Result.find({})
            .populate('user_id', 'nama email sekolah')
            .populate('kuis_id', 'judul tipe')
            .sort({ tanggal_selesai: -1 })
            .limit(5);

        const recentUsers = await User.find({ role: 'user' })
            .select('nama email sekolah createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            counts: {
                totalUsers,
                totalAdmins,
                totalMaterials,
                totalVideos,
                totalQuizzes,
                totalAttempts,
            },
            averageScore,
            recentResults,
            recentUsers,
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
