import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import SolList from '@/types/v2/File/Sol/SolList';
import { SolWorkSheet } from '@/types/v2/File/Sol/SolWorkSheet';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';

export interface SolFile extends BaseFile {
    bonusRate: number; // Anciennement tauxPrime
    worksheet: SolWorkSheet;
    quotation: SolQuotation;
    lists: SolList;
}
