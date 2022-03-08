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
import RrMulti from '@/types/v2/File/Rr/RrMulti';
import RrList from '@/types/v2/File/Rr/RrList';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { FILE_PAC_RR } from '@/services/constantService';

const convertOldRrProduct = ( oldData ): Product[] => {
    const roProducts: Product[] = [];
    const oldProducts: []       = getObjectData( oldData,
                                                 [
                                                     'devis',
                                                     'pompeAChaleur',
                                                     'products',
                                                 ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                            [
                                                                                                'devis',
                                                                                                'pompeAChaleur',
                                                                                                'products',
                                                                                            ] );

    oldProducts.forEach( product => {
        roProducts.push( {
                             id:          product[ 'id' ],
                             productType: FILE_PAC_RR,
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             scop:        product[ 'scop' ],
                             quantity:    1,
                         } );
    } );

    return roProducts;
};

const convertSelectedRProduct = ( oldData ): Product[] => {
    const selectedRoProducts: Product[] = [];
    const oldSelectedProducts: []       = getArrayData( oldData[ 'devis' ][ 'selectedProducts' ] );

    oldSelectedProducts.forEach( product => {
        selectedRoProducts.push( {
                                     id:          product[ 'id' ],
                                     productType: FILE_PAC_RR,
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

const convertOldRrMulti = ( oldData ): RrMulti => {
    let dataRrMulti: RrMulti;

    if ( getObjectData( oldData, [ 'devis', 'rrMulti' ] ) !== '' ) {
        dataRrMulti = {
            roomNumber:   oldData[ 'devis' ][ 'rrMulti' ][ 'nombreDePiece' ],
            areaP1:       oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP1' ],
            areaP2:       oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP2' ],
            areaP3:       oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP3' ],
            areaP4:       oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP4' ],
            areaP5:       oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP5' ],
            assortmentP1: oldData[ 'devis' ][ 'gamme' ],
            assortmentP2: oldData[ 'devis' ][ 'gamme' ],
            assortmentP3: oldData[ 'devis' ][ 'gamme' ],
            assortmentP4: oldData[ 'devis' ][ 'gamme' ],
            assortmentP5: oldData[ 'devis' ][ 'gamme' ],
        };
    } else {
        dataRrMulti = {
            roomNumber:   1,
            areaP1:       0,
            areaP2:       0,
            areaP3:       0,
            areaP4:       0,
            areaP5:       0,
            assortmentP1: 'perfera',
            assortmentP2: 'perfera',
            assortmentP3: 'perfera',
            assortmentP4: 'perfera',
            assortmentP5: 'perfera',
        };
    }

    return dataRrMulti;
};

const convertOldRrItemList = ( oldData ): RrList => {
    const lists: RrList = {
        localTypeList:           [],
        rrTypeList:              [],
        typeCouvertureList:      [],
        typeCharpenteList:       [],
        etatToitureList:         [],
        puissanceCompteurList:   [],
        natureMurExtList:        [],
        typeRadiateurList:       [],
        tensionDisponibleList:   [],
        positionEauChaudeList:   [],
        typeChaudiereList:       [],
        gammeTypeList:           [],
        qualiteIsolationList:    [],
        batimentNatureList:      [],
        naturePlafondList:       [],
        EcsDeporteList:          [],
        niveauHabitationList:    [],
        typeChantierList:        [],
        typeOrigineList:         [],
        buildingCoefficientList: [],
        climaticZoneList:        [],
        altitudeList:            [],
        heatersList:             [],
        setPointTemperatureList: [],
    };

    const rrItems = [
        'localType',
        'rrType',
        'typeCouverture',
        'typeCharpente',
        'etatToiture',
        'puissanceCompteur',
        'natureMurExt',
        'typeRadiateur',
        'tensionDisponible',
        'positionEauChaude',
        'typeChaudiere',
        'gammeType',
        'qualiteIsolation',
        'batimentNature',
        'naturePlafond',
        'EcsDeporte',
        'niveauHabitation',
        'typeChantier',
        'typeOrigine',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':         'localTypeList',
        'rrType':            'rrTypeList',
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
        'gammeType':         'gammeTypeList',
        'qualiteIsolation':  'qualiteIsolationList',
        'batimentNature':    'batimentNatureList',
        'naturePlafond':     'naturePlafondList',
        'EcsDeporte':        'EcsDeporteList',
        'niveauHabitation':  'niveauHabitationList',
        'typeChantier':      'typeChantierList',
        'typeOrigine':       'typeOrigineList',
    };

    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut
    rrItems.forEach( item => {

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


export const convertOldRrFile = ( oldData ): RrFile => {
    return {
        version:                   '1',
        type:                      FILE_PAC_RR,
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
        housing:           {
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
        worksheet:         {
            period:               getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            niveauHabitation:     getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            typeChantier:         getObjectData( oldData, [ 'fiche', 'typeChantier' ] ),
            disjoncteur:          getObjectData( oldData, [ 'fiche', 'disjoncteur' ] ),
            natureMurExt:         getObjectData( oldData, [ 'fiche', 'natureMurExt' ] ),
            naturePlafond:        getObjectData( oldData, [ 'fiche', 'naturePlafond' ] ),
            visiteComble:         getObjectData( oldData, [ 'fiche', 'visiteComble' ] ),
            chantierHabite:       getObjectData( oldData, [ 'fiche', 'chantierHabite' ] ),
            grandeEchelle:        getObjectData( oldData, [ 'fiche', 'grandeEchelle' ] ),
            demandeVoirie:        getObjectData( oldData, [ 'fiche', 'demandeVoirie' ] ),
            puissanceCompteur:    getObjectData( oldData, [ 'fiche', 'puissanceCompteur' ] ),
            distanceCompteurPac:  getObjectData( oldData, [ 'fiche', 'distanceCompteurPac' ] ),
            accesComble:          getObjectData( oldData, [ 'fiche', 'accesComble' ] ),
            rueEtroite:           getObjectData( oldData, [ 'fiche', 'rueEtroite' ] ),
            typeCouverture:       getObjectData( oldData, [ 'fiche', 'typeCouverture' ] ),
            etatToiture:          getObjectData( oldData, [ 'fiche', 'etatToiture' ] ),
            typeCharpente:        getObjectData( oldData, [ 'fiche', 'typeCharpente' ] ),
            nbCompartimentComble: getObjectData( oldData, [ 'fiche', 'nbrCompartementComble' ] ),
            presenceVolige:       getObjectData( oldData, [ 'fiche', 'presenceVolige' ] ),
            nbAccesComble:        getObjectData( oldData, [ 'fiche', 'nbrAccesComble' ] ),
            distanceGpExtUnitInt: getObjectData( oldData, [ 'fiche', 'distanceGpExtUnitInt' ] ),
            emplacementSplit1:    getObjectData( oldData, [ 'fiche', 'emplacementSplit1' ] ),
            emplacementSplit2:    getObjectData( oldData, [ 'fiche', 'emplacementSplit2' ] ),
            emplacementSplit3:    getObjectData( oldData, [ 'fiche', 'emplacementSplit3' ] ),
            emplacementSplit4:    getObjectData( oldData, [ 'fiche', 'emplacementSplit4' ] ),
            emplacementSplit5:    getObjectData( oldData, [ 'fiche', 'emplacementSplit5' ] ),
            emplacementGrpExt:    getObjectData( oldData, [ 'fiche', 'emplacementGrpExt' ] ),
            emplacementSplitMono: getObjectData( oldData, [ 'fiche', 'emplacementSplitMono' ] ),
            distanceGpExtSplit1:  getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit1' ] ),
            distanceGpExtSplit2:  getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit2' ] ),
            distanceGpExtSplit3:  getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit3' ] ),
            distanceGpExtSplit4:  getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit4' ] ),
            distanceGpExtSplit5:  getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit5' ] ),
            nbPompeRelevage:      getObjectData( oldData, [ 'fiche', 'nbrPompeRelevage' ] ),
            positionEauChaude:    getObjectData( oldData, [ 'fiche', 'positionEauChaude' ] ),
            hauteurDuSol:         getObjectData( oldData, [ 'fiche', 'hauteurDuSol' ] ),
            infosSup:             getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
        },
        quotation:         {
            ...convertBaseQuotation( oldData ),
            tva10:             getNumberData( oldData [ 'devis' ][ 'tva10' ] ),
            tva20:             getNumberData( oldData [ 'devis' ][ 'tva20' ] ),
            ceeBonus:          getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            maPrimeRenovBonus: getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            selectedProducts:  convertSelectedRProduct( oldData ),
            rrType:            getObjectData( oldData, [ 'devis', 'rrType' ] ),
            rrMulti:           convertOldRrMulti( oldData ),
            assortment:        getObjectData( oldData, [ 'devis', 'gamme' ] ),
            products:          convertOldRrProduct( oldData ),
        },
        scales:            convertOldScales( oldData ),
        bonusWithoutCdp:   {
            amount: {
                h1: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H1' ] ),
                h2: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H2' ] ),
                h3: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H3' ] ),
            },
        },
        statusInDci:       convertOldStatusDci( oldData ),
        errorsStatusInDci: convertOldErrorStatusDci( oldData ),
        technician:        convertTechnician( oldData ),
        lists:             convertOldRrItemList( oldData ),
    };
};
