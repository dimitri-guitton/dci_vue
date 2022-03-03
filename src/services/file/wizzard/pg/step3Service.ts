import * as Yup from 'yup';
import { PgFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { getCurrentPgFileData } from '@/services/data/dataService';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initPgFormDataStep3 = ( fileData: PgFile ): BaseStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
    };
};

export const yupPgConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validatePgStep3 = async ( data: PgFileStep ) => {
    let fileData = getCurrentPgFileData();

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


