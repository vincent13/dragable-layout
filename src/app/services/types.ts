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

// === Layout / Widget types ===

// Configuration for a single widget
export type WidgetConfig = {
    selectedTaxonId?: number;
    selectedTaxonName?: string;
};

// A single widget in the grid layout
export type WidgetItem = {
    i: string; // matches Layout.i in react-grid-layout
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    config?: WidgetConfig;
};

// Full layout stored in DB
export type LayoutData = WidgetItem[];
