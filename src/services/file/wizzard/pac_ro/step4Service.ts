import * as Yup from 'yup';
import { getCurrentRoFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { PacRoFileStep } from '@/types/v2/Wizzard/FileStep';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import { PacRoStep4 } from '@/types/v2/Wizzard/step4/PacRoStep4';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPacRoFormDataStep4 = ( fileData: RoFile ): PacRoStep4 => {


    return {
        ...defaultInitFormDataStep4( fileData ),
        deviceToReplaceType:  fileData.quotation.deviceToReplace.type === undefined ? '' : fileData.quotation.deviceToReplace.type,
        deviceToReplaceBrand: fileData.quotation.deviceToReplace.brand === undefined ? '' : fileData.quotation.deviceToReplace.brand,
        deviceToReplaceModel: fileData.quotation.deviceToReplace.model === undefined ? '' : fileData.quotation.deviceToReplace.model,
        isEcsDeporte:         fileData.quotation.isEcsDeporte,
        volumeECSDeporte:     fileData.quotation.volumeECSDeporte === null ? 150 : fileData.quotation.volumeECSDeporte,
        volumeECS:            fileData.quotation.volumeECS === null ? 'ecs_1' : fileData.quotation.volumeECS,
        cascadeSystem:        fileData.quotation.cascadeSystem,
        discount:             fileData.quotation.discount,
    };
};

export const yupPacRoConfigStep4 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep4(),
                           deviceToReplaceType:  Yup.string(),
                           deviceToReplaceBrand: Yup.string(),
                           deviceToReplaceModel: Yup.string(),
                           isEcsDeporte:         Yup.boolean(),
                           volumeECSDeporte:     Yup.number(),
                           volumeECS:            Yup.string(),
                           cascadeSystem:        Yup.boolean(),
                           discount:             Yup.number().min( 0, 'La remise ne peut pas être inférieur à 0' ),
                       } );
};


export const validatePacRoStep4 = async ( data: PacRoFileStep, price: Price ): Promise<RoFile> => {
    let fileData = getCurrentRoFileData();

    let quotation: RoQuotation = fileData.quotation;

    console.log( '%c ECS', 'background: #fdd835; color: #000000' );
    console.log( '%c ECS', 'background: #fdd835; color: #000000' );
    console.log( '%c ECS', 'background: #fdd835; color: #000000' );
    console.log( '%c ECS', 'background: #fdd835; color: #000000' );
    console.log( data.volumeECS );

    // let volumeECS = data.volumeECS;
    // if ( data.volumeECS === undefined || data.volumeECS === null ) {
    //     volumeECS = 0;
    // }

    // let volumeECSDeporte = data.volumeECSDeporte;
    // if ( data.volumeECSDeporte === undefined || data.volumeECSDeporte === null ) {
    //     volumeECSDeporte = 150;
    // }

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        deviceToReplace: {
            type:  data.deviceToReplaceType,
            brand: data.deviceToReplaceBrand,
            model: data.deviceToReplaceModel,
        },
        volumeECS:       data.volumeECS,
        // volumeECSDeporte: volumeECSDeporte,
        isEcsDeporte:  data.isEcsDeporte,
        cascadeSystem: data.cascadeSystem,
    };

    fileData = {
        ...fileData,
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as RoFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

