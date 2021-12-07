import RoProduct from '@/types/File/Ro/RoProduct';
import RoOption from '@/types/File/Ro/RoOption';
import RoKitBiZone from '@/types/File/Ro/RoKitBiZone';
import RoEcsDeporte from '@/types/File/Ro/RoEcsDeporte';
import {
    convertOldAssent,
    convertOldBeneficiary,
    convertOldBlankOptions,
    convertOldDataGeoportail,
    convertOldErrorStatusDci,
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
} from '@/services/file/convertData';
import RoFile from '@/types/File/Ro/RoFile';
import ItemList from '@/types/File/ItemList';
import RoList from '@/types/File/RoList';

const convertOldRoProduct = ( oldData ): RoProduct[] => {
    const roProducts: RoProduct[] = [];
    const oldProducts: []         = getObjectData( oldData,
                                                   [ 'devis',
                                                     'pompeAChaleur',
                                                     'products' ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                                           [ 'devis',
                                                                                                             'pompeAChaleur',
                                                                                                             'products' ] );

    oldProducts.forEach( product => {
        roProducts.push( {
                             id:          product[ 'id' ],
                             label:       product[ 'label' ],
                             ref:         product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             calcul0:     product[ 'calcul0' ],
                             scop:        product[ 'scop' ],
                         } );
    } );

    return roProducts;
};

const convertSelectedRoProduct = ( oldData ): RoProduct[] => {
    const selectedRoProducts: RoProduct[] = [];
    const oldSelectedProducts: []         = getArrayData( oldData[ 'devis' ][ 'selectedProducts' ] );

    oldSelectedProducts.forEach( product => {
        selectedRoProducts.push( {
                                     id:          product[ 'id' ],
                                     label:       product[ 'label' ],
                                     ref:         product[ 'ref' ],
                                     pu:          product[ 'pu' ],
                                     defaultPu:   product[ 'defaultPU' ],
                                     description: product[ 'descr' ],
                                     calcul0:     product[ 'calcul0' ],
                                     scop:        product[ 'scop' ],
                                 } );
    } );

    return selectedRoProducts;
};

const convertOldRoOptions = ( oldData ): RoOption[] => {
    const roOptions: RoOption[] = [];
    const oldOption: []         = getArrayData( oldData[ 'devis' ][ 'options' ] );

    oldOption.forEach( option => {
        roOptions.push( {
                            id:        option[ 'id' ],
                            label:     option[ 'label' ],
                            unit:      option[ 'unit' ],
                            value:     option[ 'value' ],
                            pu:        {
                                default: option[ 'default' ],
                                value:   option[ 'value' ],
                            },
                            calcTva10: option[ 'calcTva10' ],
                        } );
    } );

    return roOptions;
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
    };

    const roItems = [
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
            newItems.push( {
                               value: data[ Object.keys( data )[ 0 ] ],
                           } );
        } );

        lists[ newName[ item ] ] = {
            slug:  newName[ item ],
            items: newItems,
        };
    } );

    return lists;
};

