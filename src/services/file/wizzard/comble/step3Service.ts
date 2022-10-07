import * as Yup from 'yup';
import { CombleFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCodeBonus, getCurrentCombleFileData } from '@/services/data/dataService';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { CombleStep3 } from '@/types/v2/Wizzard/step3/CombleStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initCombleFormDataStep3 = ( fileData: CombleFile ): CombleStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingHeatingType: fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
    };
};

export const yupCombleConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           area: Yup.number().required().min( 30, 'La superficie doit être supérieur à 29' ),
                       } );
};

export const validateCombleStep3 = async ( data: CombleFileStep ) => {
    let fileData = getCurrentCombleFileData();

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

    console.log( 'FILE DATA -->', fileData );

    const codeBonus = getCodeBonus( fileData );
    fileData        = {
        ...fileData,
        codeBonus,
    };
    updateJsonData( fileData );

    return fileData;
};


