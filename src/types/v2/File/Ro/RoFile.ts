import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import RoList from '@/types/v2/File/Ro/RoList';
import { RoWorkSheet } from '@/types/v2/File/Ro/RoWorkSheet';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';

export interface RoFile extends BaseFile {
    workSheet: RoWorkSheet;
    quotation: RoQuotation;
    lists: RoList;
}