export const convertOldRoFolder = ( oldData ): RoFile => {
    return {
        version:                   getStringData( oldData[ 'version' ] ),
        type:                      getStringData( oldData[ 'type' ] ),
        ref:                       getStringData( oldData[ 'ref' ] ),
        folderName:                getStringData( oldData[ 'folderName' ] ),
        createdAt:                 getStringData( oldData[ 'createdAt' ] ),
        updatedAt:                 getStringData( oldData[ 'updatedAt' ] ),
        settings:                  oldData[ 'settings' ],
        devisTemplate:             getObjectData( oldData, [ 'devisTemplate', 'ro' ] ),
        workSheetTemplate:         getObjectData( oldData, [ 'ficheTemplate', 'ro' ] ),
        disabledBonus:             getBoolData( oldData[ 'disablePrime' ] ),
        disabledCeeBonus:          getBoolData( oldData[ 'disablePrimeCEE' ] ),
        enabledHousingAction:      getBoolData( oldData[ 'enabledActionLogement' ] ),
        disabledMaPrimeRenovBonus: getBoolData( oldData[ 'disablePrimeMaprimerenov' ] ),
        assent:                    convertOldAssent( oldData ),
        beneficiary:               convertOldBeneficiary( oldData ),
        codeBonus:                 getStringData( oldData[ 'codePrime' ] ),
        energyZone:                getStringData( oldData[ 'zoneEnergetique' ] ),
        bonusRate:                 getNumberData( oldData[ 'tauxPrime' ] ),
        housing:                   {
            nbOccupant:        getObjectData( oldData, [ 'logement', 'occupants' ] ),
            type:              getObjectData( oldData, [ 'logement', 'localType' ] ),
            isAddressBenef:    getObjectData( oldData, [ 'logement', 'isAdresseBenef' ] ),
            addresse:          getObjectData( oldData, [ 'logement', 'adresse' ] ),
            zipCode:           getObjectData( oldData, [ 'logement', 'codepostal' ] ),
            city:              getObjectData( oldData, [ 'logement', 'ville' ] ),
            plot:              getObjectData( oldData, [ 'logement', 'parcelle' ] ),
            area:              getObjectData( oldData, [ 'logement', 'superficie' ] ),
            dataGeoportail:    convertOldDataGeoportail( oldData ),
            location:          getObjectData( oldData, [ 'logement', 'location' ] ),
            insulationQuality: getObjectData( oldData, [ 'logement', 'qualiteIsolation' ] ),
            constructionYear:  getObjectData( oldData, [ 'logement', 'anneeConstruction' ] ),
            lessThan2Years:    getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:  getObjectData( oldData, [ 'logement', 'tensionDisponible' ] ),
        },
        workSheet:                 {
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
            infosSup:                  getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
        },
        quotation:                 {
            origin:             getObjectData( oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: getObjectData( oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:     getObjectData( oldData, [ 'devis', 'delaisExecution' ] ),
            options:            convertOldRoOptions( oldData ),
            blankOptions:       convertOldBlankOptions( oldData ),
            commentary:         getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:            getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:              convertOldText( oldData ),
            tva10:              getObjectData( oldData, [ 'devis', 'tva10' ] ),
            tva20:              getObjectData( oldData, [ 'devis', 'tva20' ] ),
            ceeBonus:           getObjectData( oldData, [ 'devis', 'primeCEE' ] ),
            maPrimeRenovBonus:  getObjectData( oldData, [ 'devis', 'primeAnah' ] ),
            selectedProducts:   convertSelectedRoProduct( oldData ),
            assortment:         getObjectData( oldData, [ 'devis', 'gamme' ] ),
            volumeECS:          getObjectData( oldData, [ 'devis', 'ro', 'volumeECS' ] ),
            volumeECSDeporte:   getObjectData( oldData, [ 'devis', 'ro', 'volumeECSDeporte' ] ),
            isEcsDeporte:       getObjectData( oldData, [ 'devis', 'ro', 'isEcsDeporte' ] ),
            selectedEcsDeporte: convertOldSelectedEscDeporte( oldData ),
            isKitBiZone:        getObjectData( oldData, [ 'devis', 'ro', 'isKitBiZone' ] ),
            selectedKitBiZone:  convertOldSelectedKitBiZone( oldData ),
            ceilingHeight:      getObjectData( oldData, [ 'devis', 'ro', 'hauteurSousPlafond' ] ),
            quantity:           getObjectData( oldData, [ 'devis', 'ro', 'quantity' ] ),
            deviceToReplace:    {
                type:  getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'type' ] ),
                brand: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'marque' ] ),
                model: getObjectData( oldData, [ 'devis', 'ro', 'appareilRemplacer', 'modele' ] ),
            },
            products:           convertOldRoProduct( oldData ),
            discount:           getObjectData( oldData, [ 'devis', 'remise' ] ),
            totalHt:            convertOldTotalHt( oldData ),
            totalTva:           convertOldTotalTva( oldData ),
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
            id:        getObjectData( oldData, [ 'technicien', 'nom' ] ),
            lastName:  getObjectData( oldData, [ 'technicien', 'prenom' ] ),
            firstName: getObjectData( oldData, [ 'technicien', 'id' ] ),
            phone:     getObjectData( oldData, [ 'technicien', 'tel' ] ),
        },
        lists:                     convertOldRoItemList( oldData ),
    };
};
