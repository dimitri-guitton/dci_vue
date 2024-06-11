import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { BaseList } from '@/types/v2/File/Common/BaseList';
import { BrveQuotation } from '@/types/v2/File/Brve/BrveQuotation';


export interface BrveFile extends BaseFile {
    worksheet: BaseWorksheet;
    quotation: BrveQuotation;
    lists: BaseList;
}
