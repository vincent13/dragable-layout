'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Layout = {
    id: string;
    name: string;
};

export default function DynamicEditorNav() {
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const pathname = usePathname();

    // Extract layoutId from the current URL
    const pathSegments = pathname?.split('/') || [];
    const currentLayoutId = pathSegments[2] || null; // '/editor/<layoutId>' or '/viewer/<layoutId>'

    useEffect(() => {
        fetch('/api/layout')
            .then(res => res.json())
            .then(setLayouts)
            .catch(err => {
                console.error('Failed to fetch layouts:', err);
                setLayouts([]);
            });
    }, []);

    // Find the current layout from the list
    const currentLayout = layouts.find(l => l.id === currentLayoutId);

    return (
        <nav className="flex gap-4 items-center">
            <Link href="/">Home</Link>
            <Link href="/editor/new">New Layout</Link>

            {currentLayout && (
                <Link href={`/viewer/${currentLayout.id}`}>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded">
                    View
                    </div>
                </Link>
            )}
        </nav>
    );
}
