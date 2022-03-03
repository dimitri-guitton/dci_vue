import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import RoList from '@/types/v2/File/Ro/RoList';
import { RoWorkSheet } from '@/types/v2/File/Ro/RoWorkSheet';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

export interface RoFile extends BaseFile {
    bonusWithoutCdp: {  // Prime hors coup de pouce
        amount: {
            h1: number;
            h2: number;
            h3: number;
        };
    };
    worksheet: RoWorkSheet;
    quotation: RoQuotation;
    lists: RoList;
    housing: PacHousing;
}

