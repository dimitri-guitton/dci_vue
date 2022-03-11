import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { PAC_DIMENSION } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { getAddress } from '@/services/data/dataService';
import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

export class SizingPacGenerator extends PdfGenerator {
    private _file: AllFile;

    private _style: StyleDictionary = {
        title:   {
            fontSize:  11,
            bold:      true,
            alignment: 'center',
            margin:    [ 0, 15 ],
        },
        table:   { fontSize: 8 },
        text:    { fontSize: 8 },
        xsText:  { fontSize: 7 },
        xxsText: { fontSize: 6 },
    };


    constructor( file: AllFile ) {
        super();
        this._file = file;
        this.type  = PdfType.SizingPac;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        const housing: PacHousing = this._file.housing as PacHousing;
        const pacAlgo             = new PacAlgo( housing );

        const { address, zipCode, city } = getAddress( this._file );
        return {
            content: [
                {
                    unbreakable: true,
                    stack:       [
                        {
                            margin:    [ 0, 25, 0, 10 ],
                            text:      'Dimensionnement d’une pompe à chaleur',
                            bold:      true,
                            fontSize:  16,
                            alignment: 'center',
                        },
                        {
                            text:      `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }`,
                            fontSize:  12,
                            alignment: 'center',
                        },
                        {
                            text:      `${ address } ${ zipCode } ${ city }`,
                            fontSize:  12,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 20, 0, 5 ],
                            text:      'Déperdition = G x V x Delta T',
                            fontSize:  18,
                            bold:      true,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 5, 0, 25 ],
                            text:      `Déperdition = ${ housing.buildingCoefficient } x ${ housing.area * housing.ceilingHeight } x ${ pacAlgo.calcDeltaT(
                                housing.setPointTemperature,
                                housing.climaticZone,
                                housing.altitude ) } = ${ pacAlgo.calcRequiredPower( housing ) } KW`,
                            fontSize:  18,
                            alignment: 'center',
                        },
                        this._addPages,
                    ],
                },
            ],
            styles:  this._style,
        };
    }

    private _addPages: Content[] = [
        {
            margin: [ 0, 0, 0, 0 ],
            image:  PAC_DIMENSION,
            fit:    [ 600, 600 ],
        },
    ];
}
