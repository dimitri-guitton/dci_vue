import * as Yup from 'yup';
import { getCurrentPvFileData } from '@/services/data/dataService';
import { PvFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';

/**
 * Retourne les valeurs du formualire pour l'etape 3 selon le type de dossiser
 * @param fileData
 */
export const initPvFormDataStep3 = ( fileData: PvFile ) => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingBuildingNature: fileData.housing.buildingNature !== undefined ? fileData.housing.buildingNature : '',
    };
};

export const yupPvConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                       } );
};

export const validatePvStep3 = async ( data: PvFileStep ) => {
    let fileData = getCurrentPvFileData();

    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        isRentedHouse:  data.housingBuildingNature === 'location',
        buildingNature: data.housingBuildingNature,
    };

    fileData = {
        ...fileData,
        ...defaultGetEnergyZoneStep3( fileData, housing ),
        housing: housing,
    };

    updateJsonData( fileData );
};


