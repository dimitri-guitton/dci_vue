import { PdfGenerator } from '@/services/pdf/pdfGenerator';
import { GREY } from '@/services/pdf/pdfVariable';
import { Housing } from '@/types/v2/File/Common/Housing';
import { Beneficiary } from '@/types/v2/File/Common/Beneficiary';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';

export class NewAddressGenerator extends PdfGenerator {
    private houssing: Housing;
    private beneficiary: Beneficiary;


    constructor( houssing: Housing, beneficiary: Beneficiary ) {
        super();
        this.houssing    = houssing;
        this.beneficiary = beneficiary;

        this.docDefinition = this._generateDocDefinition();
    }

    private static _generateStyle(): StyleDictionary {
        return {
            title: {
                fontSize:  11,
                bold:      true,
                alignment: 'center',
                margin:    [ 0, 15 ],
            },
        };
    }

    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._generateHeader(),
                this._generateBody(),
                NewAddressGenerator._generateSignature(),
            ],
            styles:  NewAddressGenerator._generateStyle(),
        };
    }

    private _generateHeader(): Content {
        return {
            style:  'title',
            table:  {
                widths: [ '100%' ],
                body:   [ [ 'ATTESTATION ADRESSE' ] ],
            },
            layout: {
                hLineWidth:    function () {
                    return 0;
                },
                vLineWidth:    function () {
                    return 0;
                },
                paddingTop:    function () {
                    return 3;
                },
                paddingBottom: function () {
                    return 3;
                },
                fillColor:     function () {
                    return GREY;
                },
            },
        };
    }

    private _generateBody(): Content {
        let type = 'propriétaire';
        if ( this.houssing.isRentedHouse ) {
            type = 'locataire';
        }

        return {
            style:      'text',
            alignment:  'center',
            lineHeight: 1.5,
            stack:      [
                {
                    text: [
                        `Je soussign(é)e, ${ this.beneficiary.firstName } ${ this.beneficiary.lastName }, atteste être `,
                        {
                            text: type,
                            bold: true,
                        },
                        ' du logement dans lequel ont lieu les travaux d\'isolation effectués par Eco Atlantique situé :',
                    ],
                }, {
                    text: `${ this.beneficiary.address }`,
                    bold: true,
                },
                {
                    text: `${ this.beneficiary.zipCode }`,
                    bold: true,
                },
                {
                    text: `${ this.beneficiary.city }`,
                    bold: true,
                },
                'L’adresse figurant sur mon avis d’imposition constitue mon ancienne adresse principale',
            ],
        };
    }

    private static _generateSignature(): Content {
        return {
            style:      'text',
            margin:     [ 0, 50, 0, 0 ],
            lineHeight: 2,
            stack:      [
                `Fait à :`,
                `Le :`,
                'Pour faire valoir ce que de droit,\nSignature du bénéficiaire des travaux',
            ],
        };

    }
}
