import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
    request: Request,
    { params }: { params: Promise<{ screenId: string }> }
) {
    const { screenId } = await params;

    const screen = await prisma.screens.findUnique({
        where: { screenId },       // must match model field
        include: { layout: true }, // fetch associated layout
    });

    if (!screen) {
        return NextResponse.json({ error: 'Screen not found' }, { status: 404 });
    }

    return NextResponse.json(screen);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ screenId: string }>  }
) {
    const { screenId } = await params;
    const body = await request.json();
    const { layoutId } = body;

    const updatedScreen = await prisma.screens.update({
        where: { screenId },
        data: { layoutId },
        include: { layout: true }, // return the associated layout too
    });

    return NextResponse.json(updatedScreen);
}
