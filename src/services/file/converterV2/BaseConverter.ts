import { Technician } from '@/types/v2/File/Common/Technician';
import { Assent } from '@/types/v2/File/Common/Assent';
import { Beneficiary } from '@/types/v2/File/Common/Beneficiary';
import { Housing } from '@/types/v2/File/Common/Housing';
import { DataGeoportail } from '@/types/v2/File/Common/DataGeoportail';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { Option } from '@/types/v2/File/Common/Option';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import { remote } from 'electron';
import path from 'path';
import fs from 'fs';

export class BaseConverter {
    protected oldData;


    constructor( oldData ) {
        this.oldData = oldData;
    }

    /**
     * Retourne les données de type array
     * @param data
     * @private
     */
    protected getArrayData( data: any ): any[] {
        return data === undefined ? [] : data;
    }

    /**
     * Retourne les données de type string
     * @param data
     * @private
     */
    protected getStringData( data: any ): string {
        return data === undefined ? '' : data;
    }

    /**
     * Retourne les données de type nombre
     * @param data
     * @private
     */
    protected getNumberData( data: any ): number {
        return data === undefined ? 0 : +data;
    }

    /**
     * Retourne les données de type nombre nullable
     * @param data
     * @private
     */
    protected getNullableNumberData( data: any ): number | null {
        if ( data === undefined || data === '' || data === null ) {
            return null;
        }
        return +data;
    }

    /**
     * Retourne les données de type boolean
     * @param data
     * @private
     */
    protected getBoolData( data: any ): boolean {
        return data === undefined ? false : data;
    }

