'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import Link from 'next/link';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from "@/app/custom-component/Widget";

const ResponsiveGridLayout = WidthProvider(Responsive);


export default function EditorPage() {
    const layoutId = '1'; // optionally make this dynamic later
    const [layouts, setLayouts] = useState<Layouts | null>(null);
    const [items, setItems] = useState<string[]>(['a', 'b']); // track widget IDs

    const handleRemoveWidget = (id: string) => { //remove widget
        if (!layouts) return;

        // Remove from items
        const updatedItems = items.filter((item) => item !== id);

        // Remove from layout
        const updatedLayouts: Layouts = {
            ...layouts,
            lg: (layouts.lg || []).filter((item) => item.i !== id),
        };

        setItems(updatedItems);
        setLayouts(updatedLayouts);
    };
    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Layout not found');
                return res.json();
            })
            .then((data) => {
                setLayouts(data);
                // If layout contains keys, sync items
                if (data.lg) {
                    setItems(data.lg.map((item: Layout) => item.i));
                }
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

    const handleAddWidget = () => {
        if (!layouts) return;

        const newId = `widget-${items.length + 1}`;
        const newItem: Layout = {
            i: newId,
            x: 0,
            y: Infinity, // places at the bottom
            w: 3,
            h: 2,
        };

        const updatedLayouts: Layouts = {
            ...layouts,
            lg: [...(layouts.lg || []), newItem],
        };

        setItems([...items, newId]);
        setLayouts(updatedLayouts);
    };

    if (!layouts) return <p>Loading editor...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Layout Editor</h2>

            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleSave} style={{ marginRight: '1rem' }}>
                    Save Layout
                </button>
                <button onClick={handleAddWidget} style={{ marginRight: '1rem' }}>
                    Add Widget
                </button>
                <Link href={`/viewer?layoutId=${layoutId}`}>
                    <button>View Layout</button>
                </Link>
            </div>

            <ResponsiveGridLayout
                style={{}}
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable={true}
                isResizable={true}
                verticalCompact={false}
                onLayoutChange={handleLayoutChange}
                draggableCancel=".no-drag, .no-drag *"
            >
                {items.map((key) => (
                    <div key={key}>
                        <Widget id={key} title={key} onRemove={handleRemoveWidget} />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
