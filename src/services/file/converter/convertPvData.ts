import {
    convertBaseQuotation,
    convertOldAssent,
    convertOldBeneficiary,
    convertOldDataGeoportail,
    convertOldErrorStatusDci,
    convertOldScales,
    convertOldStatusDci,
    convertTechnician,
    getBoolData,
    getNullableNumberData,
    getNumberData,
    getObjectData,
    getStringData,
} from '@/services/file/converter/convertData';
import { Product } from '@/types/v2/File/Common/Product';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { FILE_PV } from '@/services/constantService';
import PvList from '@/types/v2/File/Pv/PvList';
import { PvFile } from '@/types/v2/File/Pv/PvFile';

const convertOldPvProduct = ( oldData ): Product[] => {
    const pvProducts: Product[] = [];
    const oldProducts: []       = getObjectData( oldData,
                                                 [
                                                     'devis',
                                                     'pv',
                                                     'products',
                                                 ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                            [
                                                                                                'devis',
                                                                                                'pv',
                                                                                                'products',
                                                                                            ] );


    let index = 1;
    oldProducts.forEach( product => {
        pvProducts.push( {
                             id:          index,
                             productType: FILE_PV,
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'pu' ],
                             description: product[ 'description' ],
                             quantity:    product[ 'quantity' ],
                             power:       product[ 'power' ],
                         } );

        index++;
    } );
    return pvProducts;
};

const convertOldPvItemList = ( oldData ): PvList => {
    const lists: PvList = {
        localTypeList:         [],
        qualiteIsolationList:  [],
        statutMenageTypeList:  [],
        batimentNatureList:    [],
        niveauHabitationList:  [],
        typeChantierList:      [],
        puissanceCompteurList: [],
        generateurList:        [],
        conduitList:           [],
        resistanceList:        [],
        toitureList:           [],
        couleurProfileList:    [],
        puissancePoeleList:    [],
        zoneInstallationList:  [],
        typeOrigineList:       [],
    };

    const pvItems = [
        'localType',
        'qualiteIsolation',
        'statutMenageType',
        'batimentNature',
        'niveauHabitation',
        'typeChantier',
        'puissanceCompteur',
        'generateur',
        'conduit',
        'resistance',
        'toiture',
        'couleurProfile',
        'puissancePoele',
        'zoneInstallation',
        'typeOrigine',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':         'localTypeList',
        'qualiteIsolation':  'qualiteIsolationList',
        'statutMenageType':  'statutMenageTypeList',
        'batimentNature':    'batimentNatureList',
        'niveauHabitation':  'niveauHabitationList',
        'typeChantier':      'typeChantierList',
        'puissanceCompteur': 'puissanceCompteurList',
        'generateur':        'generateurList',
        'conduit':           'conduitList',
        'resistance':        'resistanceList',
        'toiture':           'toitureList',
        'couleurProfile':    'couleurProfileList',
        'puissancePoele':    'puissancePoeleList',
        'zoneInstallation':  'zoneInstallationList',
        'typeOrigine':       'typeOrigineList',
    };


    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut

    for ( const item of pvItems ) {
        const oldList = getObjectData( oldData[ 'lists' ], [ item ] );
        if ( !oldList ) {
            continue;
        }
        const newItems: ItemList[] = [];

        oldList.forEach( ( data ) => {
            if ( typeof data === 'object' ) {
                newItems.push( {
                                   slug:  Object.keys( data )[ 0 ],
                                   value: data[ Object.keys( data )[ 0 ] ],
                               } );
            } else {
                newItems.push( {
                                   slug:  data,
                                   value: data,
                               } );
            }
        } );


        lists[ newName[ item ] ] = newItems;
    }

    return lists;
};

export const convertOldPvFile = ( oldData ): PvFile => {
    return {
        version:                   '1',
        type:                      FILE_PV,
        ref:                       getStringData( oldData[ 'ref' ] ),
        folderName:                getStringData( oldData[ 'folderName' ] ),
        createdAt:                 getStringData( oldData[ 'createdAt' ] ),
        updatedAt:                 getStringData( oldData[ 'updatedAt' ] ),
        settings:                  oldData[ 'settings' ],
        disabledBonus:             getBoolData( oldData[ 'disablePrime' ] ),
        disabledCeeBonus:          getBoolData( oldData[ 'disablePrimeCEE' ] ),
        disabledMaPrimeRenovBonus: getBoolData( oldData[ 'disablePrimeMaprimerenov' ] ),
        assents:                   convertOldAssent( oldData ),
        beneficiary:               convertOldBeneficiary( oldData ),
        codeBonus:                 getStringData( oldData[ 'codePrime' ] ),
        energyZone:                getStringData( oldData[ 'zoneEnergetique' ] ),
        housing:                   {
            nbOccupant:        getNumberData( oldData [ 'logement' ][ 'occupants' ] ),
            type:              getObjectData( oldData, [ 'logement', 'localType' ] ),
            heatingType:       getObjectData( oldData, [ 'logement', 'chauffageType' ] ),
            buildingNature:    getObjectData( oldData, [ 'logement', 'batimentNature' ] ),
            isRentedHouse:     getObjectData( oldData, [ 'logement', 'batimentNature' ] ) === 'location',
            isAddressBenef:    getObjectData( oldData, [ 'logement', 'isAdresseBenef' ] ),
            address:           getObjectData( oldData, [ 'logement', 'adresse' ] ),
            zipCode:           getObjectData( oldData, [ 'logement', 'codepostal' ] ),
            city:              getObjectData( oldData, [ 'logement', 'ville' ] ),
            plot:              getObjectData( oldData, [ 'logement', 'parcelle' ] ),
            area:              getObjectData( oldData, [ 'logement', 'superficie' ] ),
            dataGeoportail:    convertOldDataGeoportail( oldData ),
            location:          getObjectData( oldData, [ 'logement', 'location' ] ),
            insulationQuality: getObjectData( oldData, [ 'logement', 'qualiteIsolation' ] ),
            constructionYear:  getNullableNumberData( oldData [ 'logement' ][ 'anneeConstruction' ] ),
            lessThan2Years:    getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:  '',
        },
        worksheet:                 {
            period:   getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            infosSup: getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
        },
        quotation: {
            ...convertBaseQuotation( oldData ),
            tva10:                0,
            tva20:                0,
            ceeBonus:             getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            selectedProducts:     [],
            products:             convertOldPvProduct( oldData ),
            selfConsumptionBonus: 0,
        },
        scales:                    convertOldScales( oldData ),
        statusInDci:               convertOldStatusDci( oldData ),
        errorsStatusInDci:         convertOldErrorStatusDci( oldData ),
        technician:                convertTechnician( oldData ),
        lists:                     convertOldPvItemList( oldData ),
    };
};
