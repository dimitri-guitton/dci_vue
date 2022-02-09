import PgList from '@/types/v2/File/Pg/PgList';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { PgWorkSheet } from '@/types/v2/File/Pg/PgWorkSheet';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';


export interface PgFile extends BaseFile {
    workSheet: PgWorkSheet;
    quotation: PgQuotation;
    lists: PgList;
}
