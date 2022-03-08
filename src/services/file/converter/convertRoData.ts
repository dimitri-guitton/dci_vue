import {
    convertBaseQuotation,
    convertOldAssent,
    convertOldBeneficiary,
    convertOldDataGeoportail,
    convertOldErrorStatusDci,
    convertOldScales,
    convertOldStatusDci,
    convertTechnician,
    getArrayData,
    getBoolData,
    getNullableNumberData,
    getNumberData,
    getObjectData,
    getStringData,
} from '@/services/file/converter/convertData';
import { Product } from '@/types/v2/File/Common/Product';
import RoList from '@/types/v2/File/Ro/RoList';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { FILE_PAC_RO } from '@/services/constantService';
import path from 'path';
import fs from 'fs';

declare const __static: string;


const getEtas = ( description: string ): number => {
    const regex = /etas.*(\d{3}).*%/gmi;
    let m;
    let etas    = 0;

    while ( ( m = regex.exec( description ) ) !== null ) {
        if ( m.index === regex.lastIndex ) {
            regex.lastIndex++;
        }

        etas = m[ 1 ];
    }

    return +etas;
};

const convertOldRoProduct = ( oldData ): Product[] => {
    const roProducts: Product[] = [];
    // const oldProducts: []       = getObjectData( oldData,
    //                                              [
    //                                                  'devis',
    //                                                  'pompeAChaleur',
    //                                                  'products',
    //                                              ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
    //                                                                                         [
    //                                                                                             'devis',
    //                                                                                             'pompeAChaleur',
    //                                                                                             'products',
    //                                                                                         ] );


    const pathToNewPac           = path.join( __static, '/data/new_pac_ro.json' );
    const oldProducts: Product[] = JSON.parse( fs.readFileSync( pathToNewPac, 'utf8' ) );

    oldProducts.forEach( product => {
        roProducts.push( {
                             id:          product[ 'id' ],
                             productType: FILE_PAC_RO,
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             scop:        product[ 'scop' ],
                             quantity:    1,
                             etas:        getEtas( product[ 'descr' ] ),
                         } );
    } );

    const oldEcs: [] = getObjectData( oldData,
                                      [
                                          'lists',
                                          'EcsDeporte',
                                      ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                 [
                                                                                     'lists',
                                                                                     'EcsDeporte',
                                                                                 ] );

    let index = 500;
    oldEcs.forEach( product => {
        let volume = 150;
        if ( index === 501 ) {
            volume = 200;
        } else if ( index === 502 ) {
            volume = 300;
        }

        roProducts.push( {
                             id:          index,
                             productType: 'ecs',
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'pu' ],
                             description: product[ 'descr' ],
                             quantity:    1,
                             volume,
                         } );

        index++;
    } );

    const oldKitBiZone: [] = getObjectData( oldData,
                                            [
                                                'lists',
                                                'kitBiZone',
                                            ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                       [
                                                                                           'lists',
                                                                                           'kitBiZone',
                                                                                       ] );

    index = 600;
    oldKitBiZone.forEach( product => {
        roProducts.push( {
                             id:          index,
                             productType: 'kit_bi_zone',
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'pu' ],
                             description: product[ 'label' ],
                             quantity:    1,
                         } );

        index++;
    } );

    roProducts.push( {
                         id:          700,
                         productType: 'kit_cascade',
                         label:       'BALLON ECS INOX ADDITIONNEL DAIKIN',
                         reference:   'DAIEKHWS200D3',
                         pu:          1808,
                         defaultPu:   1808,
                         description: 'Volume : 200 litres\nDimension H : 1264 diam :595',
                         quantity:    1,
                     } );

    roProducts.push( {
                         id:          701,
                         productType: 'kit_cascade',
                         label:       'KIT MODULE DE GESTION POUR SYSTEME CASCADE',
                         reference:   'EKCC-W',
                         pu:          2600,
                         defaultPu:   2600,
                         description: '(Module gestion + 2 cartes de communications)',
                         quantity:    1,
                     } );

    return roProducts;
};

