'use client';

import { useEffect, useState } from 'react';
import { Taxon, Product } from '../services/types';
import { fetchTaxons, fetchProductsByTaxonId } from '../services/api';

interface ProductsWidgetProps {
    catalogOwnerId: string;
    title?: string;
    selectedTaxonId?: number;
    taxonAlias?: string;
    columns?: number | number[];
    onChange?: (taxonId: number, taxonName: string, alias?: string, columns?: number) => void;
    readOnly?: boolean;
    onRemove?: () => void;
    theme?: {
        background?: string;
        fontFamily?: string;
        fontSize?: string;
        textColor?: string;
    };
}

export const ProductsWidget: React.FC<ProductsWidgetProps> = ({
                                                                  catalogOwnerId,
                                                                  title,
                                                                  selectedTaxonId,
                                                                  taxonAlias,
                                                                  columns: columnsProp,
                                                                  onChange,
                                                                  readOnly = false,
                                                                  onRemove,
                                                                  theme,
                                                              }) => {
    const [taxons, setTaxons] = useState<Taxon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [alias, setAlias] = useState<string>(taxonAlias ?? '');
    const [columns, setColumns] = useState<number>(
        Array.isArray(columnsProp) ? columnsProp[0] : columnsProp ?? 1
    );

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

    useEffect(() => setAlias(taxonAlias ?? ''), [taxonAlias]);
    useEffect(() => setColumns(Array.isArray(columnsProp) ? columnsProp[0] : columnsProp ?? 1), [columnsProp]);

    return (
        <div className={`products-widget relative h-full flex flex-col ${!readOnly ? 'border rounded shadow-sm' : ''}`}>
            <div
                className={`products-widget-header flex items-center gap-2 h-10 ${readOnly ? 'justify-center' : 'justify-between'}`}>
                {!readOnly ? (
                    <>
                        <select
                            className="w-1/2 flex-1 h-full border rounded"
                            value={selectedTaxonId ?? ''}
                            onChange={(e) => {
                                const taxonId = Number(e.target.value);
                                const taxonName = taxons.find((t) => t.id === taxonId)?.name ?? '';
                                onChange?.(taxonId, taxonName, alias, columns);
                            }}
                        >
                            <option value="">Select a category</option>
                            {taxons.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        <select
                            className="w-1/4 h-full border rounded"
                            value={columns}
                            onChange={(e) => {
                                const newCols = Number(e.target.value);
                                setColumns(newCols);
                                if (selectedTaxonId) {
                                    const taxonName = taxons.find((t) => t.id === selectedTaxonId)?.name ?? '';
                                    onChange?.(selectedTaxonId, taxonName, alias, newCols);
                                }
                            }}
                        >
                            <option value={1}>1 Column</option>
                            <option value={2}>2 Columns</option>
                            <option value={3}>3 Columns</option>
                            <option value={4}>4 Columns</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Alias"
                            className="w-1/2 flex-1 h-full border rounded px-2"
                            value={alias}
                            onChange={(e) => {
                                setAlias(e.target.value);
                                if (selectedTaxonId) {
                                    const taxonName = taxons.find((t) => t.id === selectedTaxonId)?.name ?? '';
                                    onChange?.(selectedTaxonId, taxonName, e.target.value, columns);
                                }
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                        />
                    </>
                ) : (
                    <h3 className="font-bold text-center">{alias || title}</h3>
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

            <div
                className={`product-list-grid ${
                    columns === 1 ? 'product-list-cols-1' :
                        columns === 2 ? 'product-list-cols-2' :
                            columns === 3 ? 'product-list-cols-3' :
                                'product-list-cols-4'
                }`}
            >
                {loadingProducts ? (
                    <p>Loading…</p>
                ) : (
                    products.map((p) => (
                        <div
                            key={p.id}
                            className={`product-item p-1 rounded flex justify-between ${
                                theme?.background ?? ''} ${theme?.fontFamily ?? ''} ${theme?.fontSize ?? ''} ${theme?.textColor ?? ''}`}
                        >
                            <span className="product-name">{p.name}</span>
                            <span className="product-price">€{p.price}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
