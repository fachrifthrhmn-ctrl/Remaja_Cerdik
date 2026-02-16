import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import { requireAuth, requireAdmin } from '@/lib/auth';

// GET /api/education/materials - Get all materials
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
        const materials = await Material.find({}).sort({ tanggal_upload: -1 });

        return NextResponse.json(materials);
    } catch (error) {
        console.error('Get materials error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}

// POST /api/education/materials - Create material (Admin only)
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
        const { judul, kategori, konten_teks, url_gambar } = await request.json();

        const material = await Material.create({
            judul,
            kategori,
            konten_teks,
            url_gambar,
        });

        return NextResponse.json(material, { status: 201 });
    } catch (error) {
        console.error('Create material error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Server error' },
            { status: 500 }
        );
    }
}
