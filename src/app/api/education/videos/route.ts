import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/education/videos - Get all videos
export async function GET(request: NextRequest) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const videos = await Video.find({}).sort({ tanggal_upload: -1 });

        return NextResponse.json(videos);
    } catch (error) {
        console.error('Get videos error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// POST /api/education/videos - Create video (Admin only)
export async function POST(request: NextRequest) {
    try {
        const result = await requireAdmin(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { judul, url_video, deskripsi, durasi } = await request.json();

        const video = await Video.create({
            judul,
            url_video,
            deskripsi,
            durasi,
        });

        return NextResponse.json(video, { status: 201 });
    } catch (error) {
        console.error('Create video error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
