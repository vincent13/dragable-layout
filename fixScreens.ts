import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const screens = await prisma.screens.findMany();

    for (const screen of screens) {
        let updated = false;
        const updates: any = {};

        // Fix screenId: must be a string, generate a new one if missing
        if (!screen.screenId || typeof screen.screenId !== 'string') {
            updates.screenId = String(screen.screenId ?? '') || require('crypto').randomUUID();
            updated = true;
        }

        // Fix name: must be non-empty string
        if (!screen.name || typeof screen.name !== 'string') {
            updates.name = 'Unnamed Screen';
            updated = true;
        }

        // layoutId: must be string or null
        if (screen.layoutId !== null && typeof screen.layoutId !== 'string') {
            updates.layoutId = String(screen.layoutId);
            updated = true;
        }

        if (updated) {
            console.log(`Fixing screen ${screen.screenId} → updates:`, updates);
            await prisma.screens.update({
                where: { screenId: screen.screenId },
                data: updates,
            });
        }
    }

    console.log('All screens fixed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
