import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { BaseList } from '@/types/v2/File/Common/BaseList';
import { CpvQuotation } from '@/types/v2/File/Cpv/CpvQuotation';


export interface CpvFile extends BaseFile {
    worksheet: BaseWorksheet;
    quotation: CpvQuotation;
    lists: BaseList;
}
