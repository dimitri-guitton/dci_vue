import * as Yup from 'yup';
import { Product } from '@/types/v2/File/Common/Product';
import { StepOption, StepProduct } from '@/types/v2/Wizzard/step4/BaseStep4';
import { getBlankOptionById, getCurrentRrFileData, getOptionById, getProductById } from '@/services/data/dataService';
import { Option } from '@/types/v2/File/Common/Option';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/services/file/wizzard/Price';
import { PacRrFileStep } from '@/types/v2/Wizzard/FileStep';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initPacRrFormDataStep4 = ( fileData: RrFile ) => {

    const options: StepOption[] = [];
    for ( const o of fileData.quotation.options ) {
        options.push( { id: o.id, pu: o.pu, number: o.number } );
    }

    const blankOptions: StepOption[] = [];
    for ( const bo of fileData.quotation.blankOptions ) {
        blankOptions.push( { id: bo.id, pu: bo.pu, number: bo.number } );
    }

    const selectedProducts: StepProduct[] = [];
    for ( const sp of fileData.quotation.selectedProducts ) {
        selectedProducts.push( { id: sp.id, pu: sp.pu } );
    }

    return {
        origin:              fileData.quotation.origin,
        dateTechnicalVisit:  fileData.quotation.dateTechnicalVisit,
        executionDelay:      fileData.quotation.executionDelay,
        options,
        blankOptions,
        selectedProducts,
        commentary:          fileData.quotation.commentary,
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

    };
};

export const yupPacRrConfigStep4 = () => {
    return Yup.object( {
                           origin:              Yup.string(),
                           dateTechnicalVisit:  Yup.string(),
                           executionDelay:      Yup.string(),
                           commentary:          Yup.string(),
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
                           housingAssortmentP1: Yup.string(),
                           housingAssortmentP2: Yup.string(),
                           housingAssortmentP3: Yup.string(),
                           housingAssortmentP4: Yup.string(),
                           housingAssortmentP5: Yup.string(),
                           selectedProducts:    Yup.array()
                                                   .of(
                                                       Yup.object().shape( {
                                                                               pu: Yup.number()
                                                                                      .required()
                                                                                      .min( 0,
                                                                                            'Le montant doit être supérieur ou égal à 0' ),
                                                                           } ),
                                                   ),
                           options:             Yup.array()
                                                   .of(
                                                       Yup.object().shape( {
                                                                               pu:     Yup.number()
                                                                                          .required()
                                                                                          .min( 0,
                                                                                                'Le montant doit être supérieur ou égal à 0' ),
                                                                               number: Yup.number()
                                                                                          .required()
                                                                                          .min( 0,
                                                                                                'Le nombre doit être supérieur ou égal à 0' ),
                                                                           } ),
                                                   ),
                       } );
};


export const validatePacRrStep4 = async ( data: PacRrFileStep, price: Price ): Promise<RrFile> => {
    let fileData = getCurrentRrFileData();

    const selectedProducts: Product[] = [];
    const options: Option[]           = [];
    const blankOptions: BlankOption[] = [];

    for ( const option of data.options ) {
        const jsonOption = getOptionById( option.id );

        if ( jsonOption !== undefined ) {
            options.push( { ...jsonOption, number: option.number, pu: option.pu } );
        }
    }

    for ( const blankOption of data.blankOptions ) {
        const jsonBlankOption = getBlankOptionById( blankOption.id );

        if ( jsonBlankOption !== undefined ) {
            blankOptions.push( { ...jsonBlankOption, number: blankOption.number, pu: blankOption.pu } );
        }
    }

    for ( const selectedProduct of data.selectedProducts ) {
        const jsonSelectedProduct = getProductById( selectedProduct.id );

        if ( jsonSelectedProduct !== undefined ) {
            selectedProducts.push( { ...jsonSelectedProduct, pu: selectedProduct.pu } );
        }
    }


    let quotation: RrQuotation = fileData.quotation;

    quotation = {
        ...quotation,
        selectedProducts,
        options,
        blankOptions,
        dateTechnicalVisit: data.dateTechnicalVisit,
        executionDelay:     data.executionDelay,
        origin:             data.origin,
        totalHt:            price.HT,
        totalTva:           price.TVA,
        tva10:              price.TVA10 ? price.TVA10 : 0,
        tva20:              price.TVA20 ? price.TVA20 : 0,
        totalTtc:           price.TTC,
        ceeBonus:           price.CEE ? price.CEE : 0,
        discount:           price.discount ? price.discount : 0,
        maPrimeRenovBonus:  price.maPrimeRenov !== undefined ? price.maPrimeRenov : 0,
        remainderToPay:     price.remainderToPay,
        rrType:             data.pacType,
        assortment:         data.assortment !== undefined ? data.assortment : 'sensira',
        rrMulti:            {
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
        quotation,
    };

    updateJsonData( fileData );

    return fileData;
};

