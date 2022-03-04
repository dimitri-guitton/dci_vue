import { Assent } from '@/types/v2/File/Common/Assent';
import { Beneficiary } from '@/types/v2/File/Common/Beneficiary';
import { Housing } from '@/types/v2/File/Common/Housing';
import { Scale } from '@/types/v2/File/Common/Scale';
import { Technician } from '@/types/v2/File/Common/Technician';

export interface BaseFile {
    version: string;
    type: string;
    ref: string;
    folderName: string;
    createdAt: string;
    updatedAt: string;
    settings: {
        ceeCoef: number;
    };
    disabledBonus: boolean;
    disabledCeeBonus: boolean;
    disabledMaPrimeRenovBonus: boolean;
    assents: Assent[]; // anciennement "avis"
    beneficiary: Beneficiary;
    codeBonus: string; // Anciennement codePrime
    energyZone: string;
    housing: Housing;
    scales: Scale[];    // Anciennement "baremes"
    statusInDci: number;
    errorsStatusInDci: number[];
    technician: Technician;
}
