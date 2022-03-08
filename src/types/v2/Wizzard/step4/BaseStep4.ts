export interface BaseStep4 {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: StepOption[];
    blankOptions: StepOption[];
    selectedProducts: StepProduct[];
    commentary: string;
    paymentOnCredit: {
        active: boolean;
        amount: number;
        withoutInsurance: number;
        withInsurance: number;
        duration: number;
        TAEG: number;
        total: number;
    };
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