const convertSelectedRoProduct = ( oldData ): Product[] => {
    const selectedRoProducts: Product[] = [];
    const oldSelectedProducts: []       = getArrayData( oldData[ 'devis' ][ 'selectedProducts' ] );

    oldSelectedProducts.forEach( product => {
        selectedRoProducts.push( {
                                     id:          product[ 'id' ],
                                     productType: FILE_PAC_RO,
                                     label:       product[ 'label' ],
                                     reference:   product[ 'ref' ],
                                     pu:          product[ 'pu' ],
                                     defaultPu:   product[ 'defaultPU' ],
                                     description: product[ 'descr' ],
                                     scop:        product[ 'scop' ],
                                     quantity:    1,
                                 } );
    } );

    return selectedRoProducts;
};

const convertOldRoItemList = ( oldData ): RoList => {
    const lists: RoList = {
        localTypeList:           [],
        assortmentList:          [],
        ecsDeporteList:          [],
        accesCombleList:         [],
        typeCouvertureList:      [],
        typeCharpenteList:       [],
        etatToitureList:         [],
        puissanceCompteurList:   [],
        natureMurExtList:        [],
        typeRadiateurList:       [],
        tensionDisponibleList:   [],
        positionEauChaudeList:   [],
        typeChaudiereList:       [],
        typeOrigineList:         [],
        batimentNatureList:      [],
        niveauHabitationList:    [],
        qualiteIsolationList:    [],
        buildingCoefficientList: [],
        climaticZoneList:        [],
        altitudeList:            [],
        heatersList:             [],
        setPointTemperatureList: [],
    };

    const roItems = [
        'localType',
        'gammeType',
        'EcsDeporte',
        'accesComble',
        'typeCouverture',
        'typeCharpente',
        'etatToiture',
        'puissanceCompteur',
        'natureMurExt',
        'typeRadiateur',
        'tensionDisponible',
        'positionEauChaude',
        'typeChaudiere',
        'qualiteIsolation',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':         'localTypeList',
        'gammeType':         'assortmentList',
        'EcsDeporte':        'ecsDeporteList',
        'accesComble':       'accesCombleList',
        'typeCouverture':    'typeCouvertureList',
        'typeCharpente':     'typeCharpenteList',
        'etatToiture':       'etatToitureList',
        'puissanceCompteur': 'puissanceCompteurList',
        'natureMurExt':      'natureMurExtList',
        'typeRadiateur':     'typeRadiateurList',
        'tensionDisponible': 'tensionDisponibleList',
        'positionEauChaude': 'positionEauChaudeList',
        'typeChaudiere':     'typeChaudiereList',
        'qualiteIsolation':  'qualiteIsolationList',
    };


    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut
    roItems.forEach( item => {

        const oldList              = getObjectData( oldData[ 'lists' ], [ item ] );
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
    } );

    // Coef de construction
    lists[ 'buildingCoefficientList' ] = [
        {
            value: '0.6 - Entre 2013 et 2019',
            slug:  '0.6',
        },
        {
            value: '0.75 - Entre 2007 et 2012',
            slug:  '0.75',
        },
        {
            value: '0.8 - Entre 2001 et 2006',
            slug:  '0.8',
        },
        {
            value: '0.95 - Entre 1990 et 2000',
            slug:  '0.95',
        },
        {
            value: '1.15 - Entre 1983 et 1989',
            slug:  '1.15',
        },
        {
            value: '1.4 - Entre 1974 et 1982',
            slug:  '1.4',
        },
        {
            value: '1.7 -  Mal isolés et en simple vitrage',
            slug:  '1.7',
        },
    ];
    // Zone climatique
    lists[ 'climaticZoneList' ]        = [
        {
            value: 'Zone B',
            slug:  'B',
        },
        {
            value: 'Zone C',
            slug:  'C',
        },
        {
            value: 'Zone D',
            slug:  'D',
        },
        {
            value: 'Zone E',
            slug:  'E',
        },
    ];
    // Altitude
    lists[ 'altitudeList' ]            = [
        {
            value: '0 à 200m',
            slug:  '0',
        },
        {
            value: '201 à 400m',
            slug:  '201',
        },
        {
            value: '401 à 600m',
            slug:  '401',
        },
        {
            value: '601 à 800m',
            slug:  '601',
        },
        {
            value: '801 à 1000m',
            slug:  '801',
        },
    ];
    // Radiateurs
    lists[ 'heatersList' ]             = [
        {
            value: 'Radiateurs en fonte',
            slug:  'r_fonte',
        },
        {
            value: 'Autre Radiateurs',
            slug:  'r_autre',
        },
        {
            value: 'Plancher chauffant',
            slug:  'p_chauffant',
        },
        {
            value: 'Radiateurs en fontes + Plancher Chauffant',
            slug:  'r_fonte_p_chauffant',
        },
        {
            value: 'Autre Radiateurs + Plancher Chauffant',
            slug:  'r_autre_p_chauffant',
        },
    ];
    // Température de consigne
    lists[ 'setPointTemperatureList' ] = [
        {
            value: '19°C',
            slug:  '19',
        },
        {
            value: '20°C',
            slug:  '20',
        },
    ];


    return lists;
};

