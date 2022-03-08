import * as Yup from 'yup';
import { updateBeneficiary } from '@/services/data/dataService';
import { AllFile } from '@/types/v2/File/All';

export const validateStepTwo = ( data ): AllFile => {
    return updateBeneficiary( data );
};
export const yupConfigStep2  = () => {
    return Yup.object( {
                           assentsDatas: Yup.array()
                                            .of(
                                                Yup.object().shape( {
                                                                        civility:      Yup.string()
                                                                                          .required(),
                                                                        lastName:      Yup.string()
                                                                                          .required(),
                                                                        firstName:     Yup.string()
                                                                                          .required(),
                                                                        address:       Yup.string()
                                                                                          .required(),
                                                                        zipCode:       Yup.string()
                                                                                          .matches(
                                                                                              /^([0-8][0-9]|9[0-5])[0-9]{3}/,
                                                                                              {
                                                                                                  message: 'Le code postal est incorrect',
                                                                                              } )
                                                                                          .required(),
                                                                            city:      Yup.string()
                                                                                          .required(),
                                                                            income:    Yup.number()
                                                                                          .required()
                                                                                          .min( 1,
                                                                                                'Le revenu doit être supérieur à 0' ),
                                                                        } ),
                                                ),
                           indexBeneficiary: Yup.number().required(),
                           email:            Yup.string().required().email(),
                           phone:            Yup.string().matches(
                               /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gm,
                               {
                                   message:            'Le numéro est incorrect',
                                   excludeEmptyString: true,
                               } ),
                           mobile:           Yup.string().matches(
                               /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/gm,
                               {
                                   message:            'Le numéro est incorrect',
                                   excludeEmptyString: true,
                               } ),
                       } );
};
