import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
    request: Request,
    { params }: { params: Promise<{ screenId: number }> }
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

export async function PUT(request: Request, context: { params: Promise<{ screenId: number }> }) {
    const { params } = context;
    const { screenId: screenIdStr } = await params; // await here
    const screenId = Number(screenIdStr);

    if (isNaN(screenId)) {
        return NextResponse.json({ error: 'Invalid screenId' }, { status: 400 });
    }

    const body = await request.json();
    const { layoutId } = body;

    try {
        const updatedScreen = await prisma.screens.update({
            where: { screenId },
            data: { layoutId },
            include: { layout: true },
        });
        return NextResponse.json(updatedScreen);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to update screen' }, { status: 500 });
    }
}


