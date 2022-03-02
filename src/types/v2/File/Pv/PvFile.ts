import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';
import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import PvList from '@/types/v2/File/Pv/PvList';


export interface PvFile extends BaseFile {
    worksheet: PvWorkSheet;
    quotation: PvQuotation;
    lists: PvList;
}
