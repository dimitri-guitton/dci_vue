import { ProductColor } from '@/types/v2/File/Common/ProductColor';

/**
 * Interface pour les produits dans les devis
 */
export interface Product {
    id: number;
    productType: string;
    reference: string;
    label: string;
    description: string;
    defaultPu: number;
    pu: number;
    quantity: number;
    size?: string;
    volume?: number;
    model?: string;
    type?: string;
    scop?: number;
    etas?: number;
    power?: number;
    color?: string;
    air?: boolean;
    addedValue?: number;
    automaticPriceCalculation?: boolean;
    laying?: number;
    ext1?: string;
    ext2?: string;
    productColors?: ProductColor[];
    selectedColor?: {
        name: string;
        pu: number;
    };
}
