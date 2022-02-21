export interface BaseStep4 {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: StepOption[];
    blankOptions: StepOption[];
    selectedProducts: StepProduct[];
    commentary: string;
}

export interface StepOption {
    id: number;
    pu: number;
    number: number;
}

export interface StepProduct {
    id: number;
    pu: number;
}
