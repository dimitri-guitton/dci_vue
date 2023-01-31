import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentCetFileData } from '@/services/data/dataService';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
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
export const initCetFormDataStep4 = ( fileData: CetFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupCetConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateCetStep4 = async ( data: CetFileStep, price: Price ): Promise<CetFile> => {
    let fileData                = getCurrentCetFileData();
    let quotation: CetQuotation = fileData.quotation;

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
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as CetFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};
