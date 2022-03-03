import * as Yup from 'yup';
import { getCurrentCetFileData } from '@/services/data/dataService';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CetStep3 } from '@/types/v2/Wizzard/step3/CetStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initCetFormDataStep3 = ( fileData: CetFile ): CetStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingHeatingType: fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
    };
};

export const yupCetConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validateCetStep3 = async ( data: CetFileStep ) => {
    let fileData = getCurrentCetFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        heatingType: data.housingHeatingType,
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing: housing,
    };

    updateJsonData( fileData );
};


