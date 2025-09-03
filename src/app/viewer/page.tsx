'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Widget from "@/app/custom-component/Widget";

const ResponsiveGridLayout = WidthProvider(Responsive);

function ViewerContent() {
    const [layouts, setLayouts] = useState<Layouts | null>(null);
    const searchParams = useSearchParams();
    const layoutId = searchParams.get('layoutId') ?? '';

    useEffect(() => {
        if (!layoutId) return;
        fetch(`/api/layout/${layoutId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Layout not found');
                return res.json();
            })
            .then((data: Layouts) => setLayouts(data))
            .catch((err) => {
                console.error(err);
            });
    }, [layoutId]);

    if (!layoutId) {
        return <p style={{ padding: 16 }}>No layoutId provided in URL.</p>;
    }
    if (!layouts) {
        return <p style={{ padding: 16 }}>Loading layout...</p>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Layout Viewer</h2>
            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable={false}
                isResizable={false}
                verticalCompact={false}
                preventCollision={true}
            >
                {layouts.lg.map((item) => (
                    <div key={item.i}>
                        <Widget id={item.i} title={item.i} />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}

export default function ViewerPage() {
    return (
        <Suspense fallback={<p style={{ padding: 16 }}>Loading viewer...</p>}>
            <ViewerContent />
        </Suspense>
    );
}
