// services/api.ts
import { Taxon, Product } from './types';

export const fetchTaxons = async (catalogOwnerId: string): Promise<Taxon[]> => {
    const params = new URLSearchParams({
        'q[catalog_owner_id_eq]': catalogOwnerId,
        'q[catalog_owner_type_eq]': 'Merchant',
        'q[s]': 'lft asc',
    });

    const res = await fetch(`https://prd.one2three.network/api/v1/taxons?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch taxons');

    const data = await res.json();
    return data.taxons as Taxon[];
};

export const fetchProductsByTaxonId = async (catalogOwnerId: string, taxonId: number): Promise<Product[]> => {
    const params = new URLSearchParams({
        all_page: 'true',
        'q[catalog_owner_id_eq]': catalogOwnerId,
        'q[catalog_owner_type_eq]': 'Merchant',
        'q[product_taxons_taxon_id_eq]': taxonId.toString(),
    });

    const res = await fetch(`https://prd.one2three.network/api/v1/products?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');

    const data = await res.json();
    return data.products as Product[];
};
