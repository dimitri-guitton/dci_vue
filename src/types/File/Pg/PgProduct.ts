interface PgProduct {
    id: number;
    label: string;
    ref: string;
    pu: number;
    defaultPu: number;
    description: string;
    type: string;
    power?: string;
    color?: string;
}

export default PgProduct;
