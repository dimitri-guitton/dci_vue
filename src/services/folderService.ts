import fs from 'fs';
import Store from 'electron-store';
import * as commonService from './commonService';
import RoFolder from '@/types/Ro/RoFolder';
import RoOption from '@/types/Ro/RoOption';
import BlankOption from '@/types/BlankOption';
import Text from '@/types/Text';
import RoProduct from '@/types/Ro/RoProduct';
import EcsDeporte from '@/types/Ro/EcsDeporte';
import KitBiZone from '@/types/Ro/KitBiZone';
import Assent from '@/types/Assent';
import Scale from '@/types/Scale';
import DataGeoportail from '@/types/DataGeoportail';

const schema = {
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

// Store pour stoker les users Data
const store = new Store( { schema } );

/**
 * Créé le dossier DCI si il n'exsite pas
 */
export const createDciFolderIfNotExist = () => {
    const dropboxPath = store.get( 'dropboxPath' );
    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI' ) ) {
        fs.mkdirSync( dropboxPath + '/DCI' );
    }
};

/**
 * Créer un dossier de devis avec le type et le nom du client
 * @param type
 * @param customer
 */
export const createAFolder = ( type: string, customer: string ) => {
    const dropboxPath = store.get( 'dropboxPath' );

    const today      = new Date();
    const stringDate = `${ today.getFullYear() }${ commonService.minTwoDigits( today.getMonth() + 1 ) }${ commonService.minTwoDigits(
        today.getDate() ) }${ commonService.minTwoDigits( today.getHours() ) }${ commonService.minTwoDigits( today.getMinutes() ) }`;
    const folderSlug = `ID_COM-${ stringDate }-${ type.toUpperCase() } (${ customer.toUpperCase() })`;

    if ( !fs.existsSync( dropboxPath + '/DCI/' + folderSlug ) ) {
        fs.mkdirSync( dropboxPath + '/DCI/' + folderSlug );
    }

    return folderSlug;
};


const getObjectData = ( data: any, keys: any[] ): any => {
    // Si l'élément n'existe pas on retourne un objet vide ou un string
    if ( keys.length > 1 && data[ keys[ 0 ] ] === undefined ) {
        return {};
    } else if ( keys.length > 0 && data[ keys[ 0 ] ] === undefined ) {
        return '';
    }

    // Retourne la data quand l'array keys est vide
    if ( keys.length === 0 ) {
        return data;
    } else {
        const elem = keys.shift();
        return getObjectData( data[ elem ], keys );
    }
};

const getStringData = ( data: any ): string => {
    return data === undefined ? '' : data;
};

const getNumberData = ( data: any ): number => {
    return data === undefined ? 0 : data;
};

const getBoolData = ( data: any ): boolean => {
    return data === undefined ? false : data;
};

const getArrayData = ( data: any ): [] => {
    return data === undefined ? [] : data;
};

const convertOldText = ( oldData ): Text[] => {
    const texts: Text[] = [];
    if ( getObjectData( oldData, [ 'devis', 'texte1' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte1', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte1', 'text' ] ),
                    } );
    }
    if ( getObjectData( oldData, [ 'devis', 'texte2' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte2', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte2', 'text' ] ),
                    } );
    }
    if ( getObjectData( oldData, [ 'devis', 'texte3' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte3', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte3', 'text' ] ),
                    } );
    }

    if ( getObjectData( oldData, [ 'devis', 'texte4' ] ) !== '' ) {
        texts.push( {
                        title: getObjectData( oldData, [ 'devis', 'texte4', 'title' ] ),
                        text:  getObjectData( oldData, [ 'devis', 'texte4', 'text' ] ),
                    } );
    }

    return texts;
};

const convertOldBeneficiary = ( oldData ): Beneficiary => {
    return {
        civility:  getObjectData( oldData, [ 'beneficiaire', 'civilite' ] ),
        lastName:  getObjectData( oldData, [ 'beneficiaire', 'nom' ] ),
        firstName: getObjectData( oldData, [ 'beneficiaire', 'prenom' ] ),
        address:   getObjectData( oldData, [ 'beneficiaire', 'adresse' ] ),
        zipCode:   getObjectData( oldData, [ 'beneficiaire', 'codepostal' ] ),
        city:      getObjectData( oldData, [ 'beneficiaire', 'ville' ] ),
        email:     getStringData( oldData[ 'email' ] ),
        phone:     getStringData( oldData[ 'telfixe' ] ),
        mobile:    getStringData( oldData[ 'telportable' ] ),
    };
};

