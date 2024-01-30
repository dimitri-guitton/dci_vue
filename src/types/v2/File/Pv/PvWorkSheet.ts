import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface PvWorkSheet extends BaseWorksheet {
    orientation: string;
    electricityPriceEvolution: number;
    ratioResaleToEDF: number;
    averagePricePerKWhInFrance: number;
    installationPower?: number;
}
