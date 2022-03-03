import * as Yup from 'yup';
import { getCurrentPbFileData } from '@/services/data/dataService';
import { PbFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initPbFormDataStep3 = ( fileData: PbFile ): BaseStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
    };
};

export const yupPbConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validatePbStep3 = async ( data: PbFileStep ) => {
    let fileData = getCurrentPbFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing: housing,
    };

    updateJsonData( fileData );
};


