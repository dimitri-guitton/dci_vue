import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

export interface PacRrStep3 extends BaseStep3 {
    housingAvailableVoltage: string;
    housingCeilingHeight: number;
    housingBuildingCoefficient: number;     // Anciennment Isolation
    housingClimaticZone: string;            // Zone climatique
    housingAltitude: number;
    housingSetPointTemperature: number;     // Température de consigne
}
