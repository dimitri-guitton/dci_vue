interface RoProduct {
    id: number;
    label: string;
    ref: string;
    pu: number;
    defaultPu: number;
    description: string;
    calcul0: boolean;
    scop?: number;
}

export default RoProduct;
