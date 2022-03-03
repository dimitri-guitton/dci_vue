import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

export interface PacRoStep3 extends BaseStep3 {
    housingAvailableVoltage: string;
    housingCeilingHeight: number;
    housingBuildingCoefficient: number;     // Anciennment Isolation
    housingClimaticZone: string;            // Zone climatique
    housingAltitude: number;
    housingHeaters: string;                 // Radiateurs
    housingSetPointTemperature: number;     // Température de consigne
}
