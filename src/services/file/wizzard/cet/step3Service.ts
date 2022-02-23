import * as Yup from 'yup';
import { getCurrentCetFileData } from '@/services/data/dataService';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';

/**
 * Retourne les valeurs du formualire pour l'etape 3 selon le type de dossiser
 * @param fileData
 */
export const initCetFormDataStep3 = ( fileData ) => {
    return {
        nbOccupant:              fileData.housing.nbOccupant,
        housingType:             fileData.housing.type,
        housingConstructionYear: fileData.housing.constructionYear,
        housingLessThan2Years:   fileData.housing.lessThan2Years,
        housingIsAddressBenef:   fileData.housing.isAddressBenef,
        housingHeatingType:      fileData.housing.heatingType !== undefined ? fileData.housing.heatingType : '',
        housingBuildingNature:   fileData.housing.buildingNature !== undefined ? fileData.housing.buildingNature : '',
    };
};

export const yupCetConfigStep3 = () => {
    return Yup.object( {
                           nbOccupant:              Yup.number().required(),
                           housingType:             Yup.string().required(),
                           housingConstructionYear: Yup.number().required(),
                       } );
};

export const validateCetStep3 = async ( data: CetFileStep ) => {
    let fileData = getCurrentCetFileData();

    if ( data.housingLessThan2Years === undefined ) {
        data.housingLessThan2Years = false;
    }

    if ( data.housingIsAddressBenef === undefined ) {
        data.housingIsAddressBenef = false;
    }

    let address = {
        address:  '',
        zipCode:  '',
        city:     '',
        plot:     '',
        area:     '',
        location: '',
    };
    if ( data.housingIsAddressBenef ) {
        address = {
            address:  fileData.beneficiary.address,
            zipCode:  fileData.beneficiary.zipCode,
            city:     fileData.beneficiary.city,
            plot:     '',
            area:     '',
            location: '',
        };
    }

    console.log( data );
    const housing: Housing = {
        ...fileData.housing,
        nbOccupant:     data.nbOccupant,
        type:           data.housingType,
        heatingType:    data.housingHeatingType,
        isRentedHouse:  data.housingBuildingNature === 'location',
        buildingNature: data.housingBuildingNature,
        isAddressBenef: data.housingIsAddressBenef,
        ...address,
        constructionYear: data.housingConstructionYear,
        lessThan2Years:   data.housingLessThan2Years,
    };

    fileData = {
        ...fileData,
        housing: housing,
    };

    updateJsonData( fileData );
};


