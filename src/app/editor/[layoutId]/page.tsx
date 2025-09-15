'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { v4 as uuidv4 } from 'uuid';
import { ProductsWidget } from '../../custom-component/ProductsWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type LayoutItem = {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    config?: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
    };
};

type LayoutsState = {
    lg: LayoutItem[];
};

type WidgetItem = {
    id: string;
    config: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
    };
};

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const layoutId = params?.layoutId as string;
    const isNewLayout = layoutId === 'new';

    const [layoutName, setLayoutName] = useState('Untitled Layout');
    const [layouts, setLayouts] = useState<LayoutsState>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isNewLayout) {
            setLayouts({ lg: [] });
            setItems([]);
            setLayoutName('Untitled Layout');
            setLoading(false);
            return;
        }

        if (!layoutId) return;

        fetch(`/api/layout/${layoutId}`)
            .then(res => res.ok ? res.json() : Promise.reject('Layout not found'))
            .then(data => {
                setLayoutName(data.name);
                setLayouts({ lg: data.lg });
                setItems(
                    data.lg.map((l: LayoutItem) => ({
                        id: l.i,
                        config: l.config ?? {},
                    }))
                );
            })
            .catch(() => {
                setLayouts({ lg: [] });
                setItems([]);
            })
            .finally(() => setLoading(false));
    }, [layoutId, isNewLayout]);

    const handleSave = async () => {
        const layoutsWithConfig = {
            ...layouts,
            lg: layouts.lg.map(l => {
                const widget = items.find(i => i.id === l.i);
                return { ...l, config: widget?.config ?? {} };
            }),
        };

        if (isNewLayout) {
            const res = await fetch('/api/layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: layoutName,
                    lg: layoutsWithConfig.lg,
                }),
            });

            if (!res.ok) {
                alert('Failed to create layout');
                return;
            }

            const created = await res.json();
            router.replace(`/editor/${created.id}`);
        } else {
            const res = await fetch(`/api/layout/${layoutId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: layoutName,
                    lg: layoutsWithConfig.lg,
                }),
            });

            if (!res.ok) {
                alert('Failed to update layout');
                return;
            }
        }

        alert('Layout saved!');
    };

    const handleAddWidget = () => {
        const newId = `widget-${uuidv4()}`;
        setItems([...items, { id: newId, config: {} }]);
        setLayouts({
            ...layouts,
            lg: [...layouts.lg, { i: newId, x: 0, y: Infinity, w: 3, h: 6 }],
        });
    };

    if (loading) return <div>Loading layout...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div className="mb-4 flex gap-2">
                <input
                    type="text"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    className="border px-2 py-1 rounded flex-1"
                />
                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                <button onClick={handleAddWidget} className="px-3 py-1 bg-green-600 text-white rounded">Add Widget</button>
            </div>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable
                isResizable
                verticalCompact={false}
                onLayoutChange={(_layout, allLayouts) => setLayouts(allLayouts as LayoutsState)}
                preventCollision
                draggableCancel=".no-drag"
            >
                {items.map(widget => (
                    <div key={widget.id} className="relative">
                        <button
                            onClick={e => {
                                e.stopPropagation();
                                setItems(items.filter(i => i.id !== widget.id));
                                setLayouts({ ...layouts, lg: layouts.lg.filter(l => l.i !== widget.id) });
                            }}
                            className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 no-drag"
                        >
                            ✖
                        </button>
                        <ProductsWidget
                            catalogOwnerId="1239"
                            title={widget.config.selectedTaxonName}
                            selectedTaxonId={widget.config.selectedTaxonId}
                            readOnly={false}
                            onChange={(taxonId, taxonName) => setItems(
                                items.map(i => i.id === widget.id ? { ...i, config: { selectedTaxonId: taxonId, selectedTaxonName: taxonName } } : i)
                            )}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
