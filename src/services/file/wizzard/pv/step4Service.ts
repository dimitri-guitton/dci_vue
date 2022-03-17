import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { PvFileStep } from '@/types/v2/Wizzard/FileStep';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { getCurrentPvFileData } from '@/services/data/dataService';
import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPvFormDataStep4 = ( fileData: PvFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupPvConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validatePvStep4 = async ( data: PvFileStep, price: Price ): Promise<PvFile> => {
    let fileData = getCurrentPvFileData();
    let quotation: PvQuotation = fileData.quotation;

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
    };

    fileData = {
        ...fileData,
        quotation,
    };

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

