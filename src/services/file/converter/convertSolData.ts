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
import { Product } from '@/types/v2/File/Common/Product';
import SolList from '@/types/v2/File/Sol/SolList';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { FILE_SOL } from '@/services/constantService';

const convertOldSolProduct = ( oldData ): Product[] => {
    const solProducts: Product[] = [];
    const oldProducts: []        = getObjectData( oldData,
                                                  [
                                                      'devis',
                                                      'isolants',
                                                      'products',
                                                  ] ) === ( {} || '' ) ? [] : getObjectData( oldData,
                                                                                             [
                                                                                                 'devis',
                                                                                                 'isolants',
                                                                                                 'products',
                                                                                             ] );

    oldProducts.forEach( product => {
        solProducts.push( {
                              id:          product[ 'id' ],
                              productType: 'iso_sol',
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
    return solProducts;
};

const convertSelectedSolProduct = ( oldData ): Product[] => {
    const selectedSolProducts: Product[] = [];
    const idSelectedProduct              = getNumberData( oldData[ 'devis' ][ 'isolants' ][ 'selectedId' ] );
    const oldProducts: []                = getObjectData( oldData,
                                                          [
                                                              'devis',
                                                              'isolants',
                                                              'products',
                                                          ] ) === ( {} || '' ) ? [] : getObjectData(
        oldData,
        [
            'devis',
            'isolants',
            'products',
        ] );
    oldProducts.forEach( product => {
        if ( product[ 'id' ] === idSelectedProduct ) {
            selectedSolProducts.push( {
                                          id:          product[ 'id' ],
                                          productType: FILE_SOL,
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

    return selectedSolProducts;
};

const convertOldSolItemList = ( oldData ): SolList => {
    const lists: SolList = {
              localTypeList:        [],
              chauffageTypeList:    [],
              batimentNatureList:   [],
              niveauHabitationList: [],
              porteGarageList:      [],
              accesCamionList:      [],
              supportList:          [],
              typeOrigineList:      [],
          }
    ;

    const solItems = [
        'localType',
        'chauffageType',
        'batimentNature',
        'niveauHabitation',
        'porteGarage',
        'accesCamion',
        'support',
    ];

    const newName: { [ key: string ]: string } = {
        'localType':        'localTypeList',
        'chauffageType':    'chauffageTypeList',
        'batimentNature':   'batimentNatureList',
        'niveauHabitation': 'niveauHabitationList',
        'porteGarage':      'porteGarageList',
        'accesCamion':      'accesCamionList',
        'support':          'supportList',
    };


    // @TODO si l'ancien JSON n'a pas la liste la créer avec les nouvelle valeur par défaut

    for ( const item of solItems ) {
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

export const convertOldSolFile = ( oldData ): SolFile => {
    return {
        version:                   getStringData( oldData[ 'version' ] ),
        type:                      FILE_SOL,
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
        housing: {
            nbOccupant:        getNumberData( oldData [ 'logement' ][ 'occupants' ] ),
            type:              getObjectData( oldData, [ 'logement', 'localType' ] ),
            isRentedHouse:     getObjectData( oldData, [ 'logement', 'batimentNature' ] ) === 'location',
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
            availableVoltage:  '',
        },
        workSheet:                 {
            epaisseurProduit:        getObjectData( oldData, [ 'fiche', 'epaisseurProduit' ] ),
            accesCamion:             getObjectData( oldData, [ 'fiche', 'accesCamion' ] ),
            distCamion:              getObjectData( oldData, [ 'fiche', 'distCamion' ] ),
            hautPlafond:             getObjectData( oldData, [ 'fiche', 'hautPlafond' ] ),
            support:                 getObjectData( oldData, [ 'fiche', 'support' ] ),
            distPointEau:            getObjectData( oldData, [ 'fiche', 'distPointEau' ] ),
            resistTherm:             getObjectData( oldData, [ 'fiche', 'resistTherm' ] ),
            dimensionsPieces:        getObjectData( oldData, [ 'fiche', 'dimensionsPieces' ] ),
            isolationExistante:      getObjectData( oldData, [ 'fiche', 'isolationExistante' ] ),
            niveauHabitation:        getObjectData( oldData, [ 'fiche', 'niveauHabitation' ] ),
            habitationSurLocalFroid: getObjectData( oldData, [ 'fiche', 'habitationSurLocalFroid' ] ),
            videSanitaire:           getObjectData( oldData, [ 'fiche', 'videSanitaire' ] ),
            terrePlein:              getObjectData( oldData, [ 'fiche', 'terrePlein' ] ),
            reseauPlafond:           getObjectData( oldData, [ 'fiche', 'reseauPlafond' ] ),
            luminairesPlafond:       getObjectData( oldData, [ 'fiche', 'luminairesPlafond' ] ),
            distancePortesPalfond:   getObjectData( oldData, [ 'fiche', 'distancePortesPalfond' ] ),
            porteGarage:             getObjectData( oldData, [ 'fiche', 'porteGarage' ] ),
            nbrPorteGarage:          getObjectData( oldData, [ 'fiche', 'nbrPorteGarage' ] ),
            infosSup:                getObjectData( oldData, [ 'fiche', 'infosSup' ] ),
            period:                  getObjectData( oldData, [ 'fiche', 'periodePose' ] ),
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
            tva:                getNumberData( oldData [ 'devis' ][ 'tva' ] ),
            selectedProducts:   convertSelectedSolProduct( oldData ),
            products:           convertOldSolProduct( oldData ),
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
        lists:                     convertOldSolItemList( oldData ),
    };
};
