import * as Yup from 'yup';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { SolFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentSolFileData } from '@/services/data/dataService';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
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
export const initSolFormDataStep3 = ( fileData: SolFile ) => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingHeatingType:    fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
        housingBuildingNature: fileData.housing.buildingNature !== undefined ? fileData.housing.buildingNature : '',
    };
};

export const yupSolConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           area: Yup.number().required().min( 1, 'La superficie doit être supérieur à 0' ),
                       } );
};

export const validateSolStep3 = async ( data: SolFileStep ) => {
    let fileData = getCurrentSolFileData();

    console.log( data );
    const housing: Housing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        heatingType:    data.housingHeatingType,
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


