import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface PvQuotation extends BaseQuotation {
    maPrimeRenovBonus: number;
    tva20: number;
}
