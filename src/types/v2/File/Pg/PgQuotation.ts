import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface PgQuotation extends BaseQuotation {
    maPrimeRenovBonus: number;
    outsideSocket: boolean;
    smoke: string;
    tva20: number;
}
