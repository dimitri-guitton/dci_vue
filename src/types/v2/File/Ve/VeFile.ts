import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { BaseList } from '@/types/v2/File/Common/BaseList';
import { VeQuotation } from '@/types/v2/File/Ve/VeQuotation';


export interface VeFile extends BaseFile {
    worksheet: BaseWorksheet;
    quotation: VeQuotation;
    lists: BaseList;
}
