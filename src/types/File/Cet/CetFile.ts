import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import CeWorkSheet from '@/types/File/Cet/CeWorkSheet';
import CetQuotation from '@/types/File/Cet/CetQuotation';
import CetList from '@/types/File/Cet/CetList';

interface CetFile {
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
    workSheet: CeWorkSheet;
    quotation: CetQuotation;
    scales: Scale[];    // Anciennement "baremes"
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
    lists: CetList;

}

export default CetFile;
