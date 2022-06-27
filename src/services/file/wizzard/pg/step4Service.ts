import { getCurrentPgFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { PgFileStep } from '@/types/v2/Wizzard/FileStep';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPgFormDataStep4 = ( fileData: PgFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupPgConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validatePgStep4 = async ( data: PgFileStep, price: Price ): Promise<PgFile> => {
    let fileData               = getCurrentPgFileData();
    let quotation: PgQuotation = fileData.quotation;

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
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as PgFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