    /**
     * retourne les données de type Object
     * @param data
     * @param keys
     * @private
     */
    protected getObjectData( data: any, keys: any[] ): any {
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
            return this.getObjectData( data[ elem ], keys );
        }
    }


    public convertJsonFile() {
        console.log( '%c CONVERT JSON FILE', 'background: #35D452; color: #000000' );

        return {
            ...this.getOldGlobalInfo(),
            assents:           this.getOldAssents(),
            beneficiary:       this.getOldBeneficiary(),
            housing:           this.getOldBaseHousing(),
            worksheet:         this.getOldBaseWorksheet(),
            quotation:         this.getOldBaseQuotation(),
            statusInDci:       this.getOldStatusDci(),
            errorsStatusInDci: this.getOldErrorStatusDci(),
            technician:        this.getOldTechnician(),

        };
    }

    /**
     * Retourne les données du nouveau JSON
     * @protected
     */
    protected getNewJson( type: string ) {
        const app            = remote.app;
        const downloadFolder = `${ app.getPath( 'userData' ) }/files`;
        const jsonPath       = path.join( downloadFolder, `config_${ type }.json` );
        const rawdata        = fs.readFileSync( jsonPath ).toString( 'utf8' );
        return JSON.parse( rawdata );
    }

    /**
     * retourne le status des primes actif/inactif
     * @protected
     */
    private getOldBonusStatus() {
        return {
            disabledBonus:             this.getBoolData( this.oldData [ 'disablePrime' ] ),
            disabledCeeBonus:          this.getBoolData( this.oldData [ 'disablePrimeCEE' ] ),
            disabledMaPrimeRenovBonus: this.getBoolData( this.oldData [ 'disablePrimeMaprimerenov' ] ),
        };
    }

    /**
     * Retourne les anciens avis d'impot
     * @protected
     */
    protected getOldAssents(): Assent[] {
        const assents: Assent[] = [];
        const oldAssents: any[] = this.getArrayData( this.oldData[ 'avis' ] );


        for ( const assent of oldAssents ) {
            let civility = assent[ 'civilite' ];

            if ( civility !== undefined && civility.toLowerCase() === 'mme' ) {
                civility = 'f';
            }
            if ( civility === 'M' ) {
                civility = 'm';
            }

            assents.push( {
                              refAvis:       assent[ 'refAvis' ],
                              numFiscal:     assent[ 'numFiscal' ],
                              isBeneficiary: this.getBoolData( assent[ 'isbeneficiaire' ] ),
                              datagouv:      {
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
                              nom:           assent[ 'nom' ],
                              prenom:        assent[ 'prenom' ],
                              adresse:       assent[ 'adresse' ],
                              codepostal:    assent[ 'codepostal' ],
                              ville:         assent[ 'ville' ],
                              revenu:        this.getNumberData( assent[ 'revenu' ] ),
                              civility,
                          } );
        }
        return assents;
    }

    /**
     * Retourne l'ancien beneficiaire
     * @protected
     */
    protected getOldBeneficiary(): Beneficiary {
        let income = 0;
        for ( const avis of this.getArrayData( this.oldData[ 'avis' ] ) ) {
            if ( avis.isbeneficiaire ) {
                income = avis.revenu;
            }
        }

        return {
            civility:  this.getObjectData( this.oldData, [ 'beneficiaire', 'civilite' ] ),
            lastName:  this.getObjectData( this.oldData, [ 'beneficiaire', 'nom' ] ),
            firstName: this.getObjectData( this.oldData, [ 'beneficiaire', 'prenom' ] ),
            address:   this.getObjectData( this.oldData, [ 'beneficiaire', 'adresse' ] ),
            zipCode:   this.getObjectData( this.oldData, [ 'beneficiaire', 'codepostal' ] ),
            city:      this.getObjectData( this.oldData, [ 'beneficiaire', 'ville' ] ),
            email:     this.getStringData( this.oldData[ 'email' ] ),
            phone:     this.getStringData( this.oldData[ 'telfixe' ] ),
            mobile:    this.getStringData( this.oldData[ 'telportable' ] ),
            income:    income,
        };
    }

    private getOldGlobalInfo() {
        return {
            version: '3',

            ref:        this.getStringData( this.oldData[ 'ref' ] ),
            folderName: this.getStringData( this.oldData[ 'folderName' ] ),
            createdAt:  this.getStringData( this.oldData[ 'createdAt' ] ),
            updatedAt:  this.getStringData( this.oldData[ 'updatedAt' ] ),
            settings:   this.oldData[ 'settings' ],
            ...this.getOldBonusStatus(),
            codeBonus:  this.getStringData( this.oldData[ 'codePrime' ] ),
            energyZone: this.getStringData( this.oldData[ 'zoneEnergetique' ] ),
            bonusRate:  this.getNumberData( this.oldData[ 'tauxPrime' ] ),
        };
    }

    /**
     * Retourne les anciennes données Geoportail
     */
    private getOldDataGeoportail = (): DataGeoportail => {
        let dataGeoportail: DataGeoportail;

        if ( this.getObjectData( this.oldData, [ 'logement', 'dataGeoportail' ] ) !== '' ) {
            dataGeoportail = {
                // zoom:     this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'zoom' ],
                // center:   this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'center' ],
                // position: this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'position' ],
                zipCode: this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'codepostal' ],
                city:    this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'ville' ],
                address: this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'adresse' ],
                plot:    this.oldData[ 'logement' ][ 'dataGeoportail' ][ 'parcelle' ],
            };
        } else {
            dataGeoportail = {
                zipCode: '',
                city:    '',
                address: '',
                plot:    '',
            };
        }

        return dataGeoportail;
    };


    protected getOldBaseHousing(): Housing {

        let type = this.getObjectData( this.oldData, [ 'logement', 'localType' ] );
        if ( this.oldData[ 'type' ] === 'comble' || this.oldData[ 'type' ] === 'sol' ) {
            type = this.getObjectData( this.oldData, [ 'logement', 'batimentType' ] );
        }

        return {
            nbOccupant:       this.getNumberData( this.oldData[ 'logement' ][ 'occupants' ] ),
            type,
            buildingNature:   this.getObjectData( this.oldData, [ 'logement', 'batimentNature' ] ),
            isRentedHouse:    this.getObjectData( this.oldData, [ 'logement', 'batimentNature' ] ) === 'location',
            isAddressBenef:   this.getObjectData( this.oldData, [ 'logement', 'isAdresseBenef' ] ),
            address:          this.getObjectData( this.oldData, [ 'logement', 'adresse' ] ),
            zipCode:          this.getObjectData( this.oldData, [ 'logement', 'codepostal' ] ),
            city:             this.getObjectData( this.oldData, [ 'logement', 'ville' ] ),
            plot:             this.getObjectData( this.oldData, [ 'logement', 'parcelle' ] ),
            area:             this.getObjectData( this.oldData, [ 'logement', 'superficie' ] ),
            dataGeoportail:   this.getOldDataGeoportail(),
            location:         this.getObjectData( this.oldData, [ 'logement', 'location' ] ),
            constructionYear: this.getNullableNumberData( this.oldData [ 'logement' ][ 'anneeConstruction' ] ),
            lessThan2Years:   this.getObjectData( this.oldData, [ 'logement', 'moinsDe2Ans' ] ) === ''
                              ? false
                              : this.getObjectData( this.oldData, [ 'logement', 'moinsDe2Ans' ] ) === '',
        };
    }

    protected getOldBaseWorksheet(): BaseWorksheet {
        return {
            period:   this.getObjectData( this.oldData, [ 'fiche', 'periodePose' ] ),
            infosSup: this.getObjectData( this.oldData, [ 'fiche', 'infosSup' ] ),
        };
    }

    /**
     * Retourne les anciennes options
     * @private
     */
    private getOldOptions(): Option[] {
        const newOptions: Option[] = [];
        const oldOption: any[]     = this.getArrayData( this.oldData[ 'devis' ][ 'options' ] );

        const type   = this.oldData[ 'type' ].toLowerCase();
        let fileType = 'default';

        if ( type === 'pac' && this.oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
            fileType = FILE_PAC_RO;
        } else if ( type === 'pac' && this.oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
            fileType = FILE_PAC_RR;
        } else if ( type === 'cet' ) {
            fileType = FILE_CET;
        } else if ( type === 'poele' ) {
            fileType = FILE_PG;
        } else if ( type === 'comble' ) {
            fileType = FILE_COMBLE;
        } else if ( type === 'sol' ) {
            fileType = FILE_SOL;
        }

        oldOption.forEach( option => {
            newOptions.push( {
                                 id:            option[ 'id' ],
                                 fileType,
                                 label:         option[ 'label' ],
                                 unit:          option[ 'unit' ],
                                 defaultPu:     option[ 'pu' ][ 'default' ],
                                 pu:            option[ 'pu' ][ 'value' ],
                                 defaultNumber: option[ 'value' ],
                                 number:        option[ 'value' ],
                                 calcTva10:     option[ 'calcTva10' ],
                             } );

        } );

        return newOptions;
    }

    /**
     * Retourne les aciennes oprtions vide
     * @private
     */
    private getOldBlankOptions(): BlankOption[] {
        const blankOptions: BlankOption[] = [];
        const oldBlankOptions: any[]      = this.getArrayData( this.oldData[ 'devis' ][ 'blankOptions' ] );

        oldBlankOptions.forEach( option => {
            blankOptions.push( {
                                   id:     option[ 'id' ],
                                   label:  option[ 'label' ],
                                   unit:   option[ 'unit' ],
                                   pu:     option[ 'pu' ],
                                   number: option[ 'value' ],
                               } );
        } );

        return blankOptions;
    }

    protected getOldBaseQuotation() {
        return {
            origin:             this.getObjectData( this.oldData, [ 'devis', 'origine' ] ),
            dateTechnicalVisit: this.getObjectData( this.oldData, [ 'devis', 'dateVisiteTech' ] ),
            executionDelay:     this.getObjectData( this.oldData, [ 'devis', 'delaisExecution' ] ),
            options:            this.getOldOptions(),
            blankOptions:       this.getOldBlankOptions(),
            commentary:         this.getObjectData( this.oldData, [ 'devis', 'commentaires' ] ),
            partner:            this.getObjectData( this.oldData, [ 'devis', 'partner' ] ),
            discount:           this.getNumberData( this.oldData [ 'devis' ][ 'remise' ] ),
            tva:                this.getNumberData( this.oldData [ 'devis' ][ 'tva' ] ),
            ...this.getOldPrice(),
            paymentOnCredit: {
                active:           false,
                amount:           0,
                withoutInsurance: 0,
                withInsurance:    0,
                duration:         0,
                TAEG:             0,
                total:            0,
            },
        };
    }


    /**
     * Retourne les données du commercial
     * @private
     */
    private getOldTechnician(): Technician {
        if ( this.oldData [ 'technicien' ] == undefined ) {
            return {
                id:        -1,
                lastName:  '',
                firstName: '',
                phone:     '',
            };
        }

        return {
            id:        this.getNumberData( this.oldData [ 'technicien' ][ 'id' ] ),
            lastName:  this.getStringData( this.oldData [ 'technicien' ][ 'nom' ] ),
            firstName: this.getStringData( this.oldData [ 'technicien' ][ 'prenom' ] ),
            phone:     this.getStringData( this.oldData [ 'technicien' ][ 'tel' ] ),
        };
    }

    /**
     * Retourne les infos du prix devis
     * @private
     */
    private getOldPrice() {
        return {
            totalHt:        this.getNumberData( this.oldData[ 'devis' ][ 'totalHT' ] ),
            totalTtc:       this.getNumberData( this.oldData[ 'devis' ][ 'totalTTC' ] ),
            totalTva:       this.getNumberData( this.oldData[ 'devis' ][ 'totalTVA' ] ),
            ceeBonus:       this.getNumberData( this.oldData[ 'devis' ][ 'primeCEE' ] ),
            remainderToPay: 0,
        };
    }

    /**
     * Retourne le status de l'ancien DCI
     * @private
     */
    private getOldStatusDci(): number {
        return this.oldData[ 'statutInDCI' ] !== undefined ? this.oldData[ 'statutInDCI' ] : 1;
    }

    /**
     * Retourne les codes erreur de l'ancien DCI
     * @private
     */
    private getOldErrorStatusDci(): number {
        return this.oldData[ 'statutInDCIErrors' ] !== undefined ? this.oldData[ 'statutInDCIErrors' ] : [];
    }
}
