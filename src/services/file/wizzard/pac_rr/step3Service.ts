import * as Yup from 'yup';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { PacRrFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentRrFileData } from '@/services/data/dataService';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { PacRrStep3 } from '@/types/v2/Wizzard/step3/PacRrStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initPacRrFormDataStep3 = ( fileData: RrFile ): PacRrStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingInsulationQuality: fileData.housing.insulationQuality !== undefined ? fileData.housing.insulationQuality : 1,
        housingAvailableVoltage:  fileData.housing.availableVoltage !== undefined ? fileData.housing.availableVoltage : 'monophase',
    };
};

export const yupPacRrConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           area: Yup.number().required().min( 1, 'La superficie doit être supérieur à 0' ),
                       } );
};

export const validatePacRrStep3 = async ( data: PacRrFileStep ): Promise<RrFile> => {
    let fileData = getCurrentRrFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        insulationQuality: data.housingInsulationQuality,
        availableVoltage:  data.housingAvailableVoltage,
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing: housing,
    };

    updateJsonData( fileData );

    return fileData;
};


