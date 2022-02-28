import * as Yup from 'yup';
import { Housing } from '@/types/v2/File/Common/Housing';
import { updateJsonData } from '@/services/folder/folderService';
import { getEnergyZone } from '@/services/file/fileCommonService';
import { PacRoFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentRoFileData } from '@/services/data/dataService';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';

/**
 * Retourne les valeurs du formualire pour l'etape 3 selon le type de dossiser
 * @param fileData
 */
export const initPacRoFormDataStep3 = ( fileData: RoFile ) => {
    return {
        nbOccupant:               fileData.housing.nbOccupant,
        housingType:              fileData.housing.type,
        housingConstructionYear:  fileData.housing.constructionYear,
        housingLessThan2Years:    fileData.housing.lessThan2Years,
        housingIsAddressBenef:    fileData.housing.isAddressBenef,
        area:                     fileData.housing.area,
        housingBuildingNature:    fileData.housing.buildingNature !== undefined ? fileData.housing.buildingNature : 'maison_individuelle',
        housingInsulationQuality: fileData.housing.insulationQuality !== undefined ? fileData.housing.insulationQuality : 1,
        housingAvailableVoltage:  fileData.housing.availableVoltage !== undefined ? fileData.housing.availableVoltage : 'monophase',
        housingCeilingHeight:     fileData.quotation.ceilingHeight !== undefined ? fileData.quotation.ceilingHeight : 2.5,
    };
};

export const yupPacRoConfigStep3 = () => {
    return Yup.object( {
                           nbOccupant:              Yup.number().required(),
                           housingType:             Yup.string().required(),
                           housingConstructionYear: Yup.number().positive().nullable( true ),
                           housingCeilingHeight:    Yup.number().positive().required(),
                       } );
};

export const validatePacRoStep3 = async ( data: PacRoFileStep ): Promise<RoFile> => {
    let fileData = getCurrentRoFileData();

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
        location: '',
    };
    if ( data.housingIsAddressBenef ) {
        address = {
            address:  fileData.beneficiary.address,
            zipCode:  fileData.beneficiary.zipCode,
            city:     fileData.beneficiary.city,
            plot:     '',
            location: '',
        };
    }

    console.log( data );
    const housing: Housing = {
        ...fileData.housing,
        nbOccupant:        data.nbOccupant,
        type:              data.housingType,
        isRentedHouse:     data.housingBuildingNature === 'location',
        buildingNature:    data.housingBuildingNature,
        isAddressBenef:    data.housingIsAddressBenef,
        insulationQuality: data.housingInsulationQuality,
        availableVoltage:  data.housingAvailableVoltage,
        area:              data.area,
        ...address,
        constructionYear: data.housingConstructionYear,
        lessThan2Years:   data.housingLessThan2Years,
    };

    const quotation: RoQuotation = ( fileData.quotation as RoQuotation );

    const newQuotation: RoQuotation = {
        ...quotation,
        ceilingHeight: data.housingCeilingHeight,
    };

    let zipCode = fileData.beneficiary.zipCode;
    if ( !housing.isAddressBenef ) {
        zipCode = housing.zipCode;
    }

    fileData = {
        ...fileData,
        housing:    housing,
        quotation:  newQuotation,
        energyZone: getEnergyZone( +zipCode ),
    };

    updateJsonData( fileData );

    return fileData;
};


