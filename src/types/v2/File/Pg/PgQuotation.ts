import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface PgQuotation extends BaseQuotation {
    tva: number;
    ceeBonus: number;
    maPrimeRenovBonus: number;
}
