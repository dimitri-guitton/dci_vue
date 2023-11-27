import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface PvQuotation extends BaseQuotation {
    tva20: number;
    tva10: number;
    selfConsumptionBonus: number;
    resaleType: string;
}
