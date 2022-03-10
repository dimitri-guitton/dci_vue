import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface PvWorkSheet extends BaseWorksheet {
    montantFactureElectrique: number;
    totalKwhFactureElectrique: number;
    orientation: string;
}
