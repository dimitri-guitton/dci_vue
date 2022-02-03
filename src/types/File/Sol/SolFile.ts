import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import SolWorkSheet from '@/types/File/Sol/SolWorkSheet';
import SolQuotation from '@/types/File/Sol/SolQuotation';
import SolList from '@/types/File/Sol/SolList';

interface SolFile {
    version: string;
    type: string;
    ref: string;
    folderName: string;
    createdAt: string;
    updatedAt: string;
    settings: {
        ceeCoef: number;
    };
    devisTemplate: string;
    workSheetTemplate: string;
    disabledBonus: boolean;
    disabledCeeBonus: boolean;
    enabledHousingAction: boolean;
    disabledMaPrimeRenovBonus: boolean;
    assents: Assent[]; // anciennement "avis"
    beneficiary: Beneficiary;
    codeBonus?: string; // Anciennement codePrime
    energyZone?: string;
    bonusRate?: number; // Anciennement tauxPrime
    housing: Housing;
    workSheet: SolWorkSheet;
    quotation: SolQuotation;
    scales: Scale[];    // Anciennement "baremes"
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
    lists: SolList;

}

export default SolFile;