const convertOldAssent = ( oldData ): Assent[] => {
    const assents: Assent[] = [];
    const oldAssents: []    = getArrayData( oldData[ 'avis' ] );
    oldAssents.forEach( assent => {
        assents.push( {
                          uid:            assent[ 'uid' ],
                          refAvis:        assent[ 'refAvis' ],
                          numFiscal:      assent[ 'numFiscal' ],
                          isbeneficiaire: assent[ 'isbeneficiaire' ],
                          datagouv:       {
                              refAvis:   assent[ 'datagouv' ][ 'refAvis' ],
                              numFiscal: assent[ 'datagouv' ][ 'numFiscal' ],
                              loaded:    assent[ 'datagouv' ][ 'loaded' ],
                              nom:       assent[ 'datagouv' ][ 'nom' ],
                              prenom:    assent[ 'datagouv' ][ 'prenom' ],
                              adresse:   assent[ 'datagouv' ][ 'adresse' ],
                              ville:     assent[ 'datagouv' ][ 'ville' ],
                              revenu:    assent[ 'datagouv' ][ 'revenu' ],
                              error:     assent[ 'datagouv' ][ 'error' ],
                          },
                          nom:            assent[ 'nom' ],
                          prenom:         assent[ 'prenom' ],
                          adresse:        assent[ 'adresse' ],
                          codepostal:     assent[ 'codepostal' ],
                          ville:          assent[ 'ville' ],
                          revenu:         assent[ 'revenu' ],
                          civilite:       assent[ 'civilite' ],
                      } );
    } );

    return assents;
};

const convertOldDataGeoportail = ( oldData ): DataGeoportail | undefined => {
    let dataGeoportail: DataGeoportail | undefined;

    if ( getObjectData( oldData, [ 'logement', 'dataGeoportail' ] ) !== '' ) {
        dataGeoportail = {
            zoom:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'zoom' ],
            center:   oldData[ 'logement' ][ 'dataGeoportail' ][ 'center' ],
            position: oldData[ 'logement' ][ 'dataGeoportail' ][ 'position' ],
            zipCode:  oldData[ 'logement' ][ 'dataGeoportail' ][ 'codepostal' ],
            city:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'ville' ],
            address:  oldData[ 'logement' ][ 'dataGeoportail' ][ 'adresse' ],
            plot:     oldData[ 'logement' ][ 'dataGeoportail' ][ 'parcelle' ],
        };
    }

    return dataGeoportail;
};

const convertOldScales = ( oldData ): Scale[] => {
    const scales: Scale[] = [];
    const oldScales: []   = getArrayData( oldData[ 'baremes' ] );
    oldScales.forEach( scale => {
        const stages: {
            nbr: number;
            min: number;
            max: number;
        }[] = [];

        const oldStages: [] = getArrayData( scale[ 'palierRevenu' ] );

        oldStages.forEach( stage => {
            {
                stages.push( {
                                 nbr: stage[ 'nbre' ],
                                 min: stage[ 'min' ],
                                 max: stage[ 'max' ],
                             } );
            }
        } );

        scales.push( {
                         stages:   stages,
                         code:     scale[ 'code' ],
                         ceeBonus: {
                             h1: scale[ 'primeCEE' ][ 'H1' ],
                             h2: scale[ 'primeCEE' ][ 'H3' ],
                             h3: scale[ 'primeCEE' ][ 'H1' ],
                         },
                     } )
        ;
    } );

    return scales;
};

const convertOldBlankOptions = ( oldData ): BlankOption[] => {
    const blankOptions: BlankOption[] = [];
    const oldBlankOptions: []         = getArrayData( oldData[ 'devis' ][ 'blankOptions' ] );

    oldBlankOptions.forEach( option => {
        blankOptions.push( {
                               id:    option[ 'id' ],
                               label: option[ 'label' ],
                               unit:  option[ 'unit' ],
                               pu:    option[ 'pu' ],
                               value: option[ 'value' ],
                           } );
    } );

    return blankOptions;
};

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

const convertOldSelectedKitBiZone = ( oldData ): KitBiZone | undefined => {
    let selectedKitBiZone: KitBiZone | undefined;
    if ( getObjectData( oldData, [ 'devis', 'ro', 'isKitBiZone' ] ) === true ) {
        selectedKitBiZone = {
            label: getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'label' ] ),
            ref:   getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'ref' ] ),
            pu:    getObjectData( oldData, [ 'devis', 'ro', 'selectedKitBiZone', 'volume' ] ),
        };
    }

    return selectedKitBiZone;
};

