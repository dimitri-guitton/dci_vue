import { BaseConverter } from '@/services/file/converterV2/BaseConverter';
import { Product } from '@/types/v2/File/Common/Product';
import { FILE_PG } from '@/services/constantService';

export class PgConverter extends BaseConverter {
    private getOldProduct(): Product[] {
        const pgProducts: Product[] = [];
        const oldProducts: []       = this.getObjectData( this.oldData,
                                                          [
                                                              'devis',
                                                              'poeles',
                                                              'products',
                                                          ] ) === ( {} || '' ) ? [] : this.getObjectData( this.oldData,
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

        const oldFumisteries: [] = this.getObjectData( this.oldData,
                                                       [
                                                           'devis',
                                                           'fumisteries',
                                                           'products',
                                                       ] ) === ( {} || '' ) ? [] : this.getObjectData( this.oldData,
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
    }

    private getOldSelectedProduct(): Product[] {
        const selectedPgProducts: Product[] = [];
        const idSelectedProduct             = this.getNumberData( this.oldData[ 'devis' ][ 'poeles' ][ 'selectedId' ] );
        const idSelectedFumisterie          = this.getNumberData( this.oldData[ 'devis' ][ 'fumisteries' ][ 'selectedId' ] );
        const oldProducts: []               = this.getObjectData( this.oldData,
                                                                  [
                                                                      'devis',
                                                                      'poeles',
                                                                      'products',
                                                                  ] ) === ( {} || '' ) ? [] : this.getObjectData(
            this.oldData,
            [
                'devis',
                'poeles',
                'products',
            ] );
        const oldFumisteries: []            = this.getObjectData( this.oldData,
                                                                  [
                                                                      'devis',
                                                                      'fumisteries',
                                                                      'products',
                                                                  ] ) === ( {} || '' ) ? [] : this.getObjectData(
            this.oldData,
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
    }

    public convertJsonFile() {
        const convertedJson = super.convertJsonFile();

        // Récupération de nouveau JSON
        let fileData = this.getNewJson( FILE_PG );

        fileData = {
            ...fileData,
            ...convertedJson,
            type:      FILE_PG,
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
                outsideSocket:     this.getBoolData( this.oldData[ 'outsideSocket' ] ),
                smoke:             'back',
            },
            worksheet: {
                ...convertedJson.worksheet,
                generateur:                  this.getObjectData( this.oldData, [ 'fiche', 'generateur' ] ),
                marque:                      this.getObjectData( this.oldData, [ 'fiche', 'marque' ] ),
                modele:                      this.getObjectData( this.oldData, [ 'fiche', 'modele' ] ),
                puissance:                   this.getObjectData( this.oldData, [ 'fiche', 'puissance' ] ),
                conduiteMateriau:            this.getObjectData( this.oldData, [ 'fiche', 'conduiteMateriau' ] ),
                conduiteDiametre:            this.getObjectData( this.oldData, [ 'fiche', 'conduiteDiametre' ] ),
                longueurTotal:               this.getObjectData( this.oldData, [ 'fiche', 'longueurTotal' ] ),
                longeurProjection:           this.getObjectData( this.oldData, [ 'fiche', 'longeurProjection' ] ),
                nbCoude90:                   this.getObjectData( this.oldData, [ 'fiche', 'nbCoude90' ] ),
                nbCoude45:                   this.getObjectData( this.oldData, [ 'fiche', 'nbCoude45' ] ),
                reductionSection:            this.getObjectData( this.oldData, [ 'fiche', 'reductionSection' ] ),
                etat:                        this.getObjectData( this.oldData, [ 'fiche', 'etat' ] ),
                demontable:                  this.getObjectData( this.oldData, [ 'fiche', 'demontable' ] ),
                distanceSecurite:            this.getObjectData( this.oldData, [ 'fiche', 'distanceSecurite' ] ),
                conduitType:                 this.getObjectData( this.oldData, [ 'fiche', 'conduitType' ] ),
                conduitMateriauConstitutif:  this.getObjectData( this.oldData, [ 'fiche', 'conduitMateriauConstitutif' ] ),
                plaqueSignaletique:          this.getObjectData( this.oldData, [ 'fiche', 'plaqueSignaletique' ] ),
                classeTemperature:           this.getObjectData( this.oldData, [ 'fiche', 'classeTemperature' ] ),
                classePression:              this.getObjectData( this.oldData, [ 'fiche', 'classePression' ] ),
                resistanceCondansat:         this.getObjectData( this.oldData, [ 'fiche', 'resistanceCondansat' ] ),
                resistanceCorrosion:         this.getObjectData( this.oldData, [ 'fiche', 'resistanceCorrosion' ] ) === 'yes',
                resistanceFeu:               this.getObjectData( this.oldData, [ 'fiche', 'resistanceFeu' ] ),
                distanceSecuriteCombustible: this.getObjectData( this.oldData, [ 'fiche', 'distanceSecuriteCombustible' ] ),
                presenceTrappe:              this.getObjectData( this.oldData, [ 'fiche', 'presenceTrappe' ] ) === 'yes',
                hauteurTotal:                this.getObjectData( this.oldData, [ 'fiche', 'hauteurTotal' ] ),
                hauteurLocauxChauffe:        this.getObjectData( this.oldData, [ 'fiche', 'hauteurLocauxChauffe' ] ),
                hauteurLocauxNonChauffe:     this.getObjectData( this.oldData, [ 'fiche', 'hauteurLocauxNonChauffe' ] ),
                hauteurExterieur:            this.getObjectData( this.oldData, [ 'fiche', 'hauteurExterieur' ] ),
                devoiement:                  this.getObjectData( this.oldData, [ 'fiche', 'devoiement' ] ),
                distanceDevoiement:          this.getObjectData( this.oldData, [ 'fiche', 'distanceDevoiement' ] ),
                conduitIsole:                this.getObjectData( this.oldData, [ 'fiche', 'conduitIsole' ] ),
                sectionConduitLargeur:       this.getObjectData( this.oldData, [ 'fiche', 'sectionConduitLargeur' ] ),
                sectionConduitLongeur:       this.getObjectData( this.oldData, [ 'fiche', 'sectionConduitLongeur' ] ),
                sectionConduitDiametre:      this.getObjectData( this.oldData, [ 'fiche', 'sectionConduitDiametre' ] ),
                deboucheSup40:               this.getObjectData( this.oldData, [ 'fiche', 'deboucheSup40' ] ) === 'yes',
                obstacleInf8:                this.getObjectData( this.oldData, [ 'fiche', 'obstacleInf8' ] ),
                deboucheAccessible:          this.getObjectData( this.oldData, [ 'fiche', 'deboucheAccessible' ] ),
                typeDebouche:                this.getObjectData( this.oldData, [ 'fiche', 'typeDebouche' ] ),
                toiture:                     this.getObjectData( this.oldData, [ 'fiche', 'toiture' ] ),
                pieceLogement:               this.getObjectData( this.oldData, [ 'fiche', 'pieceLogement' ] ),
                pieceLongueur:               this.getObjectData( this.oldData, [ 'fiche', 'pieceLongueur' ] ),
                pieceLargeur:                this.getObjectData( this.oldData, [ 'fiche', 'pieceLargeur' ] ),
                pieceHauteur:                this.getObjectData( this.oldData, [ 'fiche', 'pieceHauteur' ] ),
                pieceSurface:                this.getObjectData( this.oldData, [ 'fiche', 'pieceSurface' ] ),
                accesPorteLargeur:           this.getObjectData( this.oldData, [ 'fiche', 'accesPorteLargeur' ] ),
                accesPorteHauteur:           this.getObjectData( this.oldData, [ 'fiche', 'accesPorteHauteur' ] ),
                natureMur:                   this.getObjectData( this.oldData, [ 'fiche', 'natureMur' ] ),
                natureSol:                   this.getObjectData( this.oldData, [ 'fiche', 'natureSol' ] ),
                naturePlafond:               this.getObjectData( this.oldData, [ 'fiche', 'naturePlafond' ] ),
                ameneeAir:                   this.getObjectData( this.oldData, [ 'fiche', 'ameneeAir' ] ),
                priseElec:                   this.getObjectData( this.oldData, [ 'fiche', 'priseElec' ] ),
                niveauHabitation:            this.getObjectData( this.oldData, [ 'fiche', 'niveauHabitation' ] ),
                typeChantier:                this.getObjectData( this.oldData, [ 'fiche', 'typeChantier' ] ),
                escalier:                    this.getObjectData( this.oldData, [ 'fiche', 'escalier' ] ),
                escalierLargeur:             this.getObjectData( this.oldData, [ 'fiche', 'escalierLargeur' ] ),
                zoneInstallation:            this.getObjectData( this.oldData, [ 'fiche', 'zoneInstallation' ] ),
                creation:                    this.getObjectData( this.oldData, [ 'fiche', 'creation' ] ),
            },
        };
        return fileData;
    }
}
