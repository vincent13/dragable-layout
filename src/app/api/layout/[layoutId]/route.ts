// src/app/api/layout/[layoutId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { loadLayout, saveLayout } from '@/app/services/database';

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ layoutId: string }> }
) {
    const { layoutId } = await context.params;

    const rawJson = await loadLayout(layoutId);

    if (!rawJson) {
        return NextResponse.json(
            { error: `No layout found for ID "${layoutId}"` },
            { status: 404 }
        );
    }

    try {
        const layout = JSON.parse(rawJson);
        return NextResponse.json(layout);
    } catch (err) {
        console.error('Failed to parse layout JSON:', err);
        return NextResponse.json(
            { error: 'Invalid layout JSON in database' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ layoutId: string }> }
) {
    const { layoutId } = await context.params;

    try {
        const layout = await req.json();
        const layoutJson = JSON.stringify(layout);

        await saveLayout(layoutId, layoutJson);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Failed to update layout:', err);
        return NextResponse.json(
            { error: 'Failed to update layout' },
            { status: 500 }
        );
    }
}
