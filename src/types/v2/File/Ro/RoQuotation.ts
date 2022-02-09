import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';
import RoEcsDeporte from '@/types/v2/File/Ro/RoEcsDeporte';
import RoKitBiZone from '@/types/v2/File/Ro/RoKitBiZone';

export interface RoQuotation extends BaseQuotation {
    tva10: number;
    tva20: number;
    ceeBonus: number;
    maPrimeRenovBonus: number;
    assortment: string; // Anciennement gamme
    volumeECS: number;
    volumeECSDeporte: number;
    isEcsDeporte: boolean;
    selectedEcsDeporte?: RoEcsDeporte;
    isKitBiZone: boolean;
    selectedKitBiZone?: RoKitBiZone;
    ceilingHeight: number;  // Hauteur sous plafond
    deviceToReplace: {
        type?: string;
        brand?: string;
        model?: string;
    };
}
