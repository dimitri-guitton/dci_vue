interface RoOption {
    id: number;
    label: string;
    unit: string;
    value: number;
    pu: {
        default: number;
        value: number;
    };
    calcTva10: boolean;
}

export default RoOption;
