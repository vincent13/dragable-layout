'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import Link from 'next/link';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from '@/app/custom-component/Widget';
import { ProductsWidget } from '../custom-component/ProductsWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

type WidgetItem = {
    id: string;
    type: 'products';
    config?: {
        selectedTaxonId?: number;
        selectedTaxonName?: string; // store the name too
    };
};

export default function EditorPage() {
    const layoutId = '1'; // optionally make this dynamic later
    const [layouts, setLayouts] = useState<Layouts | null>(null);
    const [items, setItems] = useState<WidgetItem[]>([]);

    // Load existing layout from API
    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Layout not found');
                return res.json();
            })
            .then((data) => {
                setLayouts(data);
                if (data.lg) {
                    setItems(
                        data.lg.map(
                            (item: Layout & { config?: { selectedTaxonId?: number } }) => ({
                                id: item.i,
                                type: 'products',
                                config: item.config ?? {}, // <-- restore selectedTaxonId here
                            })
                        )
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                setLayouts({ lg: [] }); // fallback empty layout
            });
    }, []);

    const handleRemoveWidget = (id: string) => {
        if (!layouts) return;

        // Remove from items
        const updatedItems = items.filter((item) => item.id !== id);

        // Remove from layout
        const updatedLayouts: Layouts = {
            ...layouts,
            lg: (layouts.lg || []).filter((item) => item.i !== id),
        };

        setItems(updatedItems);
        setLayouts(updatedLayouts);
    };

    const handleLayoutChange = (_layout: Layout[], allLayouts: Layouts) => {
        setLayouts(allLayouts);
    };

    const handleSave = async () => {
        if (!layouts) return;

        // Merge layout positions with widget config
        const layoutsWithConfig = {
            ...layouts,
            lg: layouts.lg?.map((l) => {
                const widget = items.find((i) => i.id === l.i);
                return {
                    ...l,
                    config: widget?.config ?? {},
                };
            }),
        };

        try {
            const res = await fetch(`/api/layout/${layoutId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(layoutsWithConfig),
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
            y: Infinity, // place at bottom
            w: 3,
            h: 6,
        };

        const updatedLayouts: Layouts = {
            ...layouts,
            lg: [...(layouts.lg || []), newItem],
        };

        setItems([...items, { id: newId, type: 'products' }]);
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
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable
                isResizable
                verticalCompact={false}
                onLayoutChange={handleLayoutChange}
                draggableCancel=".no-drag, .no-drag *"
            >
                {items.map((item) => (
                    <div key={item.id}>
                        <Widget
                            id={item.id}
                            title={item.config?.selectedTaxonName ?? item.id} // show taxon name if available
                            onRemove={handleRemoveWidget}
                        >
                            <ProductsWidget
                                catalogOwnerId="1239"
                                selectedTaxonId={item.config?.selectedTaxonId}
                                onChange={(taxonId, taxonName) => {
                                    setItems(items.map((w) =>
                                        w.id === item.id
                                            ? {
                                                ...w,
                                                config: {
                                                    ...w.config,
                                                    selectedTaxonId: taxonId,
                                                    selectedTaxonName: taxonName // store the name
                                                }
                                            }
                                            : w
                                    ));
                                }}
                                readOnly={false} // editor mode
                            />
                        </Widget>
                    </div>
                ))}
            </ResponsiveGridLayout>

        </div>
    );
}
