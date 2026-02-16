import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import { requireAuth, requireAdmin } from '@/lib/auth';

type Params = Promise<{ id: string }>;

// GET /api/education/materials/[id]
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
        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json(
                { message: 'Material not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(material);
    } catch (error) {
        console.error('Get material error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// PUT /api/education/materials/[id]
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
        const { judul, kategori, konten_teks, url_gambar } = await request.json();

        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json(
                { message: 'Material not found' },
                { status: 404 }
            );
        }

        material.judul = judul || material.judul;
        material.kategori = kategori || material.kategori;
        material.konten_teks = konten_teks || material.konten_teks;
        material.url_gambar = url_gambar || material.url_gambar;

        const updatedMaterial = await material.save();

        return NextResponse.json(updatedMaterial);
    } catch (error) {
        console.error('Update material error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/education/materials/[id]
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
        const material = await Material.findById(id);

        if (!material) {
            return NextResponse.json(
                { message: 'Material not found' },
                { status: 404 }
            );
        }

        await material.deleteOne();

        return NextResponse.json({ message: 'Material removed' });
    } catch (error) {
        console.error('Delete material error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
