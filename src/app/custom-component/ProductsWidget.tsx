import { useEffect, useState } from 'react';
import { fetchTaxons, fetchProductsByTaxonId } from '../services/api';
import { Taxon, Product } from '../services/types';

interface ProductsWidgetProps {
    catalogOwnerId: string;
    title?: string;
    selectedTaxonId?: number;
    onChange?: (taxonId: number, taxonName: string) => void;
    readOnly?: boolean;
}

export const ProductsWidget: React.FC<ProductsWidgetProps> = ({
                                                                  catalogOwnerId,
                                                                  title,
                                                                  selectedTaxonId,
                                                                  onChange,
                                                                  readOnly = false,
                                                              }) => {
    const [taxons, setTaxons] = useState<Taxon[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTaxons(catalogOwnerId)
            .then(setTaxons)
            .catch((err) => setError(err.message));
    }, [catalogOwnerId]);

    useEffect(() => {
        if (!selectedTaxonId) return;

        setLoadingProducts(true);
        fetchProductsByTaxonId(catalogOwnerId, selectedTaxonId)
            .then(setProducts)
            .catch((err) => setError(err.message))
            .finally(() => setLoadingProducts(false));
    }, [catalogOwnerId, selectedTaxonId]);

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="products-widget p-4 border rounded-md shadow-sm">
            {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}

            <div className="mb-4">
                {!readOnly &&(
                <select
                    value={selectedTaxonId ?? ''}
                    onChange={(e) => {
                        if (readOnly) return; // ignore changes when read-only
                        const taxonId = Number(e.target.value);
                        const taxonName = taxons.find(t => t.id === taxonId)?.name ?? '';
                        onChange?.(taxonId, taxonName);
                    }}
                >
                    <option value="">Select a category</option>
                    {taxons.map((taxon) => (
                        <option key={taxon.id} value={taxon.id}>
                            {taxon.name}
                        </option>
                    ))}
                </select>)}
            </div>

            {loadingProducts ? (
                <div>Loading products…</div>
            ) : (
                <ul className="grid grid-cols-2 gap-4">
                    {products.map((p) => (
                        <li key={p.id} className="border rounded-lg p-2 shadow-sm">
                            <h4 className="font-semibold">{p.name}</h4>
                            <p className="text-green-600 font-bold mt-1">€{p.price}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