export const convertOldRoFile = ( oldData ): RoFile => {
    return {
        version:                   '1',
        type:                      FILE_PAC_RO,
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
            nbOccupant:          getNumberData( oldData [ 'logement' ][ 'occupants' ] ),
            type:                getObjectData( oldData, [ 'logement', 'localType' ] ),
            heatingType:         getObjectData( oldData, [ 'logement', 'chauffageType' ] ),
            buildingNature:      getObjectData( oldData, [ 'logement', 'batimentNature' ] ),
            isRentedHouse:       getObjectData( oldData, [ 'logement', 'batimentNature' ] ) === 'location',
            isAddressBenef:      getObjectData( oldData, [ 'logement', 'isAdresseBenef' ] ),
            address:             getObjectData( oldData, [ 'logement', 'adresse' ] ),
            zipCode:             getObjectData( oldData, [ 'logement', 'codepostal' ] ),
            city:                getObjectData( oldData, [ 'logement', 'ville' ] ),
            plot:                getObjectData( oldData, [ 'logement', 'parcelle' ] ),
            area:                getObjectData( oldData, [ 'logement', 'superficie' ] ),
            dataGeoportail:      convertOldDataGeoportail( oldData ),
            location:            getObjectData( oldData, [ 'logement', 'location' ] ),
            constructionYear:    getNullableNumberData( oldData [ 'logement' ][ 'anneeConstruction' ] ),
            lessThan2Years:      getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:    getObjectData( oldData, [ 'logement', 'tensionDisponible' ] ),
            buildingCoefficient: 0.8,           // Anciennment Isolation
            climaticZone:        'B',           // Zone climatique
            altitude:            0,
            heaters:             'r_fonte',     // Radiateurs
            ceilingHeight:       2.5,           // Hauteur sous plafond
            setPointTemperature: 19,            // Température de consigne
        },
        worksheet:                 {
            period:                    getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            niveauHabitation:          getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            typeChantier:              getObjectData( oldData, [ 'fiche', 'typeChantier' ] ),
            disjoncteur:               getObjectData( oldData, [ 'fiche', 'disjoncteur' ] ),
            natureMurExt:              getObjectData( oldData, [ 'fiche', 'natureMurExt' ] ),
            naturePlafond:             getObjectData( oldData, [ 'fiche', 'naturePlafond' ] ),
            visiteComble:              getObjectData( oldData, [ 'fiche', 'visiteComble' ] ),
            chantierHabite:            getObjectData( oldData, [ 'fiche', 'chantierHabite' ] ),
            grandeEchelle:             getObjectData( oldData, [ 'fiche', 'grandeEchelle' ] ),
            demandeVoirie:             getObjectData( oldData, [ 'fiche', 'demandeVoirie' ] ),
            puissanceCompteur:         getObjectData( oldData, [ 'fiche', 'puissanceCompteur' ] ),
            distanceCompteurPac:       getObjectData( oldData, [ 'fiche', 'distanceCompteurPac' ] ),
            accesComble:               getObjectData( oldData, [ 'fiche', 'accesComble' ] ),
            rueEtroite:                getObjectData( oldData, [ 'fiche', 'rueEtroite' ] ),
            typeCouverture:            getObjectData( oldData, [ 'fiche', 'typeCouverture' ] ),
            etatToiture:               getObjectData( oldData, [ 'fiche', 'etatToiture' ] ),
            typeCharpente:             getObjectData( oldData, [ 'fiche', 'typeCharpente' ] ),
            nbCompartimentComble:      getObjectData( oldData, [ 'fiche', 'nbrCompartementComble' ] ),
            presenceVolige:            getObjectData( oldData, [ 'fiche', 'presenceVolige' ] ),
            nbAccesComble:             getObjectData( oldData, [ 'fiche', 'nbrAccesComble' ] ),
            distanceGpExtUnitInt:      getObjectData( oldData, [ 'fiche', 'distanceGpExtUnitInt' ] ),
            nbTotalRadiateur:          getObjectData( oldData, [ 'fiche', 'nbrTotalRadiateur' ] ),
            nbRadiateurThermostatique: getObjectData( oldData, [ 'fiche', 'nbrRadiateurThermostatique' ] ),
            typeRadiateur:             getObjectData( oldData, [ 'fiche', 'typeRadiateur' ] ),
            espaceSolRequisUnitInt:    getObjectData( oldData, [ 'fiche', 'espaceSolRequisUnitInt' ] ),
            hauteurRequiseUnitInt:     getObjectData( oldData, [ 'fiche', 'hauteurRequiseUnitInt' ] ),
            positionEauChaude:         getObjectData( oldData, [ 'fiche', 'positionEauChaude' ] ),
            hauteurDuSol:              getObjectData( oldData, [ 'fiche', 'hauteurDuSol' ] ),
            tensionDisponible:         getObjectData( oldData, [ 'fiche', 'tensionDisponible' ] ),
            infosSup:                  getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
        },
        quotation: {
            ...convertBaseQuotation( oldData ),
            ceeBonus:          getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            maPrimeRenovBonus: getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            selectedProducts:  convertSelectedRoProduct( oldData ),
            assortment:        getObjectData( oldData, [ 'devis', 'gamme' ] ),
            volumeECS:         getNumberData( oldData [ 'devis' ][ 'ro' ][ 'volumeECS' ] ),
            volumeECSDeporte:  getNumberData( oldData [ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ] ) === 0
                               ? 150
                               : getNumberData( oldData [ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ] ),
            isEcsDeporte:      getBoolData( oldData [ 'devis' ][ 'ro' ][ 'isEcsDeporte' ] ),
            ceilingHeight:     getNumberData( oldData [ 'devis' ][ 'ro' ][ 'hauteurSousPlafond' ] ),
            deviceToReplace:   {
                type:  getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'type' ] ),
                brand: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'marque' ] ),
                model: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'modele' ] ),
            },
            products:          convertOldRoProduct( oldData ),
            cascadeSystem:     false,
        },
        scales:                    convertOldScales( oldData ),
        bonusWithoutCdp:           {
            amount: {
                h1: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H1' ] ),
                h2: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H2' ] ),
                h3: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H3' ] ),
            },
        },
        statusInDci:               convertOldStatusDci( oldData ),
        errorsStatusInDci:         convertOldErrorStatusDci( oldData ),
        technician:                convertTechnician( oldData ),
        lists:                     convertOldRoItemList( oldData ),
    };
};
