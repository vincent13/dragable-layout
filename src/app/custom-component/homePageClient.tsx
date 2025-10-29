'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import LayoutCell from './layoutCell';


type Layout = {
    id: string;
    name: string;
};

export default function HomePageClient() {
    const [layouts, setLayouts] = useState<Layout[]>([]);
    // const [color, setColor] = useState("#e3b26a");
    const fetchLayouts = async () => {
        try {
            const res = await fetch('/api/layout');
            if (!res.ok) throw new Error('Failed to fetch layouts');
            const data: Layout[] = await res.json();
            setLayouts(data);
        } catch (err) {
            console.error(err);
            setLayouts([]);
        }
    };

    useEffect(() => {
        fetchLayouts();
    }, []);

    const handleDeleted = (id: string) => {
        setLayouts(layouts.filter(l => l.id !== id));
    };

    return (
        <>
            <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/editor/new" className="border p-4 rounded shadow text-center font-bold">
                    + New Layout
                </Link>

                {layouts.map(layout => (
                    <LayoutCell
                        key={layout.id}
                        layoutId={layout.id}
                        layoutname={layout.name}
                        onDeleted={handleDeleted}/>
                ))}
            </div>
        </>
    );
}
