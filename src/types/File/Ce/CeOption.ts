interface CeOption {
    id: number;
    label: string;
    unit: string;
    value: number;
    pu: {
        default: number;
        value: number;
    };
}

export default CeOption;
