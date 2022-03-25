import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PacRrFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCodeBonus, getCurrentRrFileData } from '@/services/data/dataService';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import {
    defaultGetEnergyZoneStep3,
    defaultGetHoussingValueStep3,
    defaultInitFormDataStep3,
    defaultYupConfigStep3,
} from '@/services/file/wizzard/step3Service';
import { PacRrStep3 } from '@/types/v2/Wizzard/step3/PacRrStep3';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

/**
 *  Retourne les valeurs à l'initialisation du formulaire pour l'etape 3
 * @param fileData
 */
export const initPacRrFormDataStep3 = ( fileData: RrFile ): PacRrStep3 => {
    return {
        ...defaultInitFormDataStep3( fileData ),
        housingAvailableVoltage:    fileData.housing.availableVoltage,
        housingCeilingHeight:       fileData.housing.ceilingHeight,
        housingBuildingCoefficient: fileData.housing.buildingCoefficient,
        housingClimaticZone:        fileData.housing.climaticZone,
        housingAltitude:            fileData.housing.altitude,
        housingSetPointTemperature: fileData.housing.setPointTemperature,
    };
};

export const yupPacRrConfigStep3 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep3(),
                           housingAvailableVoltage:    Yup.string().required(),
                           housingBuildingCoefficient: Yup.number().required().positive( 'La valeur ne peut pas être vide' ),
                           housingClimaticZone:        Yup.string().required(),
                           housingAltitude:            Yup.number().required().min( 0, 'La valeur ne peut pas être vide' ),
                           housingSetPointTemperature: Yup.number().required().positive( 'La valeur ne peut pas être vide' ),
                           housingCeilingHeight:       Yup.number().required().min( 0.1,
                                                                                    'La hauteur sous plafond doit être supérieur à 0' ),
                           area:                       Yup.number().required().min( 1, 'La superficie doit être supérieur à 0' ),
                       } );
};

export const validatePacRrStep3 = async ( data: PacRrFileStep ): Promise<RrFile> => {
    let fileData = getCurrentRrFileData();

    const housing: PacHousing = {
        ...fileData.housing,
        ...defaultGetHoussingValueStep3( fileData, data ),
        availableVoltage:    data.housingAvailableVoltage,
        buildingCoefficient: +data.housingBuildingCoefficient,
        climaticZone:        data.housingClimaticZone,
        altitude:            +data.housingAltitude,
        ceilingHeight:       +data.housingCeilingHeight,
        setPointTemperature: +data.housingSetPointTemperature,
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


