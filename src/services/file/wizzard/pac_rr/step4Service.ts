import * as Yup from 'yup';
import { getCurrentRrFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/types/v2/File/Price';
import { PacRrFileStep } from '@/types/v2/Wizzard/FileStep';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';
import { updateTotalTtc } from '@/services/sqliteService';
import {
    defaultGetBonusValueStep4,
    defaultGetQuotationValueStep4,
    defaultInitFormDataStep4,
    defaultYupConfigStep4,
} from '@/services/file/wizzard/step4Service';
import { PacRrStep4 } from '@/types/v2/Wizzard/step4/PacRrStep4';
import { updateFileReferenceTechnicalVisit } from '@/services/file/wizzard/step5Service';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPacRrFormDataStep4 = ( fileData: RrFile ): PacRrStep4 => {

    return {
        ...defaultInitFormDataStep4( fileData ),
        pacType:             fileData.quotation.rrType,
        assortment:          fileData.quotation.assortment,
        housingRoomNumber:   fileData.quotation.rrMulti.roomNumber,
        housingAreaP1:       fileData.quotation.rrMulti.areaP1,
        housingAreaP2:       fileData.quotation.rrMulti.areaP2,
        housingAreaP3:       fileData.quotation.rrMulti.areaP3,
        housingAreaP4:       fileData.quotation.rrMulti.areaP4,
        housingAreaP5:       fileData.quotation.rrMulti.areaP5,
        housingAssortmentP1: fileData.quotation.rrMulti.assortmentP1,
        housingAssortmentP2: fileData.quotation.rrMulti.assortmentP2,
        housingAssortmentP3: fileData.quotation.rrMulti.assortmentP3,
        housingAssortmentP4: fileData.quotation.rrMulti.assortmentP4,
        housingAssortmentP5: fileData.quotation.rrMulti.assortmentP5,
        discount:            fileData.quotation.discount,
    };
};

export const yupPacRrConfigStep4 = () => {
    return Yup.object( {
                           ...defaultYupConfigStep4(),
                           pacType:             Yup.string(),
                           assortment:          Yup.string(),
                           housingRoomNumber:   Yup.number()
                                                   .min( 2, 'Il doit y avoir au moins 2 pièces' )
                                                   .max( 5, 'Il doit y avoir au maximum 5 pièces' ),
                           housingAreaP1:       Yup.number().min( 0, 'La superficie ne peut pas être inférieur à 0' ),
                           housingAreaP2:       Yup.number().min( 0, 'La superficie ne peut pas être inférieur à 0' ),
                           housingAreaP3:       Yup.number().min( 0, 'La superficie ne peut pas être inférieur à 0' ),
                           housingAreaP4:       Yup.number().min( 0, 'La superficie ne peut pas être inférieur à 0' ),
                           housingAreaP5:       Yup.number().min( 0, 'La superficie ne peut pas être inférieur à 0' ),
                           discount:            Yup.number().min( 0, 'La remise ne peut pas être inférieur à 0' ),
                           housingAssortmentP1: Yup.string(),
                           housingAssortmentP2: Yup.string(),
                           housingAssortmentP3: Yup.string(),
                           housingAssortmentP4: Yup.string(),
                           housingAssortmentP5: Yup.string(),
                       } );
};


export const validatePacRrStep4 = async ( data: PacRrFileStep, price: Price ): Promise<RrFile> => {
    let fileData = getCurrentRrFileData();

    let quotation: RrQuotation = fileData.quotation;

    // Si modification de visite technique
    let updateFileReference = false;
    if ( quotation.requestTechnicalVisit !== data.requestTechnicalVisit ) {
        updateFileReference = true;
    }

    if ( data.pacType === 'mono' ) {
        data = {
            ...data,
            housingRoomNumber:   2,
            housingAreaP1:       1,
            housingAreaP2:       1,
            housingAreaP3:       1,
            housingAreaP4:       1,
            housingAreaP5:       1,
            housingAssortmentP1: 'perfera',
            housingAssortmentP2: 'perfera',
            housingAssortmentP3: 'perfera',
            housingAssortmentP4: 'perfera',
            housingAssortmentP5: 'perfera',
        };
    }

    quotation = {
        ...quotation,
        ...defaultGetQuotationValueStep4( data, price ),
        rrType:     data.pacType,
        assortment: data.assortment !== undefined ? data.assortment : 'sensira',
        rrMulti:    {
            roomNumber:   +data.housingRoomNumber,
            areaP1:       +data.housingAreaP1,
            areaP2:       +data.housingAreaP2,
            areaP3:       +data.housingAreaP3,
            areaP4:       +data.housingAreaP4,
            areaP5:       +data.housingAreaP5,
            assortmentP1: data.housingAssortmentP1,
            assortmentP2: data.housingAssortmentP2,
            assortmentP3: data.housingAssortmentP3,
            assortmentP4: data.housingAssortmentP4,
            assortmentP5: data.housingAssortmentP5,
        },
    };

    fileData = {
        ...fileData,
        ...defaultGetBonusValueStep4( data ),
        quotation,
    };

    if ( updateFileReference ) {
        fileData = updateFileReferenceTechnicalVisit( fileData, data.requestTechnicalVisit === true ) as RrFile;
    }

    updateJsonData( fileData );
    updateTotalTtc( fileData.ref, fileData.quotation.totalTtc );

    return fileData;
};

