import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { CombleFileStep } from '@/types/v2/Wizzard/FileStep';
import { Price } from '@/types/v2/File/Price';
import { getCurrentCombleFileData } from '@/services/data/dataService';
import { CombleQuotation } from '@/types/v2/File/Comble/CombleQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import {
    defaultGetBonusValueStep4,
    defaultGetQuotationValueStep4,
    defaultInitFormDataStep4,
    defaultYupConfigStep4,
} from '@/services/file/wizzard/step4Service';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initCombleFormDataStep4 = ( fileData: CombleFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupCombleConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateCombleStep4 = async ( data: CombleFileStep, price: Price ): Promise<CombleFile> => {
    let fileData                   = getCurrentCombleFileData();
    let quotation: CombleQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
    };

    fileData = {
        ...fileData,
        ...defaultGetBonusValueStep4( data ),
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as CombleFile;
    }
    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

