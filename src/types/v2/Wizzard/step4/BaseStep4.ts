import { PaymentOnCredit } from '@/types/v2/File/Common/paymentOnCredit';

export interface BaseStep4 {
    bonus: boolean;
    ceeBonus: boolean;
    maPrimeRenovBonus: boolean;
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: StepOption[];
    blankOptions: StepOption[];
    selectedProducts: StepProduct[];
    commentary: string;
    paymentOnCredit: PaymentOnCredit;
    requestTechnicalVisit?: boolean;
    technicalVisitReason?: string;
}

export interface StepOption {
    id: number;
    pu: number;
    number: number;
    label: string;
}

export interface StepProduct {
    id: number;
    pu: number;
    quantity: number;
}
