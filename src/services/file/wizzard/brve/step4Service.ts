import { BrveFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentBrveFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import {
    defaultGetBonusValueStep4,
    defaultGetQuotationValueStep4,
    defaultInitFormDataStep4,
    defaultYupConfigStep4,
} from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';
import { BrveFile } from '@/types/v2/File/Brve/BrveFile';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { BrveQuotation } from '@/types/v2/File/Brve/BrveQuotation';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initBrveFormDataStep4 = ( fileData: BrveFile ): BaseStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
    };

};

export const yupBrveConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateBrveStep4 = async ( data: BrveFileStep, price: Price ): Promise<BrveFile> => {
    let fileData                 = getCurrentBrveFileData();
    let quotation: BrveQuotation = fileData.quotation;

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
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as BrveFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};
