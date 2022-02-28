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
    size?: string;
    model?: string;
    type?: string;
    scop?: string;
    power?: number;
    color?: string;
    air?: boolean;
    addedValue?: number;
    automaticPriceCalculation?: boolean;
}
