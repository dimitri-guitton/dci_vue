import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

export interface SolStep3 extends BaseStep3 {
    housingHeatingType: string;
    housingBuildingNature: string;
}
