import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { FILE_PAC_RO } from '@/services/constantService';

export class RoConverter extends BaseConverter {
    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_PAC_RO );

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_PAC_RO,
            housing:   {
                ...fileData.housing,
                ...convertedJson.housing,
                heatingType:         this.getObjectData( this.oldData, [ 'logement', 'chauffageType' ] ),
                availableVoltage:    this.getObjectData( this.oldData, [ 'logement', 'tensionDisponible' ] ),
                buildingCoefficient: 0.8,           // Anciennment Isolation
                climaticZone:        'B',           // Zone climatique
                altitude:            0,
                heaters:             'r_fonte',     // Radiateurs
                ceilingHeight:       2.5,           // Hauteur sous plafond
                setPointTemperature: 19,            // Température de consigne
            },
            quotation: {
                ...fileData.quotation,
                ...convertedJson.quotation,
                maPrimeRenovBonus: this.getNumberData( this.oldData [ 'devis' ][ 'primeAnah' ] ),
                assortment:        this.getObjectData( this.oldData, [ 'devis', 'gamme' ] ),
                volumeECS:         this.getNumberData( this.oldData [ 'devis' ][ 'ro' ][ 'volumeECS' ] ),
                volumeECSDeporte:  this.getNumberData( this.oldData [ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ] ) === 0
                                   ? 150
                                   : this.getNumberData( this.oldData [ 'devis' ][ 'ro' ][ 'volumeECSDeporte' ] ),
                isEcsDeporte:      this.getBoolData( this.oldData [ 'devis' ][ 'ro' ][ 'isEcsDeporte' ] ),
                ceilingHeight:     this.getNumberData( this.oldData [ 'devis' ][ 'ro' ][ 'hauteurSousPlafond' ] ),
                deviceToReplace:   {
                    type:  this.getObjectData( this.oldData, [ 'devis', 'ro', 'appareilRemplacer', 'type' ] ),
                    brand: this.getObjectData( this.oldData, [ 'devis', 'ro', 'appareilRemplacer', 'marque' ] ),
                    model: this.getObjectData( this.oldData, [ 'devis', 'ro', 'appareilRemplacer', 'modele' ] ),
                },
                cascadeSystem:     false,

            },
            worksheet: {
                ...convertedJson.worksheet,
                niveauHabitation:          this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                typeChantier:              this.getObjectData( this.oldData, [ 'fiche', 'typeChantier' ] ),
                disjoncteur:               this.getObjectData( this.oldData, [ 'fiche', 'disjoncteur' ] ),
                natureMurExt:              this.getObjectData( this.oldData, [ 'fiche', 'natureMurExt' ] ),
                naturePlafond:             this.getObjectData( this.oldData, [ 'fiche', 'naturePlafond' ] ),
                visiteComble:              this.getObjectData( this.oldData, [ 'fiche', 'visiteComble' ] ),
                chantierHabite:            this.getObjectData( this.oldData, [ 'fiche', 'chantierHabite' ] ),
                grandeEchelle:             this.getObjectData( this.oldData, [ 'fiche', 'grandeEchelle' ] ),
                demandeVoirie:             this.getObjectData( this.oldData, [ 'fiche', 'demandeVoirie' ] ),
                puissanceCompteur:         this.getObjectData( this.oldData, [ 'fiche', 'puissanceCompteur' ] ),
                distanceCompteurPac:       this.getObjectData( this.oldData, [ 'fiche', 'distanceCompteurPac' ] ),
                accesComble:               this.getObjectData( this.oldData, [ 'fiche', 'accesComble' ] ),
                rueEtroite:                this.getObjectData( this.oldData, [ 'fiche', 'rueEtroite' ] ),
                typeCouverture:            this.getObjectData( this.oldData, [ 'fiche', 'typeCouverture' ] ),
                etatToiture:               this.getObjectData( this.oldData, [ 'fiche', 'etatToiture' ] ),
                typeCharpente:             this.getObjectData( this.oldData, [ 'fiche', 'typeCharpente' ] ),
                nbCompartimentComble:      this.getObjectData( this.oldData, [ 'fiche', 'nbrCompartementComble' ] ),
                presenceVolige:            this.getObjectData( this.oldData, [ 'fiche', 'presenceVolige' ] ),
                nbAccesComble:             this.getObjectData( this.oldData, [ 'fiche', 'nbrAccesComble' ] ),
                distanceGpExtUnitInt:      this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtUnitInt' ] ),
                nbTotalRadiateur:          this.getObjectData( this.oldData, [ 'fiche', 'nbrTotalRadiateur' ] ),
                nbRadiateurThermostatique: this.getObjectData( this.oldData, [ 'fiche', 'nbrRadiateurThermostatique' ] ),
                typeRadiateur:             this.getObjectData( this.oldData, [ 'fiche', 'typeRadiateur' ] ),
                espaceSolRequisUnitInt:    this.getObjectData( this.oldData, [ 'fiche', 'espaceSolRequisUnitInt' ] ),
                hauteurRequiseUnitInt:     this.getObjectData( this.oldData, [ 'fiche', 'hauteurRequiseUnitInt' ] ),
                positionEauChaude:         this.getObjectData( this.oldData, [ 'fiche', 'positionEauChaude' ] ),
                hauteurDuSol:              this.getObjectData( this.oldData, [ 'fiche', 'hauteurDuSol' ] ),
                tensionDisponible:         this.getObjectData( this.oldData, [ 'fiche', 'tensionDisponible' ] ),
            },
        };

        return fileData;
    }
}
