import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { PvFileStep } from '@/types/v2/Wizzard/FileStep';
import { BaseStep4 } from '@/types/v2/Wizzard/step4/BaseStep4';
import { getCurrentPvFileData, getProductById } from '@/services/data/dataService';
import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
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
import { Product } from '@/types/v2/File/Common/Product';

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
    let fileData               = getCurrentPvFileData();
    let quotation: PvQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    const selectedProducts: Product[] = [];
    for ( const selectedProduct of data.selectedProducts ) {
        const jsonSelectedProduct = getProductById( selectedProduct.id );

        if ( jsonSelectedProduct !== undefined ) {
            selectedProducts.push( { ...jsonSelectedProduct, pu: +selectedProduct.pu, quantity: +selectedProduct.quantity } );
        }
    }


    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        selectedProducts,
    };

    fileData = {
        ...fileData,
        ...defaultGetBonusValueStep4( data ),
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as PvFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

