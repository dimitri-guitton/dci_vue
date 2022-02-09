import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import RoWorkSheet from '@/types/File/Ro/RoWorkSheet';
import RoQuotation from '@/types/File/Ro/RoQuotation';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import RoList from '@/types/File/Ro/RoList';

interface RoFile {
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
    codeBonus?: string;
    energyZone?: string;
    bonusRate?: number;
    housing: Housing;
    workSheet: RoWorkSheet;
    quotation: RoQuotation;
    scales: Scale[];    // Anciennement "baremes"
    bonusWithoutCdp: {  // Prime hors coup de pouce
        amount: {
            h1: number;
            h2: number;
            h3: number;
        };
    };
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
    lists: RoList;

}

export default RoFile;
