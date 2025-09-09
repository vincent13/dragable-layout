'use client';

import { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import { ProductsWidget } from '../custom-component/ProductsWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type WidgetItem = {
    id: string;
    config: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
    };
};

export default function EditorPage() {
    const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);

    const layoutId = '1'; // You can replace with searchParams if needed

    // Load layout from API
    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject('Layout not found')))
            .then((data) => {
                setLayouts(data);
                if (data.lg) {
                    setItems(
                        data.lg.map((l: Layout & { config?: WidgetItem['config'] }) => ({
                            id: l.i,
                            config: l.config ?? {},
                        }))
                    );
                }
            })
            .catch(() => {
                setLayouts({ lg: [] });
                setItems([]);
            });
    }, []);

    // Save layout to API
    const handleSave = async () => {
        const layoutsWithConfig = {
            ...layouts,
            lg: layouts.lg?.map((l) => {
                const widget = items.find((i) => i.id === l.i);
                return { ...l, config: widget?.config ?? {} };
            }),
        };

        await fetch(`/api/layout/${layoutId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(layoutsWithConfig),
        });

        alert('Layout saved!');
    };

    // Add new widget
    const handleAddWidget = () => {
        const newId = `widget-${items.length + 1}`;
        setItems([...items, { id: newId, config: {} }]);
        setLayouts({
            ...layouts,
            lg: [...(layouts.lg || []), { i: newId, x: 0, y: Infinity, w: 3, h: 6 }],
        });
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Editor</h2>
            <button onClick={handleSave} style={{ marginRight: '1rem' }}>
                Save
            </button>
            <button onClick={handleAddWidget}>Add Widget</button>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable
                isResizable
                verticalCompact={false}
                onLayoutChange={(_layout, allLayouts) => setLayouts(allLayouts)}
                preventCollision
                draggableCancel=".no-drag"
            >
                {items.map((widget) => (
                    <div key={widget.id} className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setItems(items.filter((i) => i.id !== widget.id));
                                setLayouts({
                                    ...layouts,
                                    lg: layouts.lg?.filter((l) => l.i !== widget.id) ?? [],
                                });
                            }}
                            className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 no-drag"
                        >
                            ✖
                        </button>

                        {/* ProductsWidget */}
                        <ProductsWidget
                            catalogOwnerId="1239"
                            title={widget.config.selectedTaxonName}
                            selectedTaxonId={widget.config.selectedTaxonId}
                            readOnly={false}
                            onChange={(taxonId, taxonName) =>
                                setItems(
                                    items.map((i) =>
                                        i.id === widget.id
                                            ? { ...i, config: { selectedTaxonId: taxonId, selectedTaxonName: taxonName } }
                                            : i
                                    )
                                )
                            }
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
