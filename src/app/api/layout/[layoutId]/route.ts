import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request, { params }: { params: Promise<{ layoutId: string }> }) {
    const { layoutId } = await params;
    const layout = await prisma.layout.findUnique({ where: { id: layoutId } });
    if (!layout) return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
    return NextResponse.json(layout);
}

export async function PUT(request: Request, { params }: { params: Promise<{ layoutId: string }> }) {
    const { layoutId } = await params;
    const body = await request.json();
    const lgData: Prisma.InputJsonValue = (body?.lg ?? []) as Prisma.InputJsonValue;
    const nameData: string = body?.name ?? 'Untitled Layout';
    const updatedLayout = await prisma.layout.update({
        where: { id: layoutId },
        data: { lg: lgData, name: nameData },
    });
    return NextResponse.json(updatedLayout);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ layoutId: string }> }) {
    const { layoutId } = await params;
    await prisma.layout.delete({ where: { id: layoutId } });
    return new Response(null, { status: 204 });
}
