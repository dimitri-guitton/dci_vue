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
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';
import { CpvFile } from '@/types/v2/File/Cpv/CpvFile';
import { CpvQuotation } from '@/types/v2/File/Cpv/CpvQuotation';
import { CPVStep4 } from '@/types/v2/Wizzard/step4/CPVStep4';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initCpvFormDataStep4 = ( fileData: CpvFile ): CPVStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
        attachedToAHouse: fileData.quotation.attachedToAHouse ?? false,
    };

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
        attachedToAHouse: data.attachedToAHouse,
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
