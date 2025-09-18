// File: src/app/api/getLayoutForScreen/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const screenId = searchParams.get('screenId');

    // Fetch from your Screens table (replace with your DB query)
    const screens = [
        { screenId: 'screen1', layoutId: 'cmfo3hpdt0000hl5wx3rc0hyu' },
        { screenId: 'screen2', layoutId: 'cmflat5ks0000hlssi9ye1ilu' },
        { screenId: 'screen3', layoutId: 'cmflat5ks0000hlssi9ye1ilu' },
        { screenId: 'screen4', layoutId: 'cmflat5ks0000hlssi9ye1ilu' },
    ];

    const screen = screens.find((s) => s.screenId === screenId);

    return NextResponse.json({ layoutId: screen?.layoutId ?? null });
}