const convertOldSelectedEscDeporte = ( oldData ): EcsDeporte | undefined => {
    let selectedEcsDeporte: EcsDeporte | undefined;

    console.log( 'VOLUME', getObjectData( oldData, [ 'devis', 'ro', 'isEcsDeporte' ] ) );
    if ( getObjectData( oldData, [ 'devis', 'ro', 'isEcsDeporte' ] ) === true ) {
        console.log( '%c IN IF', 'background: #fdd835; color: #000000' );
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


/**
 * Convertie l'ancien système de données avec le nouveau
 */
export const convertOldJsonToNewJson = () => {
    const dropboxPath = store.get( 'dropboxPath' );
    let oldData       = null;

    if ( fs.existsSync( dropboxPath + '/DCI/data.json' ) ) {
        oldData = JSON.parse( fs.readFileSync( dropboxPath + '/DCI/data.json', 'utf8' ) );
        console.log( oldData );
    }

    if ( oldData === null || oldData === undefined ) {
        return false;
    }

    const totalHt           = oldData[ 'devis' ][ 'totalHT' ] !== undefined ? oldData[ 'devis' ][ 'totalHT' ] : 0;
    const totalTva          = oldData[ 'devis' ][ 'totalTVA' ] !== undefined ? oldData[ 'devis' ][ 'totalTVA' ] : 0;
    const statusInDci       = oldData[ 'statutInDCI' ] !== undefined ? oldData[ 'statutInDCI' ] : 1;
    const errorsStatusInDci = oldData[ 'statutInDCIErrors' ] !== undefined ? oldData[ 'statutInDCIErrors' ] : [];

    console.log( '%c DATA', 'background: #ffd800; color: #000000' );
    console.log( getObjectData( oldData, [ 'devisTemplate', 'rr' ] ) );
    const roFolder: RoFolder = {
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
            distanceCompteurPac:       getObjectData( oldData, [ 'fiche', 'distanceCompteurPac' ] ),
            natureMurExt:              getObjectData( oldData, [ 'fiche', 'natureMurExt' ] ),
            naturePlafond:             getObjectData( oldData, [ 'fiche', 'naturePlafond' ] ),
            visiteComble:              getObjectData( oldData, [ 'fiche', 'visiteComble' ] ),
            chantierHabite:            getObjectData( oldData, [ 'fiche', 'chantierHabite' ] ),
            grandeEchelle:             getObjectData( oldData, [ 'fiche', 'grandeEchelle' ] ),
            demandeVoirie:             getObjectData( oldData, [ 'fiche', 'demandeVoirie' ] ),
            puissanceCompteur:         getObjectData( oldData, [ 'fiche', 'puissanceCompteur' ] ),
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
            positionEauChaude:         getObjectData( oldData, [ 'fiche', 'positionEauChaude' ] ),
            hauteurDuSol:              getObjectData( oldData, [ 'fiche', 'hauteurDuSol' ] ),
            espaceSolRequisUnitInt:    getObjectData( oldData, [ 'fiche', 'espaceSolRequisUnitInt' ] ),
            hauteurRequiseUnitInt:     getObjectData( oldData, [ 'fiche', 'hauteurRequiseUnitInt' ] ),
            emplacementSplit1:         getObjectData( oldData, [ 'fiche', 'emplacementSplit1' ] ),
            emplacementSplit2:         getObjectData( oldData, [ 'fiche', 'emplacementSplit2' ] ),
            emplacementSplit3:         getObjectData( oldData, [ 'fiche', 'emplacementSplit3' ] ),
            emplacementSplit4:         getObjectData( oldData, [ 'fiche', 'emplacementSplit4' ] ),
            emplacementSplit5:         getObjectData( oldData, [ 'fiche', 'emplacementSplit5' ] ),
            emplacementGrpExt:         getObjectData( oldData, [ 'fiche', 'emplacementGrpExt' ] ),
            emplacementSplitMono:      getObjectData( oldData, [ 'fiche', 'emplacementSplitMono' ] ),
            distanceGpExtSplit1:       getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit1' ] ),
            distanceGpExtSplit2:       getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit2' ] ),
            distanceGpExtSplit3:       getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit3' ] ),
            distanceGpExtSplit4:       getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit4' ] ),
            distanceGpExtSplit5:       getObjectData( oldData, [ 'fiche', 'distanceGpExtSplit5' ] ),
            nbPompeRelevage:           getObjectData( oldData, [ 'fiche', 'nbrPompeRelevage' ] ),
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
            totalHt:            totalHt,
            totalTva:           totalTva,
        },
        scales:                    convertOldScales( oldData ),
        bonusWithoutCdp:           {
            amount: {
                h1: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H1' ] ),
                h2: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H2' ] ),
                h3: getObjectData( oldData, [ 'horsCdp', 'montantUnitaire', 'H3' ] ),
            },
        },
        statusInDci:               statusInDci,
        errorsStatusInDci:         errorsStatusInDci,
        technician:                {
            id:        getObjectData( oldData, [ 'technicien', 'nom' ] ),
            lastName:  getObjectData( oldData, [ 'technicien', 'prenom' ] ),
            firstName: getObjectData( oldData, [ 'technicien', 'id' ] ),
            phone:     getObjectData( oldData, [ 'technicien', 'tel' ] ),
        },
        lists:                     [],
    };


    // const student = {
    //     name:       'Mike',
    //     age:        23,
    //     gender:     'Male',
    //     department: 'English',
    //     car:        'Honda',
    // };
    //
    const data = JSON.stringify( roFolder );

    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI/newData.json' ) ) {
        fs.writeFileSync( dropboxPath + '/DCI/newData.json', data );
    }
    console.log( '%c IN CONVERT OLD TO NEW', 'background: #fdd835; color: #000000' );
    return true;
};
