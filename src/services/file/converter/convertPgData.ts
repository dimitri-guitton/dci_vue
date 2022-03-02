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
    convertTechnician,
    getBoolData,
    getNullableNumberData,
    getNumberData,
    getObjectData,
    getStringData,
} from '@/services/file/converter/convertData';
import { Product } from '@/types/v2/File/Common/Product';
import PgList from '@/types/v2/File/Pg/PgList';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { FILE_PG } from '@/services/constantService';

const convertOldPgProduct = ( oldData ): Product[] => {
    const pgProducts: Product[] = [];
    const oldProducts: []       = getObjectData( oldData,
                                                 [
                                                     'devis',
                                                     'poeles',
                                                     'products',
                                                 ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                            [
                                                                                                'devis',
                                                                                                'poeles',
                                                                                                'products',
                                                                                            ] );

    oldProducts.forEach( product => {
        pgProducts.push( {
                             id:          product[ 'id' ],
                             productType: FILE_PG,
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             type:        product[ 'type' ],
                             power:       product[ 'puissance' ],
                             color:       product[ 'couleurProfile' ],
                             quantity:    1,
                         } );
    } );

    const oldFumisteries: [] = getObjectData( oldData,
                                              [
                                                  'devis',
                                                  'fumisteries',
                                                  'products',
                                              ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                         [
                                                                                             'devis',
                                                                                             'fumisteries',
                                                                                             'products',
                                                                                         ] );

    oldFumisteries.forEach( product => {
        pgProducts.push( {
                             id:          product[ 'id' ] + 100,
                             productType: 'fumisterie',
                             label:       product[ 'label' ],
                             reference:   product[ 'ref' ],
                             pu:          product[ 'pu' ],
                             defaultPu:   product[ 'defaultPU' ],
                             description: product[ 'descr' ],
                             type:        product[ 'type' ],
                             air:         product[ 'air' ],
                             quantity:    1,
                         } );
    } );

    return pgProducts;
};

const convertSelectedPgProduct = ( oldData ): Product[] => {
    const selectedPgProducts: Product[] = [];
    const idSelectedProduct             = getNumberData( oldData[ 'devis' ][ 'poeles' ][ 'selectedId' ] );
    const idSelectedFumisterie          = getNumberData( oldData[ 'devis' ][ 'fumisteries' ][ 'selectedId' ] );
    const oldProducts: []               = getObjectData( oldData,
                                                         [
                                                             'devis',
                                                             'poeles',
                                                             'products',
                                                         ] ) === ( {} || '' ) ? [] : getObjectData(
        oldData,
        [
            'devis',
            'poeles',
            'products',
        ] );
    const oldFumisteries: []            = getObjectData( oldData,
                                                         [
                                                             'devis',
                                                             'fumisteries',
                                                             'products',
                                                         ] ) === ( {} || '' ) ? [] : getObjectData(
        oldData,
        [
            'devis',
            'fumisteries',
            'products',
        ] );

    oldProducts.forEach( product => {
        if ( product[ 'id' ] === idSelectedProduct ) {
            selectedPgProducts.push( {
                                         id:          product[ 'id' ],
                                         productType: FILE_PG,
                                         label:       product[ 'label' ],
                                         reference:   product[ 'ref' ],
                                         pu:          product[ 'pu' ],
                                         defaultPu:   product[ 'defaultPU' ],
                                         description: product[ 'descr' ],
                                         type:        product[ 'type' ],
                                         power:       product[ 'puissance' ],
                                         color:       product[ 'couleurProfile' ],
                                         quantity:    1,
                                     } );

        }
    } );

    oldFumisteries.forEach( product => {
        if ( product[ 'id' ] === idSelectedFumisterie ) {
            selectedPgProducts.push( {
                                         id:          product[ 'id' ],
                                         productType: 'fumisterie',
                                         label:       product[ 'label' ],
                                         reference:   product[ 'ref' ],
                                         pu:          product[ 'pu' ],
                                         defaultPu:   product[ 'defaultPU' ],
                                         description: product[ 'descr' ],
                                         type:        product[ 'type' ],
                                         quantity:    1,
                                     } );

        }
    } );

    return selectedPgProducts;
};

const convertOldPgItemList = ( oldData ): PgList => {
    const lists: PgList = {
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

    const pgItems = [
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

    for ( const item of pgItems ) {
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

export const convertOldPgFile = ( oldData ): PgFile => {
    return {
        version:                   '1',
        type:                      FILE_PG,
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
            insulationQuality: getObjectData( oldData, [ 'logement', 'qualiteIsolation' ] ),
            constructionYear:  getNullableNumberData( oldData [ 'logement' ][ 'anneeConstruction' ] ),
            lessThan2Years:    getObjectData( oldData, [ 'logement', 'moinsDe2Ans' ] ),
            availableVoltage:  '',
        },
        worksheet: {
            period:                      getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
            generateur:                  getObjectData( oldData, [ 'fiche', 'generateur' ] ),
            marque:                      getObjectData( oldData, [ 'fiche', 'marque' ] ),
            modele:                      getObjectData( oldData, [ 'fiche', 'modele' ] ),
            puissance:                   getObjectData( oldData, [ 'fiche', 'puissance' ] ),
            conduiteMateriau:            getObjectData( oldData, [ 'fiche', 'conduiteMateriau' ] ),
            conduiteDiametre:            getObjectData( oldData, [ 'fiche', 'conduiteDiametre' ] ),
            longueurTotal:               getObjectData( oldData, [ 'fiche', 'longueurTotal' ] ),
            longeurProjection:           getObjectData( oldData, [ 'fiche', 'longeurProjection' ] ),
            nbCoude90:                   getObjectData( oldData, [ 'fiche', 'nbCoude90' ] ),
            nbCoude45:                   getObjectData( oldData, [ 'fiche', 'nbCoude45' ] ),
            reductionSection:            getObjectData( oldData, [ 'fiche', 'reductionSection' ] ),
            etat:                        getObjectData( oldData, [ 'fiche', 'etat' ] ),
            demontable:                  getObjectData( oldData, [ 'fiche', 'demontable' ] ),
            distanceSecurite:            getObjectData( oldData, [ 'fiche', 'distanceSecurite' ] ),
            conduitType:                 getObjectData( oldData, [ 'fiche', 'conduitType' ] ),
            conduitMateriauConstitutif:  getObjectData( oldData, [ 'fiche', 'conduitMateriauConstitutif' ] ),
            plaqueSignaletique:          getObjectData( oldData, [ 'fiche', 'plaqueSignaletique' ] ),
            classeTemperature:           getObjectData( oldData, [ 'fiche', 'classeTemperature' ] ),
            classePression:              getObjectData( oldData, [ 'fiche', 'classePression' ] ),
            resistanceCondansat:         getObjectData( oldData, [ 'fiche', 'resistanceCondansat' ] ),
            resistanceCorrosion:         getObjectData( oldData, [ 'fiche', 'resistanceCorrosion' ] ),
            resistanceFeu:               getObjectData( oldData, [ 'fiche', 'resistanceFeu' ] ),
            distanceSecuriteCombustible: getObjectData( oldData, [ 'fiche', 'distanceSecuriteCombustible' ] ),
            presenceTrappe:              getObjectData( oldData, [ 'fiche', 'presenceTrappe' ] ),
            hauteurTotal:                getObjectData( oldData, [ 'fiche', 'hauteurTotal' ] ),
            hauteurLocauxChauffe:        getObjectData( oldData, [ 'fiche', 'hauteurLocauxChauffe' ] ),
            hauteurLocauxNonChauffe:     getObjectData( oldData, [ 'fiche', 'hauteurLocauxNonChauffe' ] ),
            hauteurExterieur:            getObjectData( oldData, [ 'fiche', 'hauteurExterieur' ] ),
            devoiement:                  getObjectData( oldData, [ 'fiche', 'devoiement' ] ),
            distanceDevoiement:          getObjectData( oldData, [ 'fiche', 'distanceDevoiement' ] ),
            conduitIsole:                getObjectData( oldData, [ 'fiche', 'conduitIsole' ] ),
            sectionConduitLargeur:       getObjectData( oldData, [ 'fiche', 'sectionConduitLargeur' ] ),
            sectionConduitLongeur:       getObjectData( oldData, [ 'fiche', 'sectionConduitLongeur' ] ),
            sectionConduitDiametre:      getObjectData( oldData, [ 'fiche', 'sectionConduitDiametre' ] ),
            deboucheSup40:               getObjectData( oldData, [ 'fiche', 'deboucheSup40' ] ),
            obstacleInf8:                getObjectData( oldData, [ 'fiche', 'obstacleInf8' ] ),
            deboucheAccessible:          getObjectData( oldData, [ 'fiche', 'deboucheAccessible' ] ),
            typeDebouche:                getObjectData( oldData, [ 'fiche', 'typeDebouche' ] ),
            toiture:                     getObjectData( oldData, [ 'fiche', 'toiture' ] ),
            pieceLogement:               getObjectData( oldData, [ 'fiche', 'pieceLogement' ] ),
            pieceLongueur:               getObjectData( oldData, [ 'fiche', 'pieceLongueur' ] ),
            pieceLargeur:                getObjectData( oldData, [ 'fiche', 'pieceLargeur' ] ),
            pieceHauteur:                getObjectData( oldData, [ 'fiche', 'pieceHauteur' ] ),
            pieceSurface:                getObjectData( oldData, [ 'fiche', 'pieceSurface' ] ),
            accesPorteLargeur:           getObjectData( oldData, [ 'fiche', 'accesPorteLargeur' ] ),
            accesPorteHauteur:           getObjectData( oldData, [ 'fiche', 'accesPorteHauteur' ] ),
            natureMur:                   getObjectData( oldData, [ 'fiche', 'natureMur' ] ),
            natureSol:                   getObjectData( oldData, [ 'fiche', 'natureSol' ] ),
            naturePlafond:               getObjectData( oldData, [ 'fiche', 'naturePlafond' ] ),
            ameneeAir:                   getObjectData( oldData, [ 'fiche', 'ameneeAir' ] ),
            priseElec:                   getObjectData( oldData, [ 'fiche', 'priseElec' ] ),
            niveauHabitation:            getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            typeChantier:                getObjectData( oldData, [ 'fiche', 'typeChantier' ] ),
            infosSup:                    getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
            escalier:                    getObjectData( oldData, [ 'fiche', 'escalier' ] ),
            escalierLargeur:             getObjectData( oldData, [ 'fiche', 'escalierLargeur' ] ),
            zoneInstallation:            getObjectData( oldData, [ 'fiche', 'zoneInstallation' ] ),
            creation:                    getObjectData( oldData, [ 'fiche', 'creation' ] ),
        },
        quotation: {
            origin:             getObjectData( oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: getObjectData( oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:     getObjectData( oldData, [ 'devis', 'delaisExecution' ] ),
            options:            convertOldOptions( oldData ),
            blankOptions:      convertOldBlankOptions( oldData ),
            commentary:        getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:           getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:             convertOldText( oldData ),
            tva:               getNumberData( oldData [ 'devis' ][ 'tva' ] ),
            tva20:             0,
            ceeBonus:          getNumberData( oldData [ 'devis' ][ 'primeCEE' ] ),
            selectedProducts:  convertSelectedPgProduct( oldData ),
            products:          convertOldPgProduct( oldData ),
            outsideSocket:     getBoolData( oldData[ 'outsideSocket' ] ),
            maPrimeRenovBonus: getNumberData( oldData [ 'devis' ][ 'primeAnah' ] ),
            discount:          getNumberData( oldData [ 'devis' ][ 'remise' ] ),
            totalHt:           convertOldTotalHt( oldData ),
            totalTva:          convertOldTotalTva( oldData ),
            totalTtc:          0,
            remainderToPay:    0,
        },
        scales:    convertOldScales( oldData ),
        statusInDci: convertOldStatusDci( oldData ),
        errorsStatusInDci: convertOldErrorStatusDci( oldData ),
        technician: convertTechnician( oldData ),
        lists: convertOldPgItemList( oldData ),
    };
};
