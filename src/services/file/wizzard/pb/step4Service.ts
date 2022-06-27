import * as Yup from 'yup';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { PbFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentPbFileData } from '@/services/data/dataService';
import { PbQuotation } from '@/types/v2/File/Pb/PbQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { PbStep4 } from '@/types/v2/Wizzard/step4/PbStep4';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPbFormDataStep4 = ( fileData: PbFile ): PbStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
        creation: fileData.quotation.newCreation,
    };
};

export const yupPbConfigStep4 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep4(),
                           creation: Yup.boolean(),
                       } );
};


export const validatePbStep4 = async ( data: PbFileStep, price: Price ): Promise<PbFile> => {
    let fileData               = getCurrentPbFileData();
    let quotation: PbQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        newCreation: data.creation === undefined ? false : data.creation,
    };

    fileData = {
        ...fileData,
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as PbFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

