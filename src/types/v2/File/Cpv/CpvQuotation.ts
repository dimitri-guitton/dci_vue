import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface CpvQuotation extends BaseQuotation {
    tva20: number;
    tva10: number;
    attachedToAHouse: boolean;
}

