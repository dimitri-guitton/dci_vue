import { Price } from '@/types/v2/File/Price';
import { getCurrentSolFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { SolFileStep } from '@/types/v2/Wizzard/FileStep';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';
import {
    defaultGetBonusValueStep4,
    defaultGetQuotationValueStep4,
    defaultInitFormDataStep4,
    defaultYupConfigStep4,
} from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';
import { SolStep4 } from '@/types/v2/Wizzard/step4/SolStep4';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initSolFormDataStep4 = ( fileData: SolFile ): SolStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
        izolationZone: fileData.quotation.izolationZone,
    };
};

export const yupSolConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateSolStep4 = async ( data: SolFileStep, price: Price ): Promise<SolFile> => {
    let fileData                = getCurrentSolFileData();
    let quotation: SolQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        izolationZone: data.izolationZone,
    };

    fileData = {
        ...fileData,
        ...defaultGetBonusValueStep4( data ),
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as SolFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

