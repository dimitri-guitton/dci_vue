import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { FILE_PAC_RR } from '@/services/constantService';
import { getObjectData } from '@/services/file/converter/convertData';
import RrMulti from '@/types/v2/File/Rr/RrMulti';

export class RrConverter extends BaseConverter {
    private convertOldRrMulti(): RrMulti {
        let dataRrMulti: RrMulti;

        if ( getObjectData( this.oldData, [ 'devis', 'rrMulti' ] ) !== '' ) {
            dataRrMulti = {
                roomNumber:   this.oldData[ 'devis' ][ 'rrMulti' ][ 'nombreDePiece' ],
                areaP1:       this.oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP1' ],
                areaP2:       this.oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP2' ],
                areaP3:       this.oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP3' ],
                areaP4:       this.oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP4' ],
                areaP5:       this.oldData[ 'devis' ][ 'rrMulti' ][ 'superficieP5' ],
                assortmentP1: this.oldData[ 'devis' ][ 'gamme' ],
                assortmentP2: this.oldData[ 'devis' ][ 'gamme' ],
                assortmentP3: this.oldData[ 'devis' ][ 'gamme' ],
                assortmentP4: this.oldData[ 'devis' ][ 'gamme' ],
                assortmentP5: this.oldData[ 'devis' ][ 'gamme' ],
            };
        } else {
            dataRrMulti = {
                roomNumber:   1,
                areaP1:       0,
                areaP2:       0,
                areaP3:       0,
                areaP4:       0,
                areaP5:       0,
                assortmentP1: 'perfera',
                assortmentP2: 'perfera',
                assortmentP3: 'perfera',
                assortmentP4: 'perfera',
                assortmentP5: 'perfera',
            };
        }

        return dataRrMulti;
    }

    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_PAC_RR );

        let rrType = this.getObjectData( this.oldData, [ 'devis', 'rrType' ] );

        if ( rrType === 'rr_multi' ) {
            rrType = 'multi';
        } else {
            rrType = 'mono';
        }

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_PAC_RR,
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
                tva10:             this.getNumberData( this.oldData [ 'devis' ][ 'tva10' ] ),
                tva20:             this.getNumberData( this.oldData [ 'devis' ][ 'tva20' ] ),
                rrType,
                rrMulti:           this.convertOldRrMulti(),
                assortment:        this.getObjectData( this.oldData, [ 'devis', 'gamme' ] ),

            },
            worksheet: {
                ...convertedJson.worksheet,
                niveauHabitation:     this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                typeChantier:         this.getObjectData( this.oldData, [ 'fiche', 'typeChantier' ] ),
                disjoncteur:          this.getObjectData( this.oldData, [ 'fiche', 'disjoncteur' ] ),
                natureMurExt:         this.getObjectData( this.oldData, [ 'fiche', 'natureMurExt' ] ),
                naturePlafond:        this.getObjectData( this.oldData, [ 'fiche', 'naturePlafond' ] ),
                visiteComble:         this.getObjectData( this.oldData, [ 'fiche', 'visiteComble' ] ),
                chantierHabite:       this.getObjectData( this.oldData, [ 'fiche', 'chantierHabite' ] ),
                grandeEchelle:        this.getObjectData( this.oldData, [ 'fiche', 'grandeEchelle' ] ),
                demandeVoirie:        this.getObjectData( this.oldData, [ 'fiche', 'demandeVoirie' ] ),
                puissanceCompteur:    this.getObjectData( this.oldData, [ 'fiche', 'puissanceCompteur' ] ),
                distanceCompteurPac:  this.getObjectData( this.oldData, [ 'fiche', 'distanceCompteurPac' ] ),
                accesComble:          this.getObjectData( this.oldData, [ 'fiche', 'accesComble' ] ),
                rueEtroite:           this.getObjectData( this.oldData, [ 'fiche', 'rueEtroite' ] ),
                typeCouverture:       this.getObjectData( this.oldData, [ 'fiche', 'typeCouverture' ] ),
                etatToiture:          this.getObjectData( this.oldData, [ 'fiche', 'etatToiture' ] ),
                typeCharpente:        this.getObjectData( this.oldData, [ 'fiche', 'typeCharpente' ] ),
                nbCompartimentComble: this.getObjectData( this.oldData, [ 'fiche', 'nbrCompartementComble' ] ),
                presenceVolige:       this.getObjectData( this.oldData, [ 'fiche', 'presenceVolige' ] ),
                nbAccesComble:        this.getObjectData( this.oldData, [ 'fiche', 'nbrAccesComble' ] ),
                distanceGpExtUnitInt: this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtUnitInt' ] ),
                emplacementSplit1:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplit1' ] ),
                emplacementSplit2:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplit2' ] ),
                emplacementSplit3:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplit3' ] ),
                emplacementSplit4:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplit4' ] ),
                emplacementSplit5:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplit5' ] ),
                emplacementGrpExt:    this.getObjectData( this.oldData, [ 'fiche', 'emplacementGrpExt' ] ),
                emplacementSplitMono: this.getObjectData( this.oldData, [ 'fiche', 'emplacementSplitMono' ] ),
                distanceGpExtSplit1:  this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtSplit1' ] ),
                distanceGpExtSplit2:  this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtSplit2' ] ),
                distanceGpExtSplit3:  this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtSplit3' ] ),
                distanceGpExtSplit4:  this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtSplit4' ] ),
                distanceGpExtSplit5:  this.getObjectData( this.oldData, [ 'fiche', 'distanceGpExtSplit5' ] ),
                nbPompeRelevage:      this.getObjectData( this.oldData, [ 'fiche', 'nbrPompeRelevage' ] ),
                positionEauChaude:    this.getObjectData( this.oldData, [ 'fiche', 'positionEauChaude' ] ),
                hauteurDuSol:         this.getObjectData( this.oldData, [ 'fiche', 'hauteurDuSol' ] ),
            },
        };

        return fileData;
    }
}
