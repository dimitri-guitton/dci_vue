import RoProduct from '@/types/Ro/RoProduct';
import RoOption from '@/types/Ro/RoOption';
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
} from '@/services/folder/convertData';
import RrFolder from '@/types/Rr/RrFolder';
import RrMulti from '@/types/Rr/RrMulti';

const convertOldRrProduct = ( oldData ): RoProduct[] => {
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

const convertSelectedRProduct = ( oldData ): RoProduct[] => {
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

const convertOldRrOptions = ( oldData ): RoOption[] => {
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

export const convertOldRRFolder = ( oldData ): RrFolder => {
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
            options:            convertOldRrOptions( oldData ),
            blankOptions:       convertOldBlankOptions( oldData ),
            commentary:         getObjectData( oldData, [ 'devis', 'commentaires' ] ),
            partner:            getObjectData( oldData, [ 'devis', 'partner' ] ),
            texts:              convertOldText( oldData ),
            tva10:              getObjectData( oldData, [ 'devis', 'tva10' ] ),
            tva20:              getObjectData( oldData, [ 'devis', 'tva20' ] ),
            ceeBonus:           getObjectData( oldData, [ 'devis', 'primeCEE' ] ),
            maPrimeRenovBonus:  getObjectData( oldData, [ 'devis', 'primeAnah' ] ),
            selectedProducts:   convertSelectedRProduct( oldData ),
            rrType:             getObjectData( oldData, [ 'devis', 'rrType' ] ),
            rrMulti:            convertOldRrMulti( oldData ),
            assortment:         getObjectData( oldData, [ 'devis', 'gamme' ] ),
            products:           convertOldRrProduct( oldData ),
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
        lists:                     [],
    };
};
