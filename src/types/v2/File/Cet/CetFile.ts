import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { CetWorkSheet } from '@/types/v2/File/Cet/CeWorkSheet';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { CetList } from '@/types/v2/File/Cet/CetList';

export interface CetFile extends BaseFile {
    workSheet: CetWorkSheet;
    quotation: CetQuotation;
    lists: CetList;
}
