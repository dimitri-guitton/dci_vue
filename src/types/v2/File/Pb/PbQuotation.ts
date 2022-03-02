import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface PbQuotation extends BaseQuotation {
    maPrimeRenovBonus: number;
    newCreation: boolean;
    tva20: number;
}
