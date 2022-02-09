import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface CombleQuotation extends BaseQuotation {
    pose: number;
    overridePose: number;
    tva: number;
}
