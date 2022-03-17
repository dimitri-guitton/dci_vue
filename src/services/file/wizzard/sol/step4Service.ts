import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { Price } from '@/types/v2/File/Price';
import { getCurrentSolFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { SolFileStep } from '@/types/v2/Wizzard/FileStep';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initSolFormDataStep4 = ( fileData: SolFile ): BaseStep4 => {
    return defaultInitFormDataStep4( fileData );
};

export const yupSolConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateSolStep4 = async ( data: SolFileStep, price: Price ): Promise<SolFile> => {
    let fileData                = getCurrentSolFileData();
    let quotation: SolQuotation = fileData.quotation;

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

