'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import Widget from '@/app/custom-component/Widget';
import { ProductsWidget } from '../custom-component/ProductsWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type WidgetItem = {
    id: string;
    type: 'products';
    config?: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
    };
};

export default function ViewerPage() {
    const searchParams = useSearchParams();
    const layoutId = searchParams.get('layoutId') || '1';

    const [layouts, setLayouts] = useState<Layouts | null>(null);
    const [items, setItems] = useState<WidgetItem[]>([]);

    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject('Layout not found')))
            .then((data) => {
                setLayouts(data);
                if (data.lg) {
                    const savedItems: WidgetItem[] = data.lg.map((item: Layout & { config?: WidgetItem['config'] }) => ({
                        id: item.i,
                        type: 'products',
                        config: item.config ?? {}, // now TypeScript knows about config
                    }));
                    setItems(savedItems);
                }
            })
            .catch((err) => {
                console.error(err);
                setLayouts({ lg: [] });
            });
    }, [layoutId]);

    if (!layouts) return <p>Loading layout...</p>;

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Layout Viewer</h2>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable={false} // viewer mode, no drag
                isResizable={false} // viewer mode, no resize
            >
                {items.map((item) => (
                    <div key={item.id}>
                        <Widget
                            id={item.id}
                            title={item.config?.selectedTaxonName ?? item.id}
                            onRemove={() => {}}
                        >
                            {item.type === 'products' && (
                                <ProductsWidget
                                    catalogOwnerId="1239"
                                    selectedTaxonId={item.config?.selectedTaxonId}
                                    readOnly={true} // disables selection in viewer
                                />
                            )}
                        </Widget>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
