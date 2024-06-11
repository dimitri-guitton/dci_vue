import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface BrveQuotation extends BaseQuotation {
    tva20: number;
    tva10: number;
}

