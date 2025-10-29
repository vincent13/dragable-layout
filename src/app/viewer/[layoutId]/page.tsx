'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { Layouts, Layout } from 'react-grid-layout';
import { ProductsWidget } from '../../custom-component/ProductsWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

type Theme = {
    id: string;
    name: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
};

type WidgetItem = {
    id: string;
    config?: {
        selectedTaxonId?: number;
        selectedTaxonName?: string;
        taxonAlias?: string;
        columns?: number;
    };
};

export default function ViewerPage() {
    const params = useParams<{ layoutId: string }>();
    const layoutId = params.layoutId;

    const [layouts, setLayouts] = useState<Layouts>({ lg: [] });
    const [items, setItems] = useState<WidgetItem[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    useEffect(() => {
        if (!layoutId) return;

        const loadLayout = async () => {
            try {
                const res = await fetch(`/api/layout/${layoutId}`);
                if (!res.ok) {
                    console.error('Layout not found');
                    return; // stop execution if layout is not found
                }
                const data = await res.json();

                setLayouts(data);
                if (data.lg) {
                    const savedItems: WidgetItem[] = data.lg.map(
                        (l: Layout & { config?: WidgetItem['config'] }) => ({
                            id: l.i,
                            config: l.config ?? {},
                        })
                    );
                    setItems(savedItems);
                }

                if (data.themeId) {
                    const themeRes = await fetch(`/api/themes/${data.themeId}`);
                    if (themeRes.ok) {
                        const themeData = await themeRes.json();
                        setSelectedTheme(themeData);
                    }
                }
            } catch (err) {
                console.error(err);
                setLayouts({ lg: [] });
                setItems([]);
            }
        };

        loadLayout();
    }, [layoutId]);

    return (
        <div>
            <ResponsiveGridLayout
                layouts={layouts}
                breakpoints={{ lg: 1200 }}
                cols={{ lg: 12 }}
                rowHeight={10}
                isDraggable={false}
                isResizable={false}
                compactType={null}
            >
                {items.map(widget => (
                    <div key={widget.id}>
                        <ProductsWidget
                            catalogOwnerId="1239"
                            selectedTaxonId={widget.config?.selectedTaxonId}
                            title={widget.config?.taxonAlias || widget.config?.selectedTaxonName}
                            columns={widget.config?.columns ?? 1}
                            readOnly={true} // viewer mode
                            theme={selectedTheme ?? undefined} // pass theme here
                        />
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    );
}
