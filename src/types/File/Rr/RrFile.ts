import Housing from '@/types/File/Housing';
import Technician from '@/types/File/Technician';
import Scale from '@/types/File/Scale';
import Assent from '@/types/File/Assent';
import RrQuotation from '@/types/File/Rr/RrQuotation';
import RrWorkSheet from '@/types/File/Rr/RrWorkSheet';
import ItemList from '@/types/File/ItemList';

interface RrFile {
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
    assent: Assent[]; // anciennement "avis"
    beneficiary: Beneficiary;
    codeBonus?: string;
    energyZone?: string;
    bonusRate?: number;
    housing: Housing;
    workSheet: RrWorkSheet;
    quotation: RrQuotation;
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
    lists: ItemList[];

}

export default RrFile;
