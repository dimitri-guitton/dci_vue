import { getCurrentPgFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { PgFileStep } from '@/types/v2/Wizzard/FileStep';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';
import {
    defaultGetBonusValueStep4,
    defaultGetQuotationValueStep4,
    defaultInitFormDataStep4,
    defaultYupConfigStep4,
} from '@/services/file/wizzard/step4Service';
import { updateTotalTtc } from '@/services/sqliteService';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';
import { PgStep4 } from '@/types/v2/Wizzard/step4/PgStep4';
import * as Yup from 'yup';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPgFormDataStep4 = ( fileData: PgFile ): PgStep4 => {
    return {
        ...defaultInitFormDataStep4( fileData ),
        outsideSocket: fileData.quotation.outsideSocket ?? false,
        smoke:         fileData.quotation.smoke ?? 'back',
    };

};

export const yupPgConfigStep4 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep4(),
                           outsideSocket: Yup.boolean(),
                           smoke:         Yup.string(),
                       } );
};


export const validatePgStep4 = async ( data: PgFileStep, price: Price ): Promise<PgFile> => {
    let fileData               = getCurrentPgFileData();
    let quotation: PgQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    console.log( data );
    console.log( '%c SAVE PG 4', 'background: #fdd835; color: #000000' );
    console.log( data.outsideSocket );
    console.log( data.smoke );

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        outsideSocket: data.outsideSocket === undefined ? false : data.outsideSocket,
        smoke:         data.smoke === undefined ? 'back' : data.smoke,
    };

    fileData = {
        ...fileData,
        ...defaultGetBonusValueStep4( data ),
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as PgFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

