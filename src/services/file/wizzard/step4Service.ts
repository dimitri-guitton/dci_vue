import * as Yup from 'yup';
import { CetFile } from '@/types/v2/File/Cet/CetFile';

/**
 * Retourne les valeurs du formulaire pour l'etape 4
 * @param fileData
 */
export const initCetFormDataStep4 = ( fileData: CetFile ) => {
    return {
        origin:             fileData.quotation.origin,
        dateTechnicalVisit: fileData.quotation.dateTechnicalVisit,
        executionDelay:     fileData.quotation.executionDelay,
        // options:            fileData.quotation.options,
        // blankOptions:       fileData.quotation.blankOptions,
        // selectedProducts:   fileData.quotation.selectedProducts,
        selectedProducts: [],
        commentary:       fileData.quotation.commentary,
    };
};

export const yupCetConfigStep4 = () => {
    // origin: string;
    // dateTechnicalVisit: string;
    // executionDelay: string;
    // options: Option[ ];
    // blankOptions: BlankOption[ ];
    // selectedProducts: Product[ ];
    // commentary: string;
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

