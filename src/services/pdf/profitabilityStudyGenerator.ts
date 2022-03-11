import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
import { AllFile } from '@/types/v2/File/All';
import { DARK } from '@/services/pdf/pdfVariable';
import { getAddress } from '@/services/data/dataService';
import { PvAlgo } from '@/services/algorithm/PvAlgo';
import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';
import { Chart, ChartConfiguration } from 'chart.js';

export class ProfitabilityStudyGenerator extends PdfGenerator {
    private _file: AllFile;
    private _pvAlgo: PvAlgo;
    private _quotation: PvQuotation;

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
        console.log( 'FILE IN CONSTRUCTOR -->', file );
        this._file      = file;
        this.type       = PdfType.ProfitabilityStudy;
        this._quotation = ( file.quotation as PvQuotation );
        this._pvAlgo    = new PvAlgo( ( this._file.quotation as PvQuotation ), ( this._file.worksheet as PvWorkSheet ) );

        this.docDefinition = this._generateDocDefinition();

    }

    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._createTitle( 'Étude de rentabilité' ),
                this._customerInfo(),
                this._photovoltaicInfo(),
                this._benefitsOver25Years(),
                this._chartPage(),
            ],
            styles:  this._style,
        };
    }

    private _createTitle( value: string ): Content {
        return {
            style:  'title',
            table:  {
                widths: [ '100%' ],
                body:   [ [ value ] ],
            },
            layout: {
                hLineWidth:    function () {
                    return 2;
                },
                vLineWidth:    function () {
                    return 2;
                },
                hLineColor:    function () {
                    return DARK;
                },
                vLineColor:    function () {
                    return DARK;
                },
                paddingTop:    function () {
                    return 3;
                },
                paddingBottom: function () {
                    return 3;
                },
            },
        };
    }

    private _customerInfo(): Content {
        const { address, zipCode, city } = getAddress( this._file );
        return {
            stack: [
                {
                    text:      `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }`,
                    alignment: 'center',
                },
                {
                    margin:    [ 0, 5, 0, 0 ],
                    text:      `${ address } ${ zipCode } ${ city }`,
                    alignment: 'center',
                },
            ],
        };
    }

    private _photovoltaicInfo(): Content {
        return {
            margin:     [ 0, 15, 0, 0 ],
            style:      [ 'table' ],
            lineHeight: 1.5,
            table:      {
                body:   [
                    [
                        {
                            columns: [
                                {
                                    width: '33%',
                                    stack: [
                                        {
                                            text:      'Montant TTC Posé',
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                                {
                                    width: '33%',
                                    stack: [
                                        {
                                            text:      'Prime à l’autoconsommation',
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                                {
                                    width: '*',
                                    stack: [
                                        {
                                            text:      'Montant prime déduite',
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            columns: [
                                {
                                    width: '33%',
                                    stack: [
                                        {
                                            text:      this.formatPrice( this._pvAlgo.calclTotalTtcPerPanel() ),
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                                {
                                    width: '33%',
                                    stack: [
                                        {
                                            text:      this.formatPrice( this._quotation.selfConsumptionBonus ),
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                                {
                                    width: '*',
                                    stack: [
                                        {
                                            text:      this.formatPrice( this._pvAlgo.calcTotalTtcWithBonusDeducted() ),
                                            alignment: 'center',
                                            bold:      true,
                                            fontSize:  12,
                                        },
                                    ],
                                },
                            ],
                        },

                    ],
                ],
                widths: [ '100%' ],
            },
            layout:     {
                fillColor:   function ( rowIndex ) {
                    if ( rowIndex === 0 ) {
                        return '#009C99';
                    }
                },
                fillOpacity: function ( rowIndex ) {
                    if ( rowIndex === 0 ) {
                        return 0.50;
                    }
                },
            },
        };

    }

    private _benefitsOver25Years(): Content {
        const formattedBody: TableCell[][] = [];
        const data                         = this._pvAlgo.benefitsOver25Years();

        for ( const benefit of data ) {
            formattedBody.push( [
                                    {
                                        text:      benefit.year,
                                        alignment: 'center',
                                    },
                                    {
                                        text:      this.formatPrice( benefit.resaleToEdf ),
                                        alignment: 'center',
                                    },
                                    {
                                        text:      this.formatPrice( benefit.savingsOnInvoice ),
                                        alignment: 'center',
                                    },
                                    {
                                        text:      this.formatPrice( benefit.totalGains ),
                                        alignment: 'center',
                                    },
                                ] );
        }

        return {
            margin:    [ 0, 15, 0, 0 ],
            style:     [ 'table' ],
            pageBreak: 'after',
            table:     {
                body:   [
                    [
                        {
                            text:      this._quotation.selectedProducts[ 0 ].label,
                            alignment: 'center',
                            bold:      true,
                            colSpan:   4,
                        },
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text:      'GAINS PHOTOVOLTAÏQUES',
                            alignment: 'center',
                            bold:      true,
                            colSpan:   4,
                        },
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text:      'Années',
                            alignment: 'center',
                            bold:      true,
                        },
                        {
                            text:      'Revente auprès d’EDF',
                            alignment: 'center',
                            bold:      true,
                        },
                        {
                            text:      'Économies sur facture',
                            alignment: 'center',
                            bold:      true,
                        },
                        {
                            text:      'Années',
                            alignment: 'center',
                            bold:      true,
                        },
                    ],
                    ...formattedBody,
                    [
                        {
                            text:      'GAINS SUR 25 ANS',
                            alignment: 'center',
                            bold:      true,
                            fontSize:  16,
                            colSpan:   4,
                        },
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text:      this.formatPrice( this._pvAlgo.sumBenefits25Years() ),
                            alignment: 'center',
                            bold:      true,
                            fontSize:  25,
                            colSpan:   4,
                            color:     '#FFB301',
                        },
                        {},
                        {},
                        {},
                    ],

                ],
                widths: [ '*', '30%', '30%', '30%' ],
            },
            layout:    {
                fillColor:   function ( rowIndex, node, columnIndex ) {
                    if ( rowIndex === 0 ) {
                        return '#B9B9B9';
                    } else if ( rowIndex === 0 ) {
                        return '#FFFFFF';
                    } else {
                        if ( columnIndex === 1 ) {
                            return '#57AD57';
                        } else if ( columnIndex === 2 ) {
                            return '#009C99';
                        } else if ( columnIndex === 3 ) {
                            return '#003D74';
                        }
                    }
                },
                fillOpacity: function ( rowIndex ) {
                    if ( rowIndex === 0 ) {
                        return 0.35;
                    } else {
                        return 0.50;
                    }
                },
            },
        };

    }

    private _chartPage(): Content {

        const chart = Chart.getChart( 'my_chart' );
        if ( chart === undefined ) {
            console.log( 'Chart is undefined' );
            return '';
        }
        console.log( 'CHART -->', chart );
        // if ( this._chart === null ) {
        //     console.log( '%c CHART IS NULL', 'background: #fdd835; color: #000000' );
        //     return '';
        // }

        // return this._createTitle('TEST');

        return {
            stack: [
                {
                    margin: [ 0, 0, 0, 35 ],
                    table:  {
                        body:   [
                            [
                                {
                                    text:      'Gain mensuel (moyenne sur 25 ans)',
                                    alignment: 'center',
                                    bold:      true,
                                },
                                {
                                    text:      'Rendement financier (moyenne sur 25 ans)',
                                    alignment: 'center',
                                    bold:      true,
                                },
                            ],
                            [
                                {
                                    text:      this.formatPrice( this._pvAlgo.monthlyBenefitsAverage25Year() ),
                                    alignment: 'center',
                                    bold:      true,
                                },
                                {
                                    text:      this.formatPrice( this._pvAlgo.financialReturnAverage25Years() ),
                                    alignment: 'center',
                                    bold:      true,
                                },
                            ],

                        ],
                        widths: [ '50%', '*' ],
                    },
                    layout: {
                        fillColor:   function ( rowIndex ) {
                            if ( rowIndex === 0 ) {
                                return '#003D74';
                            }
                        },
                        fillOpacity: function () {
                            return 0.50;
                        },
                    },
                },
                {
                    image: chart.toBase64Image(),
                    width: 550,
                },
            ],
        };
    }

    public createChart() {
        console.log( '%c ON CREATE CHART', 'background: #fdd835; color: #000000' );

        const data                           = this._pvAlgo.priceEvolutionOver25Years();
        const labels: string[]               = [];
        const datasetsEdf: number[]          = [];
        const datasetsPhotovoltaic: number[] = [];

        for ( const item of data ) {
            labels.push( item.year.toString() );
            datasetsEdf.push( +item.kwhEdf );
            datasetsPhotovoltaic.push( +item.kwhPhotovoltaic );
        }

        const chartData = {
            labels:   labels,
            datasets: [
                {
                    label:           'Kwh EDF',
                    backgroundColor: '#003D74',
                    borderColor:     '#003D74',
                    data:            datasetsEdf,
                    pointRadius:     0,
                    borderWidth:     15,
                    tension:         0.4,
                },
                {
                    label:           'KWh PV',
                    backgroundColor: '#57AD57',
                    borderColor:     '#57AD57',
                    data:            datasetsPhotovoltaic,
                    pointRadius:     0,
                    borderWidth:     15,
                    tension:         0.4,
                },
            ],
        };

        const config: ChartConfiguration = {
            type:    'line',
            data:    chartData,
            options: {
                responsive:  true,
                interaction: {
                    intersect: false,
                },
                scales:      {
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                    y: {
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        };

        new Chart(
            ( document.getElementById( 'my_chart' ) as HTMLCanvasElement ),
            config,
        );

        const $chart = document.getElementById( 'my_chart' );
        if ( $chart !== null ) {
            $chart.style.display = 'none';
        }
    }
}
