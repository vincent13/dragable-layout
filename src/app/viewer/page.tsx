'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import { ProductsWidget } from '../custom-component/ProductsWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type WidgetItem = {
    id: string;
    config?: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
    };
};

export default function ViewerPage() {
    const searchParams = useSearchParams();
    const layoutId = searchParams.get('layoutId') || '1';

    const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);

    useEffect(() => {
        fetch(`/api/layout/${layoutId}`)
            .then(res => (res.ok ? res.json() : Promise.reject('Layout not found')))
            .then((data) => {
                setLayouts(data);
                if (data.lg) {
                    const savedItems: WidgetItem[] = data.lg.map((l: Layout & { config?: WidgetItem['config'] }) => ({
                        id: l.i,
                        config: l.config ?? {},
                    }));
                    setItems(savedItems);
                }
            })
            .catch(() => {
                setLayouts({ lg: [] });
                setItems([]);
            });
    }, [layoutId]);

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Viewer</h2>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={30}
                isDraggable={false}
                isResizable={false}
            >
                {items.map(widget => (
                    <div key={widget.id}>
                        <ProductsWidget
                            catalogOwnerId="1239"
                            selectedTaxonId={widget.config?.selectedTaxonId}
                            title={widget.config?.selectedTaxonName}
                            readOnly={true} // viewer mode
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
