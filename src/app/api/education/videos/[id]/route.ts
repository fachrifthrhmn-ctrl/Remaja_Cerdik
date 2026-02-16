import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { requireAuth, requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// GET /api/education/videos/[id]
export async function GET(request: NextRequest, { params }: { params: Params }) {
    try {
        const result = await requireAuth(request);

        if ('error' in result) {
            return NextResponse.json(
                { message: result.error },
                { status: result.status }
            );
        }

        await connectDB();
        const { id } = await params;
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json(
                { message: 'Video not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(video);
    } catch (error) {
        console.error('Get video error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/education/videos/[id]
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
        const { id } = await params;
        const { judul, url_video, deskripsi, durasi } = await request.json();

        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json(
                { message: 'Video not found' },
                { status: 404 }
            );
        }

        video.judul = judul || video.judul;
        video.url_video = url_video || video.url_video;
        video.deskripsi = deskripsi || video.deskripsi;
        video.durasi = durasi || video.durasi;

        const updatedVideo = await video.save();

        return NextResponse.json(updatedVideo);
    } catch (error) {
        console.error('Update video error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/education/videos/[id]
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
        const { id } = await params;
        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json(
                { message: 'Video not found' },
                { status: 404 }
            );
        }

        await video.deleteOne();

        return NextResponse.json({ message: 'Video removed' });
    } catch (error) {
        console.error('Delete video error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
