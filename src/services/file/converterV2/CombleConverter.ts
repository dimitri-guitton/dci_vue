import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { Product } from '@/types/v2/File/Common/Product';
import { FILE_COMBLE } from '@/services/constantService';

export class CombleConverter extends BaseConverter {
    private getOldProduct(): Product[] {
        const combleProducts: Product[] = [];
        const oldProducts: []           = this.getObjectData( this.oldData,
                                                              [
                                                                  'devis',
                                                                  'isolants',
                                                                  'products',
                                                              ] ) === ( {} || '' ) ? [] : this.getObjectData( this.oldData,
                                                                                                              [
                                                                                                                  'devis',
                                                                                                                  'isolants',
                                                                                                                  'products',
                                                                                                              ] );

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
                                     quantity:    1,
                                 } );
        } );
        return combleProducts;
    }

    private getOldSelectedProduct(): Product[] {
        const selectedCombleProducts: Product[] = [];
        const idSelectedProduct                 = this.getNumberData( this.oldData[ 'devis' ][ 'isolants' ][ 'selectedId' ] );
        const oldProducts: []                   = this.getObjectData( this.oldData,
                                                                      [
                                                                          'devis',
                                                                          'isolants',
                                                                          'products',
                                                                      ] ) === ( {} || '' ) ? [] : this.getObjectData(
            this.oldData,
            [
                'devis',
                'isolants',
                'products',
            ] );
        oldProducts.forEach( product => {
            if ( product[ 'id' ] === idSelectedProduct ) {
                selectedCombleProducts.push( {
                                                 id:          product[ 'id' ],
                                                 productType: FILE_COMBLE,
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

        return selectedCombleProducts;
    }

    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_COMBLE );

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_COMBLE,
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
                selectedProducts: this.getOldSelectedProduct(),
                products:         this.getOldProduct(),
                laying:           this.getObjectData( this.oldData, [ 'devis', 'pose' ] ),
                overrideLaying:   this.getObjectData( this.oldData, [ 'devis', 'overridePose' ] ),
            },
            worksheet: {
                ...convertedJson.worksheet,
                visiteComble:              this.getObjectData( this.oldData, [ 'fiche', 'visiteComble' ] ),
                chantierHabite:            this.getObjectData( this.oldData, [ 'fiche', 'chantierHabite' ] ),
                typeChantier:              this.getObjectData( this.oldData, [ 'fiche', 'chantierType' ] ),
                niveauHabitation:          this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                gdEchelle:                 this.getObjectData( this.oldData, [ 'fiche', 'gdEchelle' ] ),
                partieAisoler:             this.getObjectData( this.oldData, [ 'fiche', 'partieAisoler' ] ),
                puissanceCompteur:         this.getNumberData( this.oldData [ 'fiche' ][ 'puissanceCompteur' ] ),
                accesPl:                   this.getObjectData( this.oldData, [ 'fiche', 'accesPl' ] ),
                rueEtroite:                this.getObjectData( this.oldData, [ 'fiche', 'rueEtroite' ] ),
                accesComble:               this.getObjectData( this.oldData, [ 'fiche', 'accesComble' ] ),
                couvertureType:            this.getObjectData( this.oldData, [ 'fiche', 'couvertureType' ] ),
                charpenteType:             this.getObjectData( this.oldData, [ 'fiche', 'charpenteType' ] ),
                etatToiture:               this.getObjectData( this.oldData, [ 'fiche', 'etatToiture' ] ),
                volige:                    this.getObjectData( this.oldData, [ 'fiche', 'volige' ] ),
                nbAccesComble:             this.getNumberData( this.oldData [ 'fiche' ][ 'nbreAccesComble' ] ),
                nbCompartimentComble:      this.getNumberData( this.oldData [ 'fiche' ][ 'nbreCompartiments' ] ),
                isolationExistante:        this.getObjectData( this.oldData, [ 'fiche', 'isolationExistante' ] ),
                isolationExistanteType:    this.getObjectData( this.oldData, [ 'fiche', 'isolationExistanteType' ] ),
                isolationExistanteCouches: this.getObjectData( this.oldData, [ 'fiche', 'isolationExistanteCouches' ] ),
                lardagePareVapeur:         this.getObjectData( this.oldData, [ 'fiche', 'lardagePareVapeur' ] ),
                rehausseTrappeType:        this.getObjectData( this.oldData, [ 'fiche', 'rehausseTrappeType' ] ),
                desencombrement:           this.getObjectData( this.oldData, [ 'fiche', 'desencombrement' ] ),
            },
        };

        return fileData;
    }
}
