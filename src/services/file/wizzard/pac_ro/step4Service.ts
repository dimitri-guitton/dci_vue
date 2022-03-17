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
        volumeECSDeporte:     fileData.quotation.volumeECSDeporte,
        volumeECS:            fileData.quotation.volumeECS,
        cascadeSystem:        fileData.quotation.cascadeSystem,
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
                           volumeECS:            Yup.number(),
                           cascadeSystem:        Yup.boolean(),
                       } );
};


export const validatePacRoStep4 = async ( data: PacRoFileStep, price: Price ): Promise<RoFile> => {
    let fileData = getCurrentRoFileData();

    let quotation: RoQuotation = fileData.quotation;

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        deviceToReplace:  {
            type:  data.deviceToReplaceType,
            brand: data.deviceToReplaceBrand,
            model: data.deviceToReplaceModel,
        },
        volumeECS:        data.volumeECS,
        volumeECSDeporte: data.volumeECSDeporte,
        isEcsDeporte:     data.isEcsDeporte,
        cascadeSystem:    data.cascadeSystem,
    };

    fileData = {
        ...fileData,
        quotation,
    };

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

