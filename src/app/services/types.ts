// types.ts

// Existing product/taxon types
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
}

export interface Taxon {
    id: number;
    name: string;
    parent_id?: number;
    position?: number;
}

export type WidgetConfig = {
    selectedTaxonId?: number;
    selectedTaxonName?: string;
    taxonAlias?:string;
};

export type WidgetItem = {
    i: string;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    config?: WidgetConfig;
};

export type LayoutData = WidgetItem[];

export type Theme = {
    id: string;
    name: string;
    background?: string;
    fontFamily?: string;
    fontSize?: string;
    textColor?: string;
    createdAt?: string;
    updatedAt?: string;
};