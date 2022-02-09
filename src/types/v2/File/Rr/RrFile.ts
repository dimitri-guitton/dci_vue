import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import RrList from '@/types/v2/File/Rr/RrList';
import { RrWorkSheet } from '@/types/v2/File/Rr/RrWorkSheet';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';


export interface RrFile extends BaseFile {
    bonusWithoutCdp: {  // Prime hors coup de pouce
        amount: {
            h1: number;
            h2: number;
            h3: number;
        };
    };
    workSheet: RrWorkSheet;
    quotation: RrQuotation;
    lists: RrList;
}

