import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface RoQuotation extends BaseQuotation {
    maPrimeRenovBonus: number;
    assortment: string; // Anciennement gamme
    volumeECS: string;
    volumeECSDeporte: number;
    isEcsDeporte: boolean;
    ceilingHeight: number;  // Hauteur sous plafond
    deviceToReplace: {
        type?: string;
        brand?: string;
        model?: string;
    };
    cascadeSystem: boolean;
}
