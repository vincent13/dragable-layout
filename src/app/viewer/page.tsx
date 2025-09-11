'use client';

import { useEffect, useState, Suspense } from 'react';
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

// Client component for reading search params
function SearchParamsViewer({ onLayoutId }: { onLayoutId: (id: string) => void }) {
    const searchParams = useSearchParams();
    const layoutId = searchParams.get('layoutId') || '1';

    useEffect(() => {
        onLayoutId(layoutId);
    }, [layoutId, onLayoutId]);

    return null; // this component does not render UI itself
}

export default function ViewerPage() {
    const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);
    const [layoutId, setLayoutId] = useState('1');

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
        <div style={{padding: '1rem'}}>
            <h2>Viewer</h2>
            {/* Suspense boundary for the client hook */}
            <Suspense fallback={null}>
                <SearchParamsViewer onLayoutId={setLayoutId}/>
            </Suspense>

            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{lg: 1200}}
                cols={{lg: 12}}
                rowHeight={30}
                isDraggable={false}
                isResizable={false}
                compactType={null}
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
