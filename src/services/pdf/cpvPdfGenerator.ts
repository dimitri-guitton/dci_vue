import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { GREEN_CITY_HALL, LOGO_ECO } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';

export class CpvPdfGenerator extends PdfGenerator {
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
        this.type  = PdfType.CpvPdf;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this.generateHeader(),
            ],
            footer:  {
                columns: [
                    {
                        canvas:
                            [
                                {
                                    type:      'line',
                                    x1:        -10, y1: 0,
                                    x2:        600, y2: 0,
                                    lineWidth: 20,
                                    lineColor: GREEN_CITY_HALL,
                                },
                            ],
                    },
                ],
            },
            styles:  this._style,
        };
    }

    private generateHeader(): Content {
        return {
            margin: [ 240, 30, 0, 20 ],
            image:  LOGO_ECO,
            width:  100,
        };
    }
}
