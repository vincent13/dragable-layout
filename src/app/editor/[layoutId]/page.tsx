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
        taxonAlias?: string;
        columns?: number;
    };
};

type LayoutsState = { lg: LayoutItem[] };

type WidgetItem = {
    id: string;
    config: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
        taxonAlias?: string;
        columns?: number;
    };
};

type Screen = { screenId: string; name: string; layoutId: string };

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const layoutId = params?.layoutId as string;
    const isNewLayout = layoutId === 'new';

    const [layoutName, setLayoutName] = useState('Untitled Layout');
    const [layouts, setLayouts] = useState<LayoutsState>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);
    const [screens, setScreens] = useState<Screen[]>([]);
    const [selectedScreen, setSelectedScreen] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/screens').then(res => res.json()).then(setScreens).catch(() => setScreens([]));
    }, []);

    useEffect(() => {
        if (isNewLayout) {
            setLayouts({ lg: [] });
            setItems([]);
            setLayoutName('Untitled Layout');
            setSelectedScreen(null);
            setLoading(false);
            return;
        }

        if (!layoutId) return;

        fetch(`/api/layout/${layoutId}`)
            .then(res => (res.ok ? res.json() : Promise.reject('Layout not found')))
            .then(data => {
                setLayoutName(data.name);
                setLayouts({ lg: data.lg });
                setItems(
                    data.lg.map((l: LayoutItem) => ({
                        id: l.i,
                        config: {
                            ...l.config,
                            columns: Array.isArray(l.config?.columns) ? l.config.columns[0] : l.config?.columns ?? 1,
                        },
                    }))
                );
                const linkedScreen = screens.find(s => s.layoutId === layoutId);
                setSelectedScreen(linkedScreen ? linkedScreen.screenId : null);
            })
            .catch(() => {
                setLayouts({ lg: [] });
                setItems([]);
            })
            .finally(() => setLoading(false));
    }, [layoutId, isNewLayout, screens]);

    const handleSave = async () => {
        const layoutsWithConfig = {
            ...layouts,
            lg: layouts.lg.map(l => {
                const widget = items.find(i => i.id === l.i);
                return {
                    ...l,
                    config: {
                        selectedTaxonId: widget?.config?.selectedTaxonId,
                        selectedTaxonName: widget?.config?.selectedTaxonName,
                        taxonAlias: widget?.config?.taxonAlias,
                        columns: widget?.config?.columns ?? 1,
                    },
                };
            }),
        };

        let createdLayout;
        if (isNewLayout) {
            const res = await fetch('/api/layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: layoutName, lg: layoutsWithConfig.lg }),
            });
            if (!res.ok) return alert('Failed to create layout');
            createdLayout = await res.json();
            router.replace(`/editor/${createdLayout.id}`);
        } else {
            const res = await fetch(`/api/layout/${layoutId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: layoutName, lg: layoutsWithConfig.lg }),
            });
            if (!res.ok) return alert('Failed to update layout');
            createdLayout = await res.json();
        }

        if (selectedScreen) {
            await fetch(`/api/screens/${selectedScreen}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ layoutId: createdLayout.id }),
            });
        }

        alert('Layout saved!');
    };

    const handleAddWidget = () => {
        const newId = `widget-${uuidv4()}`;
        setItems([...items, { id: newId, config: { columns: 1 } }]);
        setLayouts({
            ...layouts,
            lg: [...layouts.lg, { i: newId, x: 0, y: Infinity, w: 3, h: 6, config: { columns: 1 } }],
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
                <select
                    value={selectedScreen || ''}
                    onChange={(e) => setSelectedScreen(e.target.value)}
                    className="border px-2 py-1 rounded"
                >
                    <option value="">-- Assign to Screen --</option>
                    {screens.map((s) => (
                        <option key={s.screenId} value={s.screenId}>{s.name}</option>
                    ))}
                </select>
                <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                <button onClick={handleAddWidget} className="px-3 py-1 bg-green-600 text-white rounded">Add Widget</button>
            </div>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={10}
                isDraggable
                isResizable
                verticalCompact={false}
                onLayoutChange={(_layout, allLayouts) => setLayouts(allLayouts as LayoutsState)}
                preventCollision
                draggableCancel=".no-drag"
            >
                {items.map((widget) => (
                    <div key={widget.id} className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setItems(items.filter((i) => i.id !== widget.id));
                                setLayouts({ ...layouts, lg: layouts.lg.filter((l) => l.i !== widget.id) });
                            }}
                            className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 no-drag"
                        >
                            ✖
                        </button>
                        <ProductsWidget
                            catalogOwnerId="1239"
                            title={widget.config.selectedTaxonName}
                            selectedTaxonId={widget.config.selectedTaxonId}
                            taxonAlias={widget.config.taxonAlias}
                            columns={widget.config.columns}
                            readOnly={false}
                            onChange={(taxonId, taxonName, taxonAlias, columns) => setItems(
                                items.map((i) =>
                                    i.id === widget.id
                                        ? { ...i, config: { selectedTaxonId: taxonId, selectedTaxonName: taxonName, taxonAlias, columns: columns ?? 1 } }
                                        : i
                                )
                            )}
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
