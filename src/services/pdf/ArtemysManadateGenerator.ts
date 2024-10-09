import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { ARTEMYS_1, ARTEMYS_2 } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { getBeneficiaryAddress, getHousingAddress } from '@/services/data/dataService';

export class ArtemysManadateGenerator extends PdfGenerator {
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
        this.type  = PdfType.CityHallMandate;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                {
                    margin: [ 0, 0, 0, 0 ],
                    image:  ARTEMYS_1,
                    fit:    [ 830, 830 ],
                },
                this.generateDataPage1(),
                {
                    margin:    [ 0, 0, 0, 0 ],
                    image:     ARTEMYS_2,
                    fit:       [ 830, 830 ],
                    pageBreak: 'before',
                },
                this.generateDataPage2(),
            ],
            styles:  this._style,
        };
    }

    private generateDataPage1(): Content {
        const { address: housingAddress, zipCode: housingZipCode, city: housingCity }             = getHousingAddress( this._file );
        const { address: beneficiaryAddress, zipCode: beneficiaryZipCode, city: beneficiaryCity } = getBeneficiaryAddress( this._file );

        return {
            fontSize: 10,
            stack:    [
                {
                    text:             `${ this._file.beneficiary.firstName } ${ this._file.beneficiary.lastName }`,
                    absolutePosition: { x: 150, y: 333 },
                    fontSize:         10,
                },
                {
                    text:             `${ beneficiaryAddress }, ${ beneficiaryCity } ${ beneficiaryZipCode }`,
                    absolutePosition: { x: 82, y: 366 },
                    fontSize:         10,
                },
                {
                    text:             `${ housingAddress }, ${ housingCity } ${ housingZipCode }`,
                    absolutePosition: { x: 82, y: 645 },
                    fontSize:         10,
                },
            ],
        };
    }

    private generateDataPage2(): Content {
        const today                                                                   = new Date();
        const date                                                                    = `${ today.getDate() }/${ today.getMonth() + 1 }/${ today.getFullYear() }`;
        const { address: housingAddress, zipCode: housingZipCode, city: housingCity } = getHousingAddress( this._file );

        return {
            fontSize: 10,
            stack:    [
                {
                    text:             `${ date }`,
                    absolutePosition: { x: 320, y: 187 },
                    fontSize:         10,
                },
                {
                    text:             `${ housingAddress }, ${ housingCity } ${ housingZipCode }`,
                    absolutePosition: { x: 110, y: 187 },
                    fontSize:         10,
                },
                {
                    text:             `${ this._file.beneficiary.firstName } ${ this._file.beneficiary.lastName }`,
                    absolutePosition: { x: 90, y: 615 },
                    fontSize:         12,
                },
                {
                    text:             `${ date }`,
                    absolutePosition: { x: 110, y: 665 },
                    fontSize:         12,
                },
                {
                    text:             `${ date }`,
                    absolutePosition: { x: 350, y: 665 },
                    fontSize:         12,
                },
            ],
        };
    }


}
