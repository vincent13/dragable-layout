'use client';

import { useEffect, useState } from 'react';
import { Taxon, Product } from '../services/types';
import { fetchTaxons, fetchProductsByTaxonId } from '../services/api';

interface ProductsWidgetProps {
    catalogOwnerId: string;
    title?: string;
    selectedTaxonId?: number;
    onChange?: (taxonId: number, taxonName: string) => void;
    readOnly?: boolean;
    onRemove?: () => void;
}

export const ProductsWidget: React.FC<ProductsWidgetProps> = ({
                                                                  catalogOwnerId,
                                                                  title,
                                                                  selectedTaxonId,
                                                                  onChange,
                                                                  readOnly = false,
                                                                  onRemove,
                                                              }) => {
    const [taxons, setTaxons] = useState<Taxon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        fetchTaxons(catalogOwnerId).then(setTaxons);
    }, [catalogOwnerId]);

    useEffect(() => {
        if (!selectedTaxonId) return;
        setLoadingProducts(true);
        fetchProductsByTaxonId(catalogOwnerId, selectedTaxonId)
            .then(setProducts)
            .finally(() => setLoadingProducts(false));
    }, [catalogOwnerId, selectedTaxonId]);

    return (
        <div className="products-widget relative h-full flex flex-col border rounded shadow-sm s" >
            {/* Header */}
            <div className="products-widget-header flex items-center justify-between h-12 border-b">
                {!readOnly ? (
                    <select
                        className="w-11/12 h-full border rounded"
                        value={selectedTaxonId ?? ''}
                        onChange={(e) => {
                            const taxonId = Number(e.target.value);
                            const taxonName = taxons.find((t) => t.id === taxonId)?.name ?? '';
                            onChange?.(taxonId, taxonName);
                        }}
                    >
                        <option value="">Select a category</option>
                        {taxons.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <h3 className="text-lg font-bold">{title}</h3>
                )}

                {!readOnly && onRemove && (
                    <button
                        className="ml-2 text-white bg-red-500 hover:bg-red-600 rounded px-2 py-1 text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        ✖
                    </button>

                )}
            </div>

            {/* Product list */}
            <div className="product-list flex-1 overflow-hidden p-2">
                {loadingProducts ? (
                    <p>Loading…</p>
                ) : (
                    products.map((p) => (
                        <div key={p.id} className="product-item flex justify-between p-2 bg-yellow-200 mb-1 rounded">
                            <span className="product-name">{p.name}</span>
                            <span className="product-price">€{p.price}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
