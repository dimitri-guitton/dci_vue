import * as Yup from 'yup';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { PacRoFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentRoFileData } from '@/services/data/dataService';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { PacRoStep3 } from '@/types/v2/Wizzard/step3/PacRoStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initPacRoFormDataStep3 = ( fileData: RoFile ): PacRoStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingInsulationQuality: fileData.housing.insulationQuality !== undefined ? fileData.housing.insulationQuality : 1,
        housingAvailableVoltage:  fileData.housing.availableVoltage !== undefined ? fileData.housing.availableVoltage : 'monophase',
        housingCeilingHeight:     fileData.quotation.ceilingHeight !== undefined ? fileData.quotation.ceilingHeight : 2.5,
    };
};

export const yupPacRoConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           housingCeilingHeight: Yup.number().positive().required(),
                           area:                 Yup.number().required().min( 1, 'La superficie doit être supérieur à 0' ),
                       } );
};

export const validatePacRoStep3 = async ( data: PacRoFileStep ): Promise<RoFile> => {
    let fileData = getCurrentRoFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        insulationQuality: data.housingInsulationQuality,
        availableVoltage:  data.housingAvailableVoltage,
    };

    const quotation: RoQuotation = ( fileData.quotation as RoQuotation );

    const newQuotation: RoQuotation = {
        ...quotation,
        ceilingHeight: data.housingCeilingHeight,
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing:   housing,
        quotation: newQuotation,
    };

    updateJsonData( fileData );

    return fileData;
};


