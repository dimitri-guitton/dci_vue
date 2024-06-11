import * as Yup from 'yup';
import { getCodeBonus, getCurrentBrveFileData } from '@/services/data/dataService';
import { BrveFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';
import { BrveFile } from '@/types/v2/File/Brve/BrveFile';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initBrveFormDataStep3 = ( fileData: BrveFile ): BaseStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
    };
};

export const yupBrveConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validateBrveStep3 = async ( data: BrveFileStep ) => {
    let fileData = getCurrentBrveFileData();

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


