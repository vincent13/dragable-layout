import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all themes
export async function GET() {
    try {
        const themes = await prisma.theme.findMany({
            orderBy: { updatedAt: "desc" },
        });
        return NextResponse.json(themes);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch themes" }, { status: 500 });
    }
}

// POST new theme
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, background, fontFamily, fontSize } = body;

        if (!name) {
            return NextResponse.json({ error: "Theme name is required" }, { status: 400 });
        }

        const theme = await prisma.theme.create({
            data: { name, background, fontFamily, fontSize },
        });

        return NextResponse.json(theme);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create theme" }, { status: 500 });
    }
}
