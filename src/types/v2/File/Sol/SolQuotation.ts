import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface SolQuotation extends BaseQuotation {
    pose: number;
    overridePose: number;
}
