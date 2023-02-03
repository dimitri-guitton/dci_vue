import * as Yup from 'yup';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { SolFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCodeBonus, getCurrentSolFileData } from '@/services/data/dataService';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { SolStep3 } from '@/types/v2/Wizzard/step3/SolStep3';

/**
 * Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initSolFormDataStep3 = ( fileData: SolFile ): SolStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingHeatingType: fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
    };
};

export const yupSolConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           area: Yup.number().required().min( 20, 'La superficie doit être supérieur à 19' ),
                       } );
};

export const validateSolStep3 = async ( data: SolFileStep ) => {
    let fileData = getCurrentSolFileData();

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

    const codeBonus = getCodeBonus( fileData );
    fileData        = {
        ...fileData,
        codeBonus,
    };

    updateJsonData( fileData );

    return fileData;
};


