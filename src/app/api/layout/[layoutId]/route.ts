import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface LayoutItem {
    id: string;
    name: string;
    value?: string | number | boolean | null;
}

export interface UpdateLayoutBody {
    lg?: LayoutItem[];
    name?: string;
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ layoutId: string }> }
) {
    const { layoutId } = await params;
    const layout = await prisma.layout.findUnique({ where: { id: layoutId } });
    if (!layout) return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
    return NextResponse.json(layout);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ layoutId: string }> }
) {
    const { layoutId } = await params;
    const body = await request.json();

    console.log(
        'PUT /api/layout/[layoutId]',
        JSON.stringify({ layoutId, body }, null, 2)
    );

    if (!layoutId) {
        return NextResponse.json({ error: 'Missing layoutId' }, { status: 400 });
    }

    const updatedLayout = await prisma.layout.update({
        where: { id: layoutId },
        data: {
            name: body.name ?? 'Untitled Layout',
            lg: body.lg ?? [],
        },
    });

    return NextResponse.json(updatedLayout);
}



export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ layoutId: string }> }
) {
    const { layoutId } = await params;
    await prisma.layout.delete({ where: { id: layoutId } });
    return new Response(null, { status: 204 });
}
