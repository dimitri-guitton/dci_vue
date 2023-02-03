import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { MA_PRIME_RENOV_V2_PAGE_1, MA_PRIME_RENOV_V2_PAGE_1_WITHOUT_C2, MA_PRIME_RENOV_V2_PAGE_2 } from '@/services/pdf/pdfVariable';
import { getAddress } from '@/services/data/dataService';

export class MaPrimeRenovGenerator extends PdfGenerator {
    private _file: AllFile;
    private _style: StyleDictionary = {
        table:   {
            fontSize: 8,
            font:     'Times',
        },
        text:    {
            fontSize: 8,
            font:     'Times',
        },
        xsText:  {
            fontSize: 7,
            font:     'Times',
        },
        xxsText: {
            fontSize: 6,
            font:     'Times',
        },
    };


    constructor( file: AllFile ) {
        super();
        this._file = file;
        this.type  = PdfType.MaPrimeRenov;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        let page1 = MA_PRIME_RENOV_V2_PAGE_1;
        if ( this._file.disabledMaPrimeRenovBonus ) {
            page1 = MA_PRIME_RENOV_V2_PAGE_1_WITHOUT_C2;
        }

        return {
            pageMargins: [ 0, 0, 0, 0 ],
            content:     [
                {
                    margin: [ 0, 0, 0, 0 ],
                    image:  page1,
                    fit:    [ 830, 830 ],
                },
                this._addDataPage1(),
                {
                    margin: [ 0, 0, 0, 0 ],
                    image:  MA_PRIME_RENOV_V2_PAGE_2,
                    fit:    [ 830, 830 ],
                },
            ],
            styles:      this._style,
        };
    }

    private _addDataPage1(): Content {

        // On récup l'adresse
        const { address, zipCode, city } = getAddress( this._file );

        let coord = { x: 108, y: 326 };
        if ( this._file.beneficiary.civility === 'm' ) {
            coord = { x: 66, y: 326 };
        }

        return {
            fontSize: 10,
            stack:    [
                {
                    text:             '.',
                    absolutePosition: coord,
                    fontSize:         41,
                },
                {
                    text:             this._file.beneficiary.lastName.toUpperCase(),
                    absolutePosition: { x: 80, y: 370 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.firstName.toUpperCase(),
                    absolutePosition: { x: 373, y: 370 },
                    characterSpacing: 5.6,
                },
                {
                    text:             '.',
                    absolutePosition: { x: 55, y: 360 },
                    fontSize:         38,
                },
                {
                    text:             address.toUpperCase(),
                    absolutePosition: { x: 58, y: 411 },
                    characterSpacing: 5.6,
                },
                {
                    text:             zipCode,
                    absolutePosition: { x: 102, y: 425 },
                    characterSpacing: 5.6,
                },
                {
                    text:             city.toUpperCase(),
                    absolutePosition: { x: 201, y: 426 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.email.toUpperCase(),
                    absolutePosition: { x: 109, y: 442 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.mobile !== '' ? this._file.beneficiary.mobile : this._file.beneficiary.phone,
                    absolutePosition: { x: 148, y: 458 },
                    characterSpacing: 5.6,
                },
            ],
        };
    }
}
