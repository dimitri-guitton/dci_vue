import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { PbWorkSheet } from '@/types/v2/File/Pb/PbWorkSheet';
import { PbQuotation } from '@/types/v2/File/Pb/PbQuotation';
import PbList from '@/types/v2/File/Pb/PbList';


export interface PbFile extends BaseFile {
    worksheet: PbWorkSheet;
    quotation: PbQuotation;
    lists: PbList;
}
