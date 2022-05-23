import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { MA_PRIME_RENOV_V2_PAGE_1, MA_PRIME_RENOV_V2_PAGE_2 } from '@/services/pdf/pdfVariable';
import { getAddress } from '@/services/data/dataService';

export class MaPrimeRenovGeneratorV2 extends PdfGenerator {
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
        return {
            pageMargins: [ 0, 0, 0, 0 ],
            content:     [
                {
                    margin: [ 0, 0, 0, 0 ],
                    image:  MA_PRIME_RENOV_V2_PAGE_1,
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

        let coord = { x: 108, y: 328 };
        if ( this._file.beneficiary.civility === 'm' ) {
            coord = { x: 66, y: 328 };
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
                    absolutePosition: { x: 80, y: 372 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.firstName.toUpperCase(),
                    absolutePosition: { x: 373, y: 372 },
                    characterSpacing: 5.6,
                },
                {
                    text:             '.',
                    absolutePosition: { x: 55, y: 362 },
                    fontSize:         38,
                },
                {
                    text:             address.toUpperCase(),
                    absolutePosition: { x: 58, y: 413 },
                    characterSpacing: 5.6,
                },
                {
                    text:             zipCode,
                    absolutePosition: { x: 102, y: 427 },
                    characterSpacing: 5.6,
                },
                {
                    text:             city.toUpperCase(),
                    absolutePosition: { x: 201, y: 428 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.email.toUpperCase(),
                    absolutePosition: { x: 109, y: 444 },
                    characterSpacing: 5.6,
                },
                {
                    text:             this._file.beneficiary.mobile !== '' ? this._file.beneficiary.mobile : this._file.beneficiary.phone,
                    absolutePosition: { x: 148, y: 460 },
                    characterSpacing: 5.6,
                },
            ],
        };
    }
}
