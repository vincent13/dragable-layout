// types.ts

export interface ProductImage {
    thumb_url: string;
    small_url: string;
    medium_url: string;
    large_url: string;
}

export interface ProductTaxon {
    taxon_id: number;
    ordering: number;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    main_image?: ProductImage;
    product_taxons: ProductTaxon[];
    is_orderable: boolean;
    is_available: boolean;
    unit: string;
    // Add more fields if needed
}

export interface Taxon {
    id: number;
    name: string;
    parent_id?: number;
    position?: number;
    // Add more fields if needed
}
