import fs from 'fs';
import Store from 'electron-store';
import * as commonService from './commonService';
import FolderRo from '@/types/Ro/FolderRo';
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

    if ( oldData === null ) {
        return false;
    }

    let selectedEcsDeporte: EcsDeporte | undefined;
    if ( oldData[ 'devis' ][ 'ro' ][ 'isEcsDeporte' ] ) {
        selectedEcsDeporte = {
            volume:      oldData[ 'devis' ][ 'ro' ][ 'selectedEcsDeporte' ][ 'volume' ],
            label:       oldData[ 'devis' ][ 'ro' ][ 'selectedEcsDeporte' ][ 'label' ],
            ref:         oldData[ 'devis' ][ 'ro' ][ 'selectedEcsDeporte' ][ 'ref' ],
            pu:          oldData[ 'devis' ][ 'ro' ][ 'selectedEcsDeporte' ][ 'pu' ],
            description: oldData[ 'devis' ][ 'ro' ][ 'selectedEcsDeporte' ][ 'descr' ],
        };
    }
    let selectedKitBiZone: KitBiZone | undefined;
    if ( oldData[ 'devis' ][ 'ro' ][ 'isKitBiZone' ] ) {
        selectedKitBiZone = {
            label: oldData[ 'devis' ][ 'ro' ][ 'selectedKitBiZone' ][ 'label' ],
            ref:   oldData[ 'devis' ][ 'ro' ][ 'selectedKitBiZone' ][ 'ref' ],
            pu:    oldData[ 'devis' ][ 'ro' ][ 'selectedKitBiZone' ][ 'volume' ],
        };
    }

    const texts: Text[] = [];
    if ( oldData[ 'devis' ][ 'texte1' ] !== undefined ) {
        texts.push( {
                        title: oldData[ 'devis' ][ 'texte1' ][ 'title' ],
                        text:  oldData[ 'devis' ][ 'texte1' ][ 'text' ],
                    } );
    }
    if ( oldData[ 'devis' ][ 'texte2' ] !== undefined ) {
        texts.push( {
                        title: oldData[ 'devis' ][ 'texte2' ][ 'title' ],
                        text:  oldData[ 'devis' ][ 'texte2' ][ 'text' ],
                    } );
    }
    if ( oldData[ 'devis' ][ 'texte3' ] !== undefined ) {
        texts.push( {
                        title: oldData[ 'devis' ][ 'texte3' ][ 'title' ],
                        text:  oldData[ 'devis' ][ 'texte3' ][ 'text' ],
                    } );
    }

    const roOptions: RoOption[] = [];
    const oldOption: []         = oldData[ 'devis' ][ 'options' ];

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

    const blankOptions: BlankOption[] = [];
    const oldBlankOptions: []         = oldData[ 'devis' ][ 'blankOptions' ];
    oldBlankOptions.forEach( option => {
        blankOptions.push( {
                               id:    option[ 'id' ],
                               label: option[ 'label' ],
                               unit:  option[ 'unit' ],
                               pu:    option[ 'pu' ],
                               value: option[ 'value' ],
                           } );
    } );

    const roProducts: RoProduct[] = [];
    const oldProducts: []         = oldData[ 'devis' ][ 'pompeAChaleur' ][ 'products' ];
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

    const selectedRoProducts: RoProduct[] = [];
    const oldSelectedProducts: []         = oldData[ 'devis' ][ 'selectedProducts' ];
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

    const assents: Assent[] = [];
    const oldAssents: []    = oldData[ 'avis' ];
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

    const scales: Scale[] = [];
    const oldScales: []   = oldData[ 'baremes' ];
    oldScales.forEach( scale => {
        const stages: {
            nbr: number;
            min: number;
            max: number;
        }[]                 = [];
        const oldStages: [] = scale[ 'palierRevenu' ];
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

    let dataGeoportail: DataGeoportail | undefined;

    if ( oldData[ 'logement' ][ 'dataGeoportail' ] !== undefined && oldData[ 'logement' ][ 'dataGeoportail' ][ 'zoom' ] !== undefined ) {
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
    const totalHt           = oldData[ 'devis' ][ 'totalHT' ] !== undefined ? oldData[ 'devis' ][ 'totalHT' ] : 0;
    const totalTva          = oldData[ 'devis' ][ 'totalTVA' ] !== undefined ? oldData[ 'devis' ][ 'totalTVA' ] : 0;
    const statusInDci       = oldData[ 'statutInDCI' ] !== undefined ? oldData[ 'statutInDCI' ] : 1;
    const errorsStatusInDci = oldData[ 'statutInDCIErrors' ] !== undefined ? oldData[ 'statutInDCIErrors' ] : [];

    const roFolder: FolderRo = {
        version:                   oldData[ 'version' ],
        type:                      oldData[ 'type' ],
        ref:                       oldData[ 'ref' ],
        folderName:                oldData[ 'folderName' ],
        createdAt:                 oldData[ 'createdAt' ],
        updatedAt:                 oldData[ 'updatedAt' ],
        settings:                  oldData[ 'settings' ],
        devisTemplate:             oldData[ 'devisTemplate' ][ 'ro' ],
        workSheetTemplate:         oldData[ 'ficheTemplate' ][ 'ro' ],
        disabledBonus:             oldData[ 'disablePrime' ],
        disabledCeeBonus:          oldData[ 'disablePrimeCEE' ],
        enabledHousingAction:      oldData[ 'enabledActionLogement' ],
        disabledMaPrimeRenovBonus: oldData[ 'disablePrimeMaprimerenov' ],
        assent:                    assents,
        beneficiary:               {
            civility:  oldData[ 'beneficiaire' ][ 'civilite' ],
            lastName:  oldData[ 'beneficiaire' ][ 'nom' ],
            firstName: oldData[ 'beneficiaire' ][ 'prenom' ],
            address:   oldData[ 'beneficiaire' ][ 'adresse' ],
            zipCode:   oldData[ 'beneficiaire' ][ 'codepostal' ],
            city:      oldData[ 'beneficiaire' ][ 'ville' ],
            email:     oldData[ 'email' ],
            phone:     oldData[ 'telfixe' ],
            mobile:    oldData[ 'telportable' ],
        },
        codeBonus:                 oldData[ 'codePrime' ],
        energyZone:                oldData[ 'zoneEnergetique' ],
        bonusRate:                 oldData[ 'tauxPrime' ],
        housing:                   {
            nbOccupant:        oldData[ 'logement' ][ 'occupants' ],
            type:              oldData[ 'logement' ][ 'localType' ],
            isAddressBenef:    oldData[ 'logement' ][ 'isAdresseBenef' ],
            addresse:          oldData[ 'logement' ][ 'adresse' ],
            zipCode:           oldData[ 'logement' ][ 'codepostal' ],
            city:              oldData[ 'logement' ][ 'ville' ],
            plot:              oldData[ 'logement' ][ 'parcelle' ],
            area:              oldData[ 'logement' ][ 'superficie' ],
            dataGeoportail:    dataGeoportail,
            location:          oldData[ 'logement' ][ 'location' ],
            insulationQuality: oldData[ 'logement' ][ 'qualiteIsolation' ],
            constructionYear:  oldData[ 'logement' ][ 'anneeConstruction' ],
            lessThan2Years:    oldData[ 'logement' ][ 'moinsDe2Ans' ],
            availableVoltage:  oldData[ 'logement' ][ 'tensionDisponible' ],
        },
        workSheet:                 {
            period:                    oldData[ 'fiche' ][ 'periodePose' ],
            niveauHabitation:          oldData[ 'fiche' ][ 'niveauHabitation' ],
            typeChantier:              oldData[ 'fiche' ][ 'typeChantier' ],
            disjoncteur:               oldData[ 'fiche' ][ 'disjoncteur' ],
            distanceCompteurPac:       oldData[ 'fiche' ][ 'distanceCompteurPac' ],
            natureMurExt:              oldData[ 'fiche' ][ 'natureMurExt' ],
            naturePlafond:             oldData[ 'fiche' ][ 'naturePlafond' ],
            visiteComble:              oldData[ 'fiche' ][ 'visiteComble' ],
            chantierHabite:            oldData[ 'fiche' ][ 'chantierHabite' ],
            grandeEchelle:             oldData[ 'fiche' ][ 'grandeEchelle' ],
            demandeVoirie:             oldData[ 'fiche' ][ 'demandeVoirie' ],
            puissanceCompteur:         oldData[ 'fiche' ][ 'puissanceCompteur' ],
            accesComble:               oldData[ 'fiche' ][ 'accesComble' ],
            rueEtroite:                oldData[ 'fiche' ][ 'rueEtroite' ],
            typeCouverture:            oldData[ 'fiche' ][ 'typeCouverture' ],
            etatToiture:               oldData[ 'fiche' ][ 'etatToiture' ],
            typeCharpente:             oldData[ 'fiche' ][ 'typeCharpente' ],
            nbCompartimentComble:      oldData[ 'fiche' ][ 'nbrCompartementComble' ],
            presenceVolige:            oldData[ 'fiche' ][ 'presenceVolige' ],
            nbAccesComble:             oldData[ 'fiche' ][ 'nbrAccesComble' ],
            distanceGpExtUnitInt:      oldData[ 'fiche' ][ 'distanceGpExtUnitInt' ],
            nbTotalRadiateur:          oldData[ 'fiche' ][ 'nbrTotalRadiateur' ],
            nbRadiateurThermostatique: oldData[ 'fiche' ][ 'nbrRadiateurThermostatique' ],
            typeRadiateur:             oldData[ 'fiche' ][ 'typeRadiateur' ],
            positionEauChaude:         oldData[ 'fiche' ][ 'positionEauChaude' ],
            hauteurDuSol:              oldData[ 'fiche' ][ 'hauteurDuSol' ],
            espaceSolRequisUnitInt:    oldData[ 'fiche' ][ 'espaceSolRequisUnitInt' ],
            hauteurRequiseUnitInt:     oldData[ 'fiche' ][ 'hauteurRequiseUnitInt' ],
            emplacementSplit1:         oldData[ 'fiche' ][ 'emplacementSplit1' ],
            emplacementSplit2:         oldData[ 'fiche' ][ 'emplacementSplit2' ],
            emplacementSplit3:         oldData[ 'fiche' ][ 'emplacementSplit3' ],
            emplacementSplit4:         oldData[ 'fiche' ][ 'emplacementSplit4' ],
            emplacementSplit5:         oldData[ 'fiche' ][ 'emplacementSplit5' ],
            emplacementGrpExt:         oldData[ 'fiche' ][ 'emplacementGrpExt' ],
            emplacementSplitMono:      oldData[ 'fiche' ][ 'emplacementSplitMono' ],
            distanceGpExtSplit1:       oldData[ 'fiche' ][ 'distanceGpExtSplit1' ],
            distanceGpExtSplit2:       oldData[ 'fiche' ][ 'distanceGpExtSplit2' ],
            distanceGpExtSplit3:       oldData[ 'fiche' ][ 'distanceGpExtSplit3' ],
            distanceGpExtSplit4:       oldData[ 'fiche' ][ 'distanceGpExtSplit4' ],
            distanceGpExtSplit5:       oldData[ 'fiche' ][ 'distanceGpExtSplit5' ],
            nbPompeRelevage:           oldData[ 'fiche' ][ 'nbrPompeRelevage' ],
            infosSup:                  oldData[ 'fiche' ][ 'infosSup' ],
        },
        quotation:                 {
            origin:             oldData[ 'devis' ][ 'origine' ],
            dateTechnicalVisit: oldData[ 'devis' ][ 'dateVisiteTech' ],
            executionDelay:     oldData[ 'devis' ][ 'delaisExecution' ],
            options:            roOptions,
            blankOptions:       blankOptions,
            commentary:         oldData[ 'devis' ][ 'commentaires' ],
            partner:            oldData[ 'devis' ][ 'partner' ],
            texts:              texts,
            tva10:              oldData[ 'devis' ][ 'tva10' ],
            tva20:              oldData[ 'devis' ][ 'tva20' ],
            ceeBonus:           oldData[ 'devis' ][ 'primeCEE' ],
            maPrimeRenovBonus:  oldData[ 'devis' ][ 'primeAnah' ],
            selectedProducts:   selectedRoProducts,
            assortment:         oldData[ 'devis' ][ 'gamme' ],
            volumeECS:          oldData[ 'devis' ][ 'ro' ][ 'volumeECS' ],
            volumeECSDeporte:   oldData[ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ],
            isEcsDeporte:       oldData[ 'devis' ][ 'ro' ][ 'isEcsDeporte' ],
            selectedEcsDeporte: selectedEcsDeporte,
            isKitBiZone:        oldData[ 'devis' ][ 'ro' ][ 'isKitBiZone' ],
            selectedKitBiZone:  selectedKitBiZone,
            ceilingHeight:      oldData[ 'devis' ][ 'ro' ][ 'hauteurSousPlafond' ],
            quantity:           oldData[ 'devis' ][ 'ro' ][ 'quantity' ],
            deviceToReplace:    {
                type:  oldData[ 'devis' ][ 'ro' ][ 'appareilRemplacer' ][ 'type' ],
                brand: oldData[ 'devis' ][ 'ro' ][ 'appareilRemplacer' ][ 'marque' ],
                model: oldData[ 'devis' ][ 'ro' ][ 'appareilRemplacer' ][ 'modele' ],
            },
            products:           roProducts,
            discount:           oldData[ 'devis' ][ 'remise' ],
            totalHt:            totalHt,
            totalTva:           totalTva,
        },
        scales:                    scales,
        bonusWithoutCdp:           {
            amount: {
                h1: oldData[ 'horsCdp' ][ 'montantUnitaire' ][ 'H1' ],
                h2: oldData[ 'horsCdp' ][ 'montantUnitaire' ][ 'H2' ],
                h3: oldData[ 'horsCdp' ][ 'montantUnitaire' ][ 'H3' ],
            },
        },
        statusInDci:               statusInDci,
        errorsStatusInDci:         errorsStatusInDci,
        technician:                {
            id:        oldData[ 'technicien' ][ 'nom' ],
            lastName:  oldData[ 'technicien' ][ 'prenom' ],
            firstName: oldData[ 'technicien' ][ 'id' ],
            phone:     oldData[ 'technicien' ][ 'tel' ],
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
