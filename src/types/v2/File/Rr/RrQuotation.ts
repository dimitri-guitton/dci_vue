import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';
import RrMulti from '@/types/v2/File/Rr/RrMulti';

export interface RrQuotation extends BaseQuotation {
    tva10: number;
    tva20: number;
    ceeBonus: number;
    maPrimeRenovBonus: number;
    rrType: string;
    rrMulti: RrMulti;
    assortment: string; // Anciennement gamme
}
