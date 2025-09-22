// File: src/app/api/getLayoutForScreen/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust path to your prisma client

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const screenId = searchParams.get('screenId');

        if (!screenId) {
            return NextResponse.json({ error: 'screenId is required' }, { status: 400 });
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
