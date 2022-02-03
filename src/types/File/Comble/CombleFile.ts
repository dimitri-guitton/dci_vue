import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import CombleWorkSheet from '@/types/File/Comble/CombleWorkSheet';
import CombleQuotation from '@/types/File/Comble/CombleQuotation';
import CombleList from '@/types/File/Comble/CombleList';

interface CombleFile {
    version: string;
    type: string;
    ref: string;
    folderName: string;
    createdAt: string;
    updatedAt: string;
    settings: {
        ceeCoef: number;
    };
    quotationTemplate: string;
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
    workSheet: CombleWorkSheet;
    quotation: CombleQuotation;
    scales: Scale[];    // Anciennement "baremes"
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
    lists: CombleList;

}

export default CombleFile;
