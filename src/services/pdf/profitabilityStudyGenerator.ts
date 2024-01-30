import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, ContentText, StyleDictionary, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';
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
    private _chart: Chart | null;

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
        this._file      = file;
        this.type       = PdfType.ProfitabilityStudy;
        this._quotation = ( file.quotation as PvQuotation );
        this._pvAlgo    = new PvAlgo( ( this._file.quotation as PvQuotation ), ( this._file.worksheet as PvWorkSheet ), file.energyZone );
        this._chart     = null;

        this.docDefinition = this._generateDocDefinition();
    }

    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._createTitle( 'Estimation de prodution' ),
                this._customerInfo(),
                this._photovoltaicInfo(),
                this._benefitsOver25Years(),
                this._chartPage(),
                this._mention,
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
                                            text:      this.formatPrice( this._quotation.totalTtc ),
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
                                            text:      this.formatPrice( this._quotation.totalTtc - this._quotation.selfConsumptionBonus ),
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

        if ( this._quotation.selectedProducts.length === 0 ) {
            return '';
        }

        const formattedBody: TableCell[][] = [];
        const data                         = this._pvAlgo.benefitsOver25Years();

        let index = 1;
        for ( const benefit of data ) {

            let resaleToEdf = this.formatPrice( benefit.resaleToEdf );

            // Si === 0 pas de valeur pour EDF
            if ( benefit.resaleToEdf === 0 ) {
                resaleToEdf = '';
            }
            formattedBody.push( [
                                    {
                                        text:      index,
                                        alignment: 'center',
                                    },
                                    {
                                        text:      resaleToEdf,
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

            index++;
        }

        const pv         = this._quotation.selectedProducts[ 0 ];
        const power      = pv.power ?? 0;
        const totalPower = pv.quantity * power;
        const title      = `${ pv.label } de ${ pv.quantity } x ${ power }Wc = ${ totalPower }Wc`;

        const worksheet = ( this._file.worksheet as PvWorkSheet );

        const installationPower = this._pvAlgo.getInstallationProductionV2( 1 );

        return {
            margin:    [ 0, 15, 0, 0 ],
            style:     [ 'table' ],
            pageBreak: 'after',
            table:     {
                body: [
                    [
                        {
                            text:      title,
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
                            text: `Orientation : ${ worksheet.orientation } | Production : ${ installationPower.toFixed( 2 ) } kwh`,
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
                            text:      'Gains Totaux',
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
            return '';
        }
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
                                    text:      `${ this._pvAlgo.financialReturnAverage25Years().toFixed( 2 ) }%`,
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

        this._chart = new Chart(
            ( document.getElementById( 'my_chart' ) as HTMLCanvasElement ),
            config,
        );
    }

    public updateChart( quoation: PvQuotation, worksheet: PvWorkSheet, energyZone: string ) {

        this._pvAlgo = new PvAlgo( ( quoation as PvQuotation ), ( worksheet as PvWorkSheet ), energyZone );

        if ( this._chart === null ) {
            return;
        }

        this._chart.destroy();

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

        this._chart = new Chart(
            ( document.getElementById( 'my_chart' ) as HTMLCanvasElement ),
            config,
        );
    }

    private _mention: ContentText = {
        margin:   [ 0, 10 ],
        text:     'Les hypothèses figurant dans le tableau sont fournies à titre purement indicatif et ne sauraient présenter aucune valeur contractuelle. Ces hypothèses ont été simulées en fonction des informations disponibles à la date où elles ont été établies',
        fontSize: 8,
    };
}
