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

/**
 * Retourne les valeurs du formualire pour l'etape 3 selon le type de dossiser
 * @param fileData
 */
export const initPbFormDataStep3 = ( fileData: PbFile ) => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingHeatingType:    fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
        housingBuildingNature: fileData.housing.buildingNature !== undefined ? fileData.housing.buildingNature : '',
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


