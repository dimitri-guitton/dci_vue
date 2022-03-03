import * as Yup from 'yup';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { BaseStep3 } from '@/types/v2/Wizzard/step3/BaseStep3';
import { Housing } from '@/types/v2/File/Common/Housing';
import { getEnergyZone } from '@/services/file/fileCommonService';

export const defaultInitFormDataStep3 = ( data: BaseFile ) => {
    return {
        nbOccupant:              data.housing.nbOccupant,
        housingType:             data.housing.type,
        housingConstructionYear: data.housing.constructionYear,
        housingLessThan2Years:   data.housing.lessThan2Years,
        housingIsAddressBenef:   data.housing.isAddressBenef,
        address:                 {
            plot:    data.housing.plot,
            address: data.housing.address,
            zipCode: data.housing.zipCode,
            city:    data.housing.city,
        },
        area:                    data.housing.area,
    };
};

export const defaultYupConfigStep3 = () => {
    return {
        nbOccupant:              Yup.number().required(),
        housingType:             Yup.string().required(),
        housingConstructionYear: Yup.number().positive().nullable( true ),
        address:                 Yup.object().shape( {
                                                         plot:    Yup.string(),
                                                         address: Yup.string(),
                                                         zipCode: Yup.string()
                                                                     .matches(
                                                                         /^([0-8][0-9]|9[0-5])[0-9]{3}/,
                                                                         {
                                                                             excludeEmptyString: true,
                                                                             message:            'Le code postal est incorrect',
                                                                         } )
                                                         ,
                                                         city: Yup.string(),
                                                     } ),
    };
};

export const defaultGetHoussingValueStep3 = ( fileData: BaseFile, stepData: BaseStep3 ) => {
    // let address;

    // if ( stepData.housingIsAddressBenef ) {
    //     address = {
    //         address:  fileData.beneficiary.address,
    //         zipCode:  fileData.beneficiary.zipCode,
    //         city:     fileData.beneficiary.city,
    //         plot:     '',
    //         location: '',
    //     };
    // } else {
    const address = {
        address:  stepData.address.address,
        zipCode:  stepData.address.zipCode,
        city:     stepData.address.city,
        plot:     stepData.address.plot,
        location: '',
    };
    // }

    return {
        nbOccupant:       +stepData.nbOccupant,
        type:             stepData.housingType,
        constructionYear: stepData.housingConstructionYear === null ? null : +stepData.housingConstructionYear,
        lessThan2Years:   stepData.housingLessThan2Years === undefined ? false : stepData.housingLessThan2Years,
        isAddressBenef:   stepData.housingIsAddressBenef === undefined ? false : stepData.housingIsAddressBenef,
        area:             +stepData.area,
        ...address,
    };
};

export const defaultGetEnergyZoneStep3 = ( fileData: BaseFile, housing: Housing ) => {
    let zipCode = housing.zipCode;

    if ( housing.isAddressBenef ) {
        zipCode = fileData.beneficiary.zipCode;
    }
    return {
        energyZone: getEnergyZone( +zipCode ),
    };
};
