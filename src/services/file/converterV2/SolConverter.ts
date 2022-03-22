import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { Product } from '@/types/v2/File/Common/Product';
import { FILE_SOL } from '@/services/constantService';
import { getNumberData } from '@/services/file/converter/convertData';

export class SolConverter extends BaseConverter {
    private getOldProduct(): Product[] {
        const solProducts: Product[] = [];
        const oldProducts: []        = this.getObjectData( this.oldData,
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
                                  quantity:    1,
                              } );
        } );
        return solProducts;
    }

    private getOldSelectedProduct(): Product[] {
        const selectedSolProducts: Product[] = [];
        const idSelectedProduct              = this.getNumberData( this.oldData[ 'devis' ][ 'isolants' ][ 'selectedId' ] );
        const oldProducts: []                = this.getObjectData( this.oldData,
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
                                              quantity:    1,
                                          } );

            }
        } );

        return selectedSolProducts;
    }

    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_SOL );

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_SOL,
            housing:   {
                ...convertedJson.housing,
                heatingType:       this.getObjectData( this.oldData, [ 'logement', 'chauffageType' ] ),
                insulationQuality: this.getObjectData( this.oldData, [ 'logement', 'qualiteIsolation' ] ),
                availableVoltage:  this.getObjectData( this.oldData, [ 'logement', 'tensionDisponible' ] ),
            },
            quotation: {
                ...convertedJson.quotation,
                selectedProducts: this.getOldSelectedProduct(),
                products:         this.getOldProduct(),
                laying:           this.getObjectData( this.oldData, [ 'devis', 'pose' ] ),
                overrideLaying:   this.getObjectData( this.oldData, [ 'devis', 'overridePose' ] ),
            },
            worksheet: {
                ...convertedJson.worksheet,
                epaisseurProduit:        this.getObjectData( this.oldData, [ 'fiche', 'epaisseurProduit' ] ),
                accesCamion:             this.getObjectData( this.oldData, [ 'fiche', 'accesCamion' ] ),
                distCamion:              getNumberData( this.oldData [ 'fiche' ][ 'distCamion' ] ),
                hautPlafond:             getNumberData( this.oldData [ 'fiche' ][ 'hautPlafond' ] ),
                support:                 this.getObjectData( this.oldData, [ 'fiche', 'support' ] ),
                distPointEau:            getNumberData( this.oldData [ 'fiche' ][ 'distPointEau' ] ),
                resistTherm:             this.getObjectData( this.oldData, [ 'fiche', 'resistTherm' ] ),
                dimensionsPieces:        this.getObjectData( this.oldData, [ 'fiche', 'dimensionsPieces' ] ),
                isolationExistante:      this.getObjectData( this.oldData, [ 'fiche', 'isolationExistante' ] ),
                niveauHabitation:        this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                habitationSurLocalFroid: this.getObjectData( this.oldData, [ 'fiche', 'habitationSurLocalFroid' ] ),
                videSanitaire:           this.getObjectData( this.oldData, [ 'fiche', 'videSanitaire' ] ),
                terrePlein:              this.getObjectData( this.oldData, [ 'fiche', 'terrePlein' ] ),
                reseauPlafond:           this.getObjectData( this.oldData, [ 'fiche', 'reseauPlafond' ] ),
                luminairesPlafond:       this.getObjectData( this.oldData, [ 'fiche', 'luminairesPlafond' ] ),
                distancePortesPalfond:   this.getObjectData( this.oldData, [ 'fiche', 'distancePortesPalfond' ] ),
                porteGarage:             this.getObjectData( this.oldData, [ 'fiche', 'porteGarage' ] ),
                nbrPorteGarage:          getNumberData( this.oldData [ 'fiche' ][ 'nbrPorteGarage' ] ),
            },
        };

        return fileData;
    }
}
