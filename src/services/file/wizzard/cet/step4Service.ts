import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentCetFileData } from '@/services/data/dataService';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { defaultGetQuotationValueStep4, defaultInitFormDataStep4, defaultYupConfigStep4 } from '@/services/file/wizzard/step4Service';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { updateTotalTtc } from '@/services/sqliteService';

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
