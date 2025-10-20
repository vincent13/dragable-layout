import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const layouts = await prisma.layout.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(layouts);
}

export async function POST(req: Request) {
    const body = await req.json();
    const newLayout = await prisma.layout.create({
        data: {
            name: body.name ?? 'Untitled Layout',
            lg: body.lg ?? []
        }
    });
    return NextResponse.json(newLayout);
}
