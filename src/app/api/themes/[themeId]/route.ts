import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ themeId: string }> }
) {
    const { themeId } = await params;
    const theme = await prisma.theme.findUnique({ where: { id: themeId } });

    if (!theme) return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    return NextResponse.json(theme);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ themeId: string }> }
) {
    const { themeId } = await params;
    const body = await request.json();

    try {
        const updated = await prisma.theme.update({
            where: { id: themeId },
            data: {
                name: body.name,
                background: body.background,
                fontFamily: body.fontFamily,
                fontSize: body.fontSize,
            },
        });
        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ themeId: string }> }
) {
    const { themeId } = await params;
    try {
        await prisma.theme.delete({ where: { id: themeId } });
        return new Response(null, { status: 204 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete theme" }, { status: 500 });
    }
}
