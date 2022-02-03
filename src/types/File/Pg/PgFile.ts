import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import PgWorkSheet from '@/types/File/Pg/PgWorkSheet';
import PgQuotation from '@/types/File/Pg/PgQuotation';
import PgList from '@/types/File/Pg/PgList';

interface PgFile {
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
    workSheet: PgWorkSheet;
    quotation: PgQuotation;
    scales: Scale[];    // Anciennement "baremes"
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
    lists: PgList;

}

export default PgFile;
