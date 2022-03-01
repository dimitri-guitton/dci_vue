import {
    convertOldAssent,
    convertOldBeneficiary,
    convertOldBlankOptions,
    convertOldDataGeoportail,
    convertOldErrorStatusDci,
    convertOldOptions,
    convertOldScales,
    convertOldStatusDci,
    convertOldText,
    convertOldTotalHt,
    convertOldTotalTva,
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
            roomNumber: oldData[ 'devis' ][ 'rrMulti' ][ 'nombreDePiece' ],
            areaP1:     oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP1' ],
            areaP2:     oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP2' ],
            areaP3:     oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP3' ],
            areaP4:     oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP4' ],
            areaP5:     oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP5' ],
        };
    } else {
        dataRrMulti = {
            roomNumber: 1,
            areaP1:     0,
            areaP2:     0,
            areaP3:     0,
            areaP4:     0,
            areaP5:     0,
        };
    }

    return dataRrMulti;
};

const convertOldRrItemList = ( oldData ): RrList => {
    const lists: RrList = {
        localTypeList:         [],
        rrTypeList:            [],
        assortmentList:        [],
        ecsDeporteList:        [],
        accesCombleList:       [],
        typeCouvertureList:    [],
        typeCharpenteList:     [],
        etatToitureList:       [],
        puissanceCompteurList: [],
        natureMurExtList:      [],
        typeRadiateurList:     [],
        tensionDisponibleList: [],
        positionEauChaudeList: [],
        typeChaudiereList:     [],
        gammeTypeList:         [],
        qualiteIsolationList:  [],
        batimentNatureList:    [],
        naturePlafondList:     [],
        EcsDeporteList:        [],
        niveauHabitationList:  [],
        typeChantierList:      [],
        typeOrigineList:       [],
    };

    const rrItems = [
        'localType',
        'rrType',
        'assortment',
        'ecsDeporte',
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
        'assortment':        'assortmentList',
        'ecsDeporte':        'ecsDeporteList',
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

        if ( oldList !== {} && oldList !== '' ) {
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


            lists[ newName[ item ] ] = {
                slug:  newName[ item ],
                items: newItems,
            };
        }
    } );

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
        enabledHousingAction:      getBoolData( oldData[ 'enabledActionLogement' ] ),
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
            insulationQuality: getNumberData( oldData [ 'logement' ][ 'qualiteIsolation' ] ),
            constructionYear:  getNullableNumberData( oldData [ 'logement' ][ 'anneeConstruction' ] ),
            lessThan2Years:    getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:  getObjectData( oldData, [ 'logement', 'tensionDisponible' ] ),
        },
        worksheet: {
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
        quotation: {
            origin:             getObjectData( oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: getObjectData( oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:    getObjectData( oldData, [ 'devis', 'delaisExecution' ] ),
            options:           convertOldOptions( oldData ),
            blankOptions:      convertOldBlankOptions( oldData ),
            commentary:        getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:           getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:             convertOldText( oldData ),
            tva10:             getNumberData( oldData [ 'devis' ][ 'tva10' ] ),
            tva20:             getNumberData( oldData [ 'devis' ][ 'tva20' ] ),
            ceeBonus:          getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            maPrimeRenovBonus: getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            discount:          getNumberData( oldData [ 'devis' ][ 'remise' ] ),
            selectedProducts:  convertSelectedRProduct( oldData ),
            rrType:            getObjectData( oldData, [ 'devis', 'rrType' ] ),
            rrMulti:           convertOldRrMulti( oldData ),
            assortment:        getObjectData( oldData, [ 'devis', 'gamme' ] ),
            products:          convertOldRrProduct( oldData ),
            totalHt:           convertOldTotalHt( oldData ),
            totalTva:          convertOldTotalTva( oldData ),
            totalTtc:          0,
            remainderToPay:    0,
            tva:               getNumberData( oldData [ 'devis' ][ 'tva' ] ),
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
        technician:                {
            id:        getObjectData( oldData, [ 'technicien', 'id' ] ),
            lastName:  getObjectData( oldData, [ 'technicien', 'nom' ] ),
            firstName: getObjectData( oldData, [ 'technicien', 'prenom' ] ),
            phone:     getObjectData( oldData, [ 'technicien', 'tel' ] ),
        },
        lists:                     convertOldRrItemList( oldData ),
    };
};
