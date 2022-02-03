interface Product {
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
    power?: string;
    color?: string;
    air?: boolean;
    addedValue?: number;
    automaticPriceCalculation?: boolean;
}

export default Product;
