import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { ENEDIS_1, ENEDIS_2, ENEDIS_3, ENEDIS_4, ENEDIS_Y_CHECKBOX } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { getAddress } from '@/services/data/dataService';

export class EnedisMandateGenerator extends PdfGenerator {
    private _file: AllFile;

    private _style: StyleDictionary = {
        title: {
            fontSize:  11,
            bold:      true,
            alignment: 'center',
            margin:    [ 0, 15 ],
        },
    };


    constructor( file: AllFile ) {
        super();
        this._file = file;
        this.type  = PdfType.EnedisMandate;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                {
                    margin: [ 0, 0, 0, 0 ],
                    image:  ENEDIS_1,
                    fit:    [ 830, 830 ],
                },
                {
                    margin:    [ 0, 0, 0, 0 ],
                    image:     ENEDIS_2,
                    fit:       [ 830, 830 ],
                    pageBreak: 'before',
                },
                this.generateDataPage2(),
                {
                    margin:    [ 0, 0, 0, 0 ],
                    image:     ENEDIS_3,
                    fit:       [ 830, 830 ],
                    pageBreak: 'before',
                },
                {
                    margin:    [ 0, 0, 0, 0 ],
                    image:     ENEDIS_4,
                    fit:       [ 830, 830 ],
                    pageBreak: 'before',
                },
            ],
            styles:  this._style,
        };
    }

    private generateDataPage2(): Content {
        // On récup l'adresse
        const { address, zipCode, city } = getAddress( this._file );

        return {
            fontSize: 10,
            stack:    [
                {
                    image:            ENEDIS_Y_CHECKBOX,
                    absolutePosition: { x: 50, y: 194 },
                    width:            5,
                },
                {
                    text:             `${ this._file.beneficiary.firstName } ${ this._file.beneficiary.lastName }`,
                    absolutePosition: { x: 175, y: 191 },
                    fontSize:         8,
                },
                {
                    text:             `${ address }, ${ city } ${ zipCode }`,
                    absolutePosition: { x: 310, y: 191 },
                    fontSize:         8,
                },
            ],
        };
    }

}
