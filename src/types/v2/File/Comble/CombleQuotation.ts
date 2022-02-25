import { BaseQuotation } from '@/types/v2/File/Common/BaseQuotation';

export interface CombleQuotation extends BaseQuotation {
    laying: number;
    overrideLaying: number;
}
