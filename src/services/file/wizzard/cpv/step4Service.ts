import { CpvFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentCpvFileData } from '@/services/data/dataService';
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
import { CpvFile } from '@/types/v2/File/Cpv/CpvFile';
import { CpvQuotation } from '@/types/v2/File/Cpv/CpvQuotation';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initCpvFormDataStep4 = ( fileData: CpvFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupCpvConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateCpvStep4 = async ( data: CpvFileStep, price: Price ): Promise<CpvFile> => {
    let fileData                = getCurrentCpvFileData();
    let quotation: CpvQuotation = fileData.quotation;

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
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as CpvFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};
