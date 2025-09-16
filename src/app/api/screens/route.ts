import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const screens = await prisma.screens.findMany();
        return NextResponse.json(screens);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch screens' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params:  Promise<{ screenId: string }> }
) {
    const { screenId } = await params;
    const body = await request.json();
    const { layoutId } = body;

    try {
        const updatedScreen = await prisma.screens.update({
            where: { screenId },
            data: { layoutId },
            include: { layout: true }, // optional: return associated layout
        });
        return NextResponse.json(updatedScreen);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update screen' }, { status: 500 });
    }
}
