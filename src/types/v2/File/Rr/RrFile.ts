import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import RrList from '@/types/v2/File/Rr/RrList';
import { RrWorkSheet } from '@/types/v2/File/Rr/RrWorkSheet';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';


export interface RrFile extends BaseFile {
    bonusWithoutCdp: {  // Prime hors coup de pouce
        amount: {
            h1: number;
            h2: number;
            h3: number;
        };
    };
    worksheet: RrWorkSheet;
    quotation: RrQuotation;
    lists: RrList;
    housing: PacHousing;
}

