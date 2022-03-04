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
    housingAssortmentP1: string;
    housingAssortmentP2: string;
    housingAssortmentP3: string;
    housingAssortmentP4: string;
    housingAssortmentP5: string;
}
