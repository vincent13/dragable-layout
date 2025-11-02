import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const screenIdParam = searchParams.get('screenId');

        if (!screenIdParam) {
            return NextResponse.json({ error: 'screenId is required' }, { status: 400 });
        }

        const screenId = Number(screenIdParam);
        if (isNaN(screenId)) {
            return NextResponse.json({ error: 'Invalid screenId' }, { status: 400 });
        }

        const screen = await prisma.screens.findUnique({
            where: { screenId },
            select: { layoutId: true },
        });

        return NextResponse.json({ layoutId: screen?.layoutId ?? null });
    } catch (err) {
        console.error('Error fetching layout for screen:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
