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
    getBoolData,
    getNumberData,
    getObjectData,
    getStringData,
} from '@/services/file/converter/convertData';
import ItemList from '@/types/File/ItemList';
import CetList from '@/types/File/Cet/CetList';
import CetFile from '@/types/File/Cet/CetFile';
import Product from '@/types/File/Product';

const convertOldCetProduct = ( oldData ): Product[] => {
    const ceProducts: Product[] = [];
    const oldProducts: []       = getObjectData( oldData,
                                                 [ 'devis',
                                                   'chauffeEau',
                                                   'products' ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                                         [ 'devis',
                                                                                                           'chauffeEau',
                                                                                                           'products' ] );

    oldProducts.forEach( product => {
        ceProducts.push( {
                             id:          product[ 'id' ],
                             productType: 'cet',
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             size:        product[ 'size' ],
                             type:        product[ 'type' ],
                         } );
    } );

    return ceProducts;
};

const convertSelectedCetProduct = ( oldData ): Product[] => {
    const selectedCeProducts: Product[] = [];
    const idSelectedProduct             = getNumberData( oldData[ 'devis' ][ 'chauffeEau' ][ 'selectedId' ] );
    const oldProducts: []               = getObjectData( oldData,
                                                         [ 'devis',
                                                           'chauffeEau',
                                                           'products' ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                                                 [ 'devis',
                                                                                                                   'chauffeEau',
                                                                                                                   'products' ] );

    oldProducts.forEach( product => {
        if ( product[ 'id' ] === idSelectedProduct ) {
            selectedCeProducts.push( {
                                         id:          product[ 'id' ],
                                         productType: 'cet',
                                         label:       product[ 'label' ],
                                         reference:   product[ 'ref' ],
                                         pu:          product[ 'pu' ],
                                         defaultPu:   product[ 'defaultPU' ],
                                         description: product[ 'descr' ],
                                         size:        product[ 'size' ],
                                         type:        product[ 'type' ],
                                     } );
        }
    } );

    return selectedCeProducts;
};

const convertOldCetItemList = ( oldData ): CetList => {
    const lists: CetList = {
        localTypeList:         [],
        qualiteIsolationList:  [],
        statutMenageTypeList:  [],
        batimentNatureList:    [],
        naturePlafondList:     [],
        niveauHabitationList:  [],
        typeChantierList:      [],
        accesCombleList:       [],
        typeCouvertureList:    [],
        typeCharpenteList:     [],
        etatToitureList:       [],
        puissanceCompteurList: [],
        natureMurExtList:      [],
        chauffageTypeList:     [],
        tensionDisponibleList: [],
        aspirationTypeList:    [],
        typeOrigineList:       [],
    };

    const ceItems = [
        'localType',
        'qualiteIsolation',
        'statutMenageType',
        'batimentNature',
        'naturePlafond',
        'niveauHabitation',
        'typeChantier',
        'accesComble',
        'typeCouverture',
        'typeCharpente',
        'etatToiture',
        'puissanceCompteur',
        'natureMurExt',
        'chauffageType',
        'tensionDisponible',
        'aspirationType',
        'typeOrigine',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':         'localTypeList',
        'qualiteIsolation':  'qualiteIsolationList',
        'statutMenageType':  'statutMenageTypeList',
        'batimentNature':    'batimentNatureList',
        'naturePlafond':     'naturePlafondList',
        'niveauHabitation':  'niveauHabitationList',
        'typeChantier':      'typeChantierList',
        'accesComble':       'accesCombleList',
        'typeCouverture':    'typeCouvertureList',
        'typeCharpente':     'typeCharpenteList',
        'etatToiture':       'etatToitureList',
        'puissanceCompteur': 'puissanceCompteurList',
        'natureMurExt':      'natureMurExtList',
        'chauffageType':     'chauffageTypeList',
        'tensionDisponible': 'tensionDisponibleList',
        'aspirationType':    'aspirationTypeList',
        'typeOrigine':       'typeOrigineList',
    };


    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut
    ceItems.forEach( item => {

        const oldList              = getObjectData( oldData[ 'lists' ], [ item ] );
        const newItems: ItemList[] = [];

        oldList.forEach( ( data ) => {
            if ( typeof data === 'object' ) {

                newItems.push( {
                                   value: data[ Object.keys( data )[ 0 ] ],
                               } );
            } else {
                newItems.push( data );
            }
        } );

        lists[ newName[ item ] ] = {
            slug:  newName[ item ],
            items: newItems,
        };
    } );

    return lists;
};

export const convertOldCetFile = ( oldData ): CetFile => {
    console.log( '%c IN CONVERT DATA FILE', 'background: #fdd835; color: #000000' );
    return {
        version:                   getStringData( oldData[ 'version' ] ),
        type:                      'cet',
        ref:                       getStringData( oldData[ 'ref' ] ),
        folderName:                getStringData( oldData[ 'folderName' ] ),
        createdAt:                 getStringData( oldData[ 'createdAt' ] ),
        updatedAt:                 getStringData( oldData[ 'updatedAt' ] ),
        settings:                  oldData[ 'settings' ],
        quotationTemplate:         getStringData( oldData[ 'quotationTemplate' ] ),
        workSheetTemplate:         getStringData( oldData[ 'ficheTemplate' ] ),
        disabledBonus:             getBoolData( oldData[ 'disablePrime' ] ),
        disabledCeeBonus:          getBoolData( oldData[ 'disablePrimeCEE' ] ),
        enabledHousingAction:      getBoolData( oldData[ 'enabledActionLogement' ] ),
        disabledMaPrimeRenovBonus: getBoolData( oldData[ 'disablePrimeMaprimerenov' ] ),
        assents:                   convertOldAssent( oldData ),
        beneficiary:               convertOldBeneficiary( oldData ),
        codeBonus:                 getStringData( oldData[ 'codePrime' ] ),
        energyZone:                getStringData( oldData[ 'zoneEnergetique' ] ),
        bonusRate:                 getNumberData( oldData[ 'tauxPrime' ] ),
        housing:                   {
            nbOccupant:        getNumberData( oldData[ 'logement' ][ 'occupants' ] ),
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
            period:                  getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            niveauHabitation:        getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            typeChantier:            getObjectData( oldData, [ 'fiche', 'typeChantier' ] ),
            disjoncteur:             getObjectData( oldData, [ 'fiche', 'disjoncteur' ] ),
            tensionDisponible:       getObjectData( oldData, [ 'fiche', 'tensionDisponible' ] ),
            distanceCompteurCet:     getNumberData( oldData[ 'fiche' ] [ 'distanceCompteurCet' ] ),
            natureMurExt:            getObjectData( oldData, [ 'fiche', 'natureMurExt' ] ),
            naturePlafond:           getObjectData( oldData, [ 'fiche', 'naturePlafond' ] ),
            visiteComble:            getObjectData( oldData, [ 'fiche', 'visiteComble' ] ),
            chantierHabite:          getObjectData( oldData, [ 'fiche', 'chantierHabite' ] ),
            grandeEchelle:           getObjectData( oldData, [ 'fiche', 'grandeEchelle' ] ),
            demandeVoirie:           getObjectData( oldData, [ 'fiche', 'demandeVoirie' ] ),
            puissanceCompteur:       getObjectData( oldData, [ 'fiche', 'puissanceCompteur' ] ),
            accesComble:             getObjectData( oldData, [ 'fiche', 'accesComble' ] ),
            rueEtroite:              getObjectData( oldData, [ 'fiche', 'rueEtroite' ] ),
            typeCouverture:          getObjectData( oldData, [ 'fiche', 'typeCouverture' ] ),
            etatToiture:             getObjectData( oldData, [ 'fiche', 'etatToiture' ] ),
            typeCharpente:           getObjectData( oldData, [ 'fiche', 'typeCharpente' ] ),
            nbCompartimentComble:    getNumberData( oldData[ 'fiche' ][ 'nbrCompartementComble' ] ),
            presenceVolige:          getObjectData( oldData, [ 'fiche', 'presenceVolige' ] ),
            nbAccesComble:           getNumberData( oldData [ 'fiche' ][ 'nbrAccesComble' ] ),
            typeRadiateur:           getObjectData( oldData, [ 'fiche', 'typeRadiateur' ] ),
            nbrCompartementComble:   getObjectData( oldData, [ 'fiche', 'nbrCompartementComble' ] ),
            nbrAccesComble:          getObjectData( oldData, [ 'fiche', 'nbrAccesComble' ] ),
            emplacementCetExistante: getObjectData( oldData, [ 'fiche', 'emplacementCetExistante' ] ),
            emplacementCetNew:       getObjectData( oldData, [ 'fiche', 'emplacementCetNew' ] ),
            aspirationType:          getObjectData( oldData, [ 'fiche', 'aspirationType' ] ),
            ballonFixeMur:           getObjectData( oldData, [ 'fiche', 'ballonFixeMur' ] ),
            uniteExtFixeMur:         getObjectData( oldData, [ 'fiche', 'uniteExtFixeMur' ] ),
            distanceBallonUnitExt:   getNumberData( oldData [ 'fiche' ][ 'distanceBallonUnitExt' ] ),
            infosSup:                getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
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
            tva:                getNumberData( oldData [ 'devis' ][ 'tva' ] ),
            ceeBonus:           getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            selectedProducts:   convertSelectedCetProduct( oldData ),
            products:           convertOldCetProduct( oldData ),
            maPrimeRenovBonus:  getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            discount:           getNumberData( oldData [ 'devis' ][ 'remise' ] ),
            totalHt:            convertOldTotalHt( oldData ),
            totalTva:           convertOldTotalTva( oldData ),
        },
        scales:                    convertOldScales( oldData ),
        statusInDci:               convertOldStatusDci( oldData ),
        errorsStatusInDci:         convertOldErrorStatusDci( oldData ),
        technician:                {
            id:        getObjectData( oldData, [ 'technicien', 'id' ] ),
            lastName:  getObjectData( oldData, [ 'technicien', 'nom' ] ),
            firstName: getObjectData( oldData, [ 'technicien', 'prenom' ] ),
            phone:     getObjectData( oldData, [ 'technicien', 'tel' ] ),
        },
        lists:                     convertOldCetItemList( oldData ),
    };
};
