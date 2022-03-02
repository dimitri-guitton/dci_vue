import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';

export interface PacRrStep4 extends BaseStep4 {
    pacType: string;
    assortment: string;
    housingRoomNumber: number;
    housingAreaP1: number;
    housingAreaP2: number;
    housingAreaP3: number;
    housingAreaP4: number;
    housingAreaP5: number;
}
