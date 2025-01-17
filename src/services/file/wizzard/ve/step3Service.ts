import * as Yup from 'yup';
import { getCodeBonus, getCurrentVeFileData } from '@/services/data/dataService';
import { VeFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';
import { VeFile } from '@/types/v2/File/Ve/VeFile';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initVeFormDataStep3 = ( fileData: VeFile ): BaseStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
    };
};

export const yupVeConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validateVeStep3 = async ( data: VeFileStep ) => {
    let fileData = getCurrentVeFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing: housing,
    };


    const codeBonus = getCodeBonus( fileData );
    fileData        = {
        ...fileData,
        codeBonus,
    };

    updateJsonData( fileData );

    return fileData;
};


