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
    getNumberData,
    getObjectData,
    getStringData,
} from '@/services/file/converter/convertData';
import { Product } from '@/types/v2/File/Common/Product';
import RoKitBiZone from '@/types/v2/File/Ro/RoKitBiZone';
import RoEcsDeporte from '@/types/v2/File/Ro/RoEcsDeporte';
import RoList from '@/types/v2/File/Ro/RoList';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { FILE_PAC_RO } from '@/services/constantService';

const convertOldRoProduct = ( oldData ): Product[] => {
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
                             productType: FILE_PAC_RO,
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             scop:        product[ 'scop' ],
                         } );
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
                                 } );
    } );

    return selectedRoProducts;
};

const convertOldSelectedKitBiZone = ( oldData ): RoKitBiZone | undefined => {
    let selectedKitBiZone: RoKitBiZone | undefined;
    if ( getObjectData( oldData, [ 'devis', 'ro', 'isKitBiZone' ] ) === true ) {
        selectedKitBiZone = {
            label: getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'label' ] ),
            ref:   getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'ref' ] ),
            pu:    getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'volume' ] ),
        };
    }

    return selectedKitBiZone;
};

const convertOldSelectedEscDeporte = ( oldData ): RoEcsDeporte | undefined => {
    let selectedEcsDeporte: RoEcsDeporte | undefined;

    if ( getObjectData( oldData, [ 'devis', 'ro', 'isEcsDeporte' ] ) === true ) {
        selectedEcsDeporte = {
            volume:      getObjectData( oldData, [ 'devis', 'ro', 'selectedEcsDeporte', 'volume' ] ),
            label:       getObjectData( oldData, [ 'devis', 'ro', 'selectedEcsDeporte', 'label' ] ),
            ref:         getObjectData( oldData, [ 'devis', 'ro', 'selectedEcsDeporte', 'ref' ] ),
            pu:          getObjectData( oldData, [ 'devis', 'ro', 'selectedEcsDeporte', 'pu' ] ),
            description: getObjectData( oldData, [ 'devis', 'ro', 'selectedEcsDeporte', 'descr' ] ),
        };
    }

    return selectedEcsDeporte;
};


const convertOldRoItemList = ( oldData ): RoList => {
    const lists: RoList = {
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
        typeOrigineList:       [],
        batimentNatureList:    [],
        niveauHabitationList:  [],
    };

    const roItems = [
        'localType',
        'rrType',
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
    ];

    const newName: { [ key: string ]: string } = {
        'localType':         'localTypeList',
        'rrType':            'rrTypeList',
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
            constructionYear:  getObjectData( oldData, [ 'logement', 'anneeConstruction' ] ),
            lessThan2Years:    getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:  getObjectData( oldData, [ 'logement', 'tensionDisponible' ] ),
        },
        worksheet: {
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
        quotation:                 {
            origin:             getObjectData( oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: getObjectData( oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:     getObjectData( oldData, [ 'devis', 'delaisExecution' ] ),
            options:            convertOldOptions( oldData ),
            blankOptions:       convertOldBlankOptions( oldData ),
            commentary:         getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:            getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:              convertOldText( oldData ),
            ceeBonus:           getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            maPrimeRenovBonus:  getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            discount:           getNumberData( oldData [ 'devis' ][ 'remise' ] ),
            selectedProducts:   convertSelectedRoProduct( oldData ),
            assortment:         getObjectData( oldData, [ 'devis', 'gamme' ] ),
            volumeECS:          getNumberData( oldData [ 'devis' ][ 'ro' ][ 'volumeECS' ] ),
            volumeECSDeporte:   getNumberData( oldData [ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ] ),
            isEcsDeporte:       getBoolData( oldData [ 'devis' ][ 'ro' ][ 'isEcsDeporte' ] ),
            selectedEcsDeporte: convertOldSelectedEscDeporte( oldData ),
            isKitBiZone:        getBoolData( oldData [ 'devis' ][ 'ro' ][ 'isKitBiZone' ] ),
            selectedKitBiZone:  convertOldSelectedKitBiZone( oldData ),
            ceilingHeight:      getNumberData( oldData [ 'devis' ][ 'ro' ][ 'hauteurSousPlafond' ] ),
            deviceToReplace:    {
                type:  getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'type' ] ),
                brand: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'marque' ] ),
                model: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'modele' ] ),
            },
            products:           convertOldRoProduct( oldData ),
            totalHt:            convertOldTotalHt( oldData ),
            totalTva:           convertOldTotalTva( oldData ),
            totalTtc:           0,
            remainderToPay:     0,
            tva:                getNumberData( oldData [ 'devis' ][ 'tva' ] ),
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
        lists:                     convertOldRoItemList( oldData ),
    };
};
