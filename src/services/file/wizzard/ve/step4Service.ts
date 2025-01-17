import { VeFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentVeFileData } from '@/services/data/dataService';
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
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { VeFile } from '@/types/v2/File/Ve/VeFile';
import { VeQuotation } from '@/types/v2/File/Ve/VeQuotation';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initVeFormDataStep4 = ( fileData: VeFile ): BaseStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
    };

};

export const yupVeConfigStep4 = () => {
    return defaultYupConfigStep4();
};


export const validateVeStep4 = async ( data: VeFileStep, price: Price ): Promise<VeFile> => {
    let fileData               = getCurrentVeFileData();
    let quotation: VeQuotation = fileData.quotation;

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
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as VeFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};
