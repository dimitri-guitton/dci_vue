import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { Product } from '@/types/v2/File/Common/Product';
import { FILE_CET } from '@/services/constantService';

export class CetConverter extends BaseConverter {
    private getOldProduct(): Product[] {
        const ceProducts: Product[] = [];
        const oldProducts: []       = this.getObjectData( this.oldData,
                                                          [
                                                              'devis',
                                                              'chauffeEau',
                                                              'products',
                                                          ] ) === ( {} || '' ) ? [] : this.getObjectData( this.oldData,
                                                                                                          [
                                                                                                              'devis',
                                                                                                              'chauffeEau',
                                                                                                              'products',
                                                                                                          ] );

        oldProducts.forEach( product => {
            ceProducts.push( {
                                 id:          product[ 'id' ],
                                 productType: FILE_CET,
                                 label:       product[ 'label' ],
                                 reference:   product[ 'ref' ],
                                 pu:          product[ 'pu' ],
                                 defaultPu:   product[ 'defaultPU' ],
                                 description: product[ 'descr' ],
                                 size:        product[ 'size' ],
                                 type:        product[ 'type' ],
                                 quantity:    1,
                             } );
        } );

        return ceProducts;
    }

    private getOldSelectedProduct(): Product[] {
        const selectedCeProducts: Product[] = [];
        const idSelectedProduct             = this.getObjectData( this.oldData, [ 'devis', 'chauffeEau', 'selectedId' ] );
        const oldProducts: []               = this.getObjectData( this.oldData,
                                                                  [
                                                                      'devis',
                                                                      'chauffeEau',
                                                                      'products',
                                                                  ] ) === ( {} || '' ) ? [] : this.getObjectData( this.oldData,
                                                                                                                  [
                                                                                                                      'devis',
                                                                                                                      'chauffeEau',
                                                                                                                      'products',
                                                                                                                  ] );

        if ( oldProducts === undefined ) {
            return [];
        }

        oldProducts.forEach( product => {
            if ( product[ 'id' ] === idSelectedProduct ) {
                selectedCeProducts.push( {
                                             id:          product[ 'id' ],
                                             productType: FILE_CET,
                                             label:       product[ 'label' ],
                                             reference:   product[ 'ref' ],
                                             pu:          product[ 'pu' ],
                                             defaultPu:   product[ 'defaultPU' ],
                                             description: product[ 'descr' ],
                                             size:        product[ 'size' ],
                                             type:        product[ 'type' ],
                                             quantity:    1,
                                         } );
            }
        } );

        return selectedCeProducts;
    }

    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_CET );

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_CET,
            housing:   {
                ...fileData.housing,
                ...convertedJson.housing,
                heatingType:       this.getObjectData( this.oldData, [ 'logement', 'chauffageType' ] ),
                insulationQuality: this.getObjectData( this.oldData, [ 'logement', 'qualiteIsolation' ] ),
                availableVoltage:  this.getObjectData( this.oldData, [ 'logement', 'tensionDisponible' ] ),
            },
            quotation: {
                ...fileData.quotation,
                ...convertedJson.quotation,
                selectedProducts:  this.getOldSelectedProduct(),
                products:          this.getOldProduct(),
                maPrimeRenovBonus: this.getNumberData( this.oldData [ 'devis' ][ 'primeAnah' ] ),
            },
            worksheet: {
                ...convertedJson.worksheet,
                niveauHabitation:        this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                typeChantier:            this.getObjectData( this.oldData, [ 'fiche', 'typeChantier' ] ),
                disjoncteur:             this.getObjectData( this.oldData, [ 'fiche', 'disjoncteur' ] ),
                tensionDisponible:       this.getObjectData( this.oldData, [ 'fiche', 'tensionDisponible' ] ),
                distanceCompteurCet:     this.getNumberData( this.oldData[ 'fiche' ] [ 'distanceCompteurCet' ] ),
                natureMurExt:            this.getObjectData( this.oldData, [ 'fiche', 'natureMurExt' ] ),
                naturePlafond:           this.getObjectData( this.oldData, [ 'fiche', 'naturePlafond' ] ),
                visiteComble:            this.getObjectData( this.oldData, [ 'fiche', 'visiteComble' ] ),
                chantierHabite:          this.getObjectData( this.oldData, [ 'fiche', 'chantierHabite' ] ),
                grandeEchelle:           this.getObjectData( this.oldData, [ 'fiche', 'grandeEchelle' ] ),
                demandeVoirie:           this.getObjectData( this.oldData, [ 'fiche', 'demandeVoirie' ] ),
                puissanceCompteur:       this.getObjectData( this.oldData, [ 'fiche', 'puissanceCompteur' ] ),
                accesComble:             this.getObjectData( this.oldData, [ 'fiche', 'accesComble' ] ),
                rueEtroite:              this.getObjectData( this.oldData, [ 'fiche', 'rueEtroite' ] ),
                typeCouverture:          this.getObjectData( this.oldData, [ 'fiche', 'typeCouverture' ] ),
                etatToiture:             this.getObjectData( this.oldData, [ 'fiche', 'etatToiture' ] ),
                typeCharpente:           this.getObjectData( this.oldData, [ 'fiche', 'typeCharpente' ] ),
                nbCompartimentComble:    this.getNumberData( this.oldData[ 'fiche' ][ 'nbrCompartementComble' ] ),
                presenceVolige:          this.getObjectData( this.oldData, [ 'fiche', 'presenceVolige' ] ),
                nbAccesComble:           this.getNumberData( this.oldData [ 'fiche' ][ 'nbrAccesComble' ] ),
                emplacementCetExistante: this.getObjectData( this.oldData, [ 'fiche', 'emplacementCetExistante' ] ),
                emplacementCetNew:       this.getObjectData( this.oldData, [ 'fiche', 'emplacementCetNew' ] ),
                aspirationType:          this.getObjectData( this.oldData, [ 'fiche', 'aspirationType' ] ),
                ballonFixeMur:           this.getObjectData( this.oldData, [ 'fiche', 'ballonFixeMur' ] ),
                uniteExtFixeMur:         this.getObjectData( this.oldData, [ 'fiche', 'uniteExtFixeMur' ] ),
                distanceBallonUnitExt:   this.getNumberData( this.oldData [ 'fiche' ][ 'distanceBallonUnitExt' ] ),
            },
        };

        return fileData;
    }
}
