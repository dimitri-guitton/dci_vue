import { AssentDataForm } from '@/types/v2/Wizzard/AssentDataForm';

export interface Step2 {
    assentsDatas: AssentDataForm[];
    indexBeneficiary: number;
    email: string;
    phone: string;
    mobile: string;
}
