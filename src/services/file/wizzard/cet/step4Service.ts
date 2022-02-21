import * as Yup from 'yup';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { Product } from '@/types/v2/File/Common/Product';
import { StepOption, StepProduct } from '@/types/v2/Wizzard/step4/BaseStep4';
import { getBlankOptionById, getCurrentCetFileData, getOptionById, getProductById } from '@/services/data/dataService';
import { Option } from '@/types/v2/File/Common/Option';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { updateJsonData } from '@/services/folder/folderService';
import { Price } from '@/services/file/wizzard/Price';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initCetFormDataStep4 = ( fileData: CetFile ) => {

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
        origin:             fileData.quotation.origin,
        dateTechnicalVisit: fileData.quotation.dateTechnicalVisit,
        executionDelay:     fileData.quotation.executionDelay,
        options,
        blankOptions,
        selectedProducts,
        commentary:         fileData.quotation.commentary,
    };
};

export const yupCetConfigStep4 = () => {
    return Yup.object( {
                           origin:             Yup.string(),
                           dateTechnicalVisit: Yup.string(),
                           executionDelay:     Yup.string(),
                           commentary:         Yup.string(),
                           selectedProducts:   Yup.array()
                                                  .of(
                                                      Yup.object().shape( {
                                                                              pu: Yup.number()
                                                                                     .required()
                                                                                     .min( 0,
                                                                                           'Le montant doit être supérieur ou égal à 0' ),
                                                                          } ),
                                                  ),
                           options:            Yup.array()
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


export const validateCetStep4 = async ( data: CetFileStep, price: Price ) => {
    let fileData = getCurrentCetFileData();

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


    let quotation: CetQuotation = fileData.quotation;

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
        totalTtc:           price.TTC,
        ceeBonus:           price.CEE ? price.CEE : 0,
        discount:           price.discount ? price.discount : 0,
        maPrimeRenovBonus:  price.maPrimeRenov,
        remainderToPay:     price.remainderToPay,
    };

    fileData = {
        ...fileData,
        quotation,
    };

    updateJsonData( fileData );
};

