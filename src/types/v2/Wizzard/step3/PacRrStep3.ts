import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

export interface PacRrStep3 extends BaseStep3 {
    housingBuildingNature: string;
    housingInsulationQuality: number;
    housingAvailableVoltage: string;
}
