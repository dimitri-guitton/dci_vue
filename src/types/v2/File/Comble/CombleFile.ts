import CombleList from '@/types/v2/File/Comble/CombleList';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { CombleWorkSheet } from '@/types/v2/File/Comble/CombleWorkSheet';
import { CombleQuotation } from '@/types/v2/File/Comble/CombleQuotation';

export interface CombleFile extends BaseFile {
    bonusRate: number; // Anciennement tauxPrime
    workSheet: CombleWorkSheet;
    quotation: CombleQuotation;
    lists: CombleList;
}
