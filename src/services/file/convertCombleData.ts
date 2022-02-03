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
} from '@/services/file/convertData';
import ItemList from '@/types/File/ItemList';
import Product from '@/types/File/Product';
import CombleList from '@/types/File/Comble/CombleList';
import CombleFile from '@/types/File/Comble/CombleFile';

const convertOldCombleProduct = ( oldData ): Product[] => {
    const combleProducts: Product[] = [];
    const oldProducts: []           = getObjectData( oldData,
                                                     [ 'devis',
                                                       'isolants',
                                                       'products' ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                                             [ 'devis',
                                                                                                               'isolants',
                                                                                                               'products' ] );

    oldProducts.forEach( product => {
        combleProducts.push( {
                                 id:          product[ 'id' ],
                                 productType: 'iso_comble',
                                 label:       product[ 'label' ],
                                 reference:   product[ 'ref' ],
                                 pu:          product[ 'pu' ],
                                 defaultPu:   product[ 'defaultPU' ],
                                 description: product[ 'descr' ],
                                 type:        product[ 'type' ],
                                 power:       product[ 'puissance' ],
                                 color:       product[ 'couleurProfile' ],
                             } );
    } );
    return combleProducts;
};

const convertSelectedCombleProduct = ( oldData ): Product[] => {
    const selectedCombleProducts: Product[] = [];
    const idSelectedProduct                 = getNumberData( oldData[ 'devis' ][ 'isolants' ][ 'selectedId' ] );
    const oldProducts: []                   = getObjectData( oldData,
                                                             [ 'devis',
                                                               'isolants',
                                                               'products' ] ) === ( {} || '' ) ? [] : getObjectData(
        oldData,
        [ 'devis',
          'isolants',
          'products' ] );
    oldProducts.forEach( product => {
        if ( product[ 'id' ] === idSelectedProduct ) {
            selectedCombleProducts.push( {
                                             id:          product[ 'id' ],
                                             productType: 'pg',
                                             label:       product[ 'label' ],
                                             reference:   product[ 'ref' ],
                                             pu:          product[ 'pu' ],
                                             defaultPu:   product[ 'defaultPU' ],
                                             description: product[ 'descr' ],
                                             type:        product[ 'type' ],
                                             power:       product[ 'puissance' ],
                                             color:       product[ 'couleurProfile' ],
                                         } );

        }
    } );

    return selectedCombleProducts;
};

const convertOldCombleItemList = ( oldData ): CombleList => {
    const lists: CombleList = {
              localTypeList:              [],
              chauffageTypeList:          [],
              batimentNatureList:         [],
              chantierTypeList:           [],
              niveauHabitationList:       [],
              partieAIsolerList:          [],
              puissanceCompteurList:      [],
              accesCombleList:            [],
              couvertureTypeList:         [],
              charpenteTypeList:          [],
              etatToitureList:            [],
              isolationExistanteTypeList: [],
              rehausseTrappeTypeList:     [],
              nbrAccesCombleList:         [],
              nbrCompartimentsList:       [],
          }
    ;

    const combleItems = [
        'localType',
        'chauffageType',
        'batimentNature',
        'chantierType',
        'niveauHabitation',
        'partieAIsoler',
        'puissanceCompteur',
        'accesComble',
        'couvertureType',
        'charpenteType',
        'etatToiture',
        'isolationExistanteType',
        'rehausseTrappeType',
        'nbrAccesComble',
        'nbrCompartiments',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':              'localTypeList',
        'chauffageType':          'chauffageTypeList',
        'batimentNature':         'batimentNatureList',
        'chantierType':           'chantierTypeList',
        'niveauHabitation':       'niveauHabitationList',
        'partieAIsoler':          'partieAIsolerList',
        'puissanceCompteur':      'puissanceCompteurList',
        'accesComble':            'accesCombleList',
        'couvertureType':         'couvertureTypeList',
        'charpenteType':          'charpenteTypeList',
        'etatToiture':            'etatToitureList',
        'isolationExistanteType': 'isolationExistanteTypeList',
        'rehausseTrappeType':     'rehausseTrappeTypeList',
        'nbrAccesComble':         'nbrAccesCombleList',
        'nbrCompartiments':       'nbrCompartimentsList',
    };


    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut

    for ( const item of combleItems ) {
        const oldList = getObjectData( oldData[ 'lists' ], [ item ] );
        if ( !oldList ) {
            continue;
        }
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
    }

    return lists;
};

export const convertOldCombleFile = ( oldData ): CombleFile => {
    return {
        version:                   getStringData( oldData[ 'version' ] ),
        type:                      'comble',
        ref:                       getStringData( oldData[ 'ref' ] ),
        folderName:                getStringData( oldData[ 'folderName' ] ),
        createdAt:                 getStringData( oldData[ 'createdAt' ] ),
        updatedAt:                 getStringData( oldData[ 'updatedAt' ] ),
        settings:                  oldData[ 'settings' ],
        devisTemplate:             getStringData( oldData[ 'devisTemplate' ] ),
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
            visiteComble:              getObjectData( oldData, [ 'fiche', 'visiteComble' ] ),
            chantierHabite:            getObjectData( oldData, [ 'fiche', 'chantierHabite' ] ),
            chantierType:              getObjectData( oldData, [ 'fiche', 'chantierType' ] ),
            niveauHabitation:          getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            gdEchelle:                 getObjectData( oldData, [ 'fiche', 'gdEchelle' ] ),
            partieAisoler:             getObjectData( oldData, [ 'fiche', 'partieAisoler' ] ),
            puissanceCompteur:         getObjectData( oldData, [ 'fiche', 'puissanceCompteur' ] ),
            accesPl:                   getObjectData( oldData, [ 'fiche', 'accesPl' ] ),
            periodePose:               getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            rueEtroite:                getObjectData( oldData, [ 'fiche', 'rueEtroite' ] ),
            accesComble:               getObjectData( oldData, [ 'fiche', 'accesComble' ] ),
            couvertureType:            getObjectData( oldData, [ 'fiche', 'couvertureType' ] ),
            charpenteType:             getObjectData( oldData, [ 'fiche', 'charpenteType' ] ),
            etatToiture:               getObjectData( oldData, [ 'fiche', 'etatToiture' ] ),
            volige:                    getObjectData( oldData, [ 'fiche', 'volige' ] ),
            nbreAccesComble:           getObjectData( oldData, [ 'fiche', 'nbreAccesComble' ] ),
            nbreCompartiments:         getObjectData( oldData, [ 'fiche', 'nbreCompartiments' ] ),
            isolationExistante:        getObjectData( oldData, [ 'fiche', 'isolationExistante' ] ),
            isolationExistanteType:    getObjectData( oldData, [ 'fiche', 'isolationExistanteType' ] ),
            isolationExistanteCouches: getObjectData( oldData, [ 'fiche', 'isolationExistanteCouches' ] ),
            lardagePareVapeur:         getObjectData( oldData, [ 'fiche', 'lardagePareVapeur' ] ),
            rehausseTrappeType:        getObjectData( oldData, [ 'fiche', 'rehausseTrappeType' ] ),
            desencombrement:           getObjectData( oldData, [ 'fiche', 'desencombrement' ] ),
            infosSup:                  getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
        },
        quotation:                 {
            pose:               getObjectData( oldData, [ 'devis', 'pose' ] ),
            overridePose:       getObjectData( oldData, [ 'devis', 'overridePose' ] ),
            origin:             getObjectData( oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: getObjectData( oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:     getObjectData( oldData, [ 'devis', 'delaisExecution' ] ),
            options:            convertOldOptions( oldData ),
            blankOptions:       convertOldBlankOptions( oldData ),
            commentary:         getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:            getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:              convertOldText( oldData ),
            tva:                getObjectData( oldData, [ 'devis', 'tva20' ] ),
            selectedProducts:   convertSelectedCombleProduct( oldData ),
            products:           convertOldCombleProduct( oldData ),
            discount:           getObjectData( oldData, [ 'devis', 'remise' ] ),
            totalHt:            convertOldTotalHt( oldData ),
            totalTva:           convertOldTotalTva( oldData ),
        },
        scales:                    convertOldScales( oldData ),
        statusInDci:               convertOldStatusDci( oldData ),
        errorsStatusInDci:         convertOldErrorStatusDci( oldData ),
        technician:                {
            id:        getObjectData( oldData, [ 'technicien', 'nom' ] ),
            lastName:  getObjectData( oldData, [ 'technicien', 'prenom' ] ),
            firstName: getObjectData( oldData, [ 'technicien', 'id' ] ),
            phone:     getObjectData( oldData, [ 'technicien', 'tel' ] ),
        },
        lists:                     convertOldCombleItemList( oldData ),
    };
};
