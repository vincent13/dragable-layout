'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import Link from 'next/link';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function EditorPage() {
    const layoutId = '1'; // optionally make this dynamic later
    const [layouts, setLayouts] = useState<Layouts | null>(null);

    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Layout not found');
                return res.json();
            })
            .then((data) => {
                setLayouts(data);
            })
            .catch((err) => {
                console.error(err);
                setLayouts({ lg: [] }); // fallback empty layout
            });
    }, []);

    const handleLayoutChange = (_layout: Layout[], allLayouts: Layouts) => {
        setLayouts(allLayouts);
    };

    const handleSave = async () => {
        if (!layouts) return;

        try {
            const res = await fetch(`/api/layout/${layoutId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(layouts),
            });

            if (!res.ok) throw new Error('Failed to save layout');
            console.log('Layout saved!');
        } catch (err) {
            console.error('Save failed:', err);
        }
    };

    if (!layouts) return <p>Loading editor...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Layout Editor</h2>

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleSave} style={{ marginRight: '1rem' }}>
                    Save Layout
                </button>
                <Link href={`/pages/viewer?layoutId=${layoutId}`}>
                    <button>View Layout</button>
                </Link>
            </div>

            <ResponsiveGridLayout
                style={{ padding: '1rem', border: '1px solid black' }}
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable={true}
                isResizable={true}
                verticalCompact={false}
                onLayoutChange={handleLayoutChange}
            >
                <div key="a">Widget A</div>
                <div key="b">Widget B</div>
            </ResponsiveGridLayout>
        </div>
    );
}
