import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { CITY_HALL_MANDATE_LOGO, GREEN_CITY_HALL } from '@/services/pdf/pdfVariable';
import { Content, CustomTableLayout, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { getAddress } from '@/services/data/dataService';

export class CityHallManadateGenerator extends PdfGenerator {
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
                this.generateData(),
                this.generateHeader(),
                this.generateBody(),
                this.generateSubBody(),
                this.generateBodyFooter(),
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
            image:  CITY_HALL_MANDATE_LOGO,
            width:  100,
        };
    }

    private generateBody(): Content {
        return {
            margin:   [ 0, 3 ],
            fontSize: 10,
            table:    {
                body: [
                    [
                        'Je soussigné(e),',
                    ],
                    [
                        '...............................................................................................................................................................................................................',
                    ],
                    [
                        'Domicilié(e) à,',
                    ],
                    [
                        '...............................................................................................................................................................................................................',
                    ],
                    [
                        '...............................................................................................................................................................................................................',
                    ],
                    [
                        {
                            margin:     [ 25, 15, 0, 30 ],
                            lineHeight: 1.2,
                            stack:      [
                                {
                                    ul: [
                                        'Ayant décidé d’installer un équipement photovoltaïque/aérovoltaique sur le toit d’un bâtiment m’appartenant, je donne, par le présent acte, procuration à la société ALLAIRE DU TEMPS, pour effectuer en mon nom et pour mon compte, l’ensemble des démarches administratives afférentes à la mise en œuvre de ce projet. Soit de manière exhaustive :',
                                        {
                                            ul: [
                                                'La déclaration préalable de travaux et toutes dispositions utiles pour obtenir auprès de l’administration l’autorisation de réaliser l’installation.',
                                                'La déclaration de début d’activité personne physique, Cerfa N°11921*03 auprès du centre des impôts concerné.',
                                                'Le contrat de raccordement, l’autorisation de raccordement et le règlement du devis',
                                                'Le contrat d’achat et l’autorisation d’exploiter',
                                                'Procéder en son nom aux règlements financiers relatifs au raccordement',
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    [
                        'Fait pour valoir ce que de droit.',
                    ],
                    [
                        'A .............................................             le ..................................................',
                    ],
                    [
                        {
                            text:     'SIGNATURE :',
                            bold:     true,
                            fontSize: 9,
                            color:    '#4B4B4B',
                        },
                    ],
                ],
            },
            layout:   {
                ...this.getTableLayout(),
                paddingTop:    function ( i ) {
                    if ( i === 0 ) {
                        return 25;
                    }
                    return 5;
                },
                paddingBottom: function ( i ) {
                    if ( i === 8 ) {
                        return 25;
                    }
                    return 5;
                },
                paddingLeft:   function () {
                    return 15;
                },
                paddingRight:  function () {
                    return 15;
                },
            },
        };
    }

    private generateSubBody(): Content {
        return {
            margin:   [ 0, 3 ],
            fontSize: 10,
            table:    {
                body: [
                    [
                        {
                            text: 'Acceptation du mandat :',
                            bold: true,
                        },
                    ],
                    [
                        'Je soussigné,.........................................................................représentant de la société ALLAIRE DU TEMPS, déclare accepter le mandat ci-dessus.',
                    ],
                    [
                        'A .............................................             le ..................................................',
                    ],
                    [
                        {
                            text:     'SIGNATURE :',
                            bold:     true,
                            fontSize: 9,
                            color:    '#4B4B4B',
                        },
                    ],
                ],
            },
            layout:   {
                ...this.getTableLayout(),
                paddingTop:    function ( i ) {
                    if ( i === 0 ) {
                        return 15;
                    }
                    return 5;
                },
                paddingBottom: function ( i ) {
                    if ( i === 3 ) {
                        return 25;
                    }
                    return 5;
                },
                paddingLeft:   function () {
                    return 15;
                },
                paddingRight:  function () {
                    return 15;
                },
            },
        };
    }

    private generateBodyFooter(): Content {
        return [
            {
                margin:     [ 0, 10, 0, 0 ],
                style:      'text',
                alignment:  'center',
                lineHeight: 1.3,
                text:       'ALLAIRE DU TEMPS AND CO\n' +
                                '1 rue Jean Torlais – 17000 La Rochelle\n' +
                                'Tel : 05 16 85 02 64 – contact@allairedutemps.fr',
            },
        ];
    }

    private generateData(): Content {
        // On récup l'adresse
        const { address, zipCode, city } = getAddress( this._file );

        return {
            fontSize: 10,
            stack:    [
                {
                    text:             `${ this._file.beneficiary.firstName } ${ this._file.beneficiary.lastName }`,
                    absolutePosition: { x: 28, y: 242 },
                },
                {
                    text:             `${ address }, ${ city } ${ zipCode }`,
                    absolutePosition: { x: 28, y: 285 },
                },
                // {
                //     text:             '{{ INFO_LOCATION }}',
                //     absolutePosition: { x: 36, y: 548 },
                // },
                // {
                //     text:             '{{ INFO_DATE }}',
                //     absolutePosition: { x: 200, y: 548 },
                // },
            ],
        };
    }

    private getTableLayout(): CustomTableLayout {
        return {
            hLineWidth: function ( i, node ) {
                return ( i === 0 || i === node.table.body.length ) ? 1 : 0;
            },
            vLineWidth: function ( i, node ) {
                if ( node.table.widths === undefined ) {
                    return 0;
                }
                return ( i === 0 || i === node.table.widths.length ) ? 1 : 0;
            },
            hLineColor: function ( i, node ) {
                return ( i === 0 || i === node.table.body.length ) ? GREEN_CITY_HALL : 'black';
            },
            vLineColor: function ( i, node ) {
                if ( node.table.widths === undefined ) {
                    return 'black';
                }
                return ( i === 0 || i === node.table.widths.length ) ? GREEN_CITY_HALL : 'black';
            },
        };
    }
}
