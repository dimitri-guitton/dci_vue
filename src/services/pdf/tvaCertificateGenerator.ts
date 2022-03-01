import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { DARK, LOGO_CERFA_TVA, LOGO_MINISTERE_ECONOMIE, LOGO_REP_FRANCE, TVA_PAGE_2, TVA_PAGE_3 } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { FILE_PAC_RO } from '@/services/constantService';
import { PbFile } from '@/types/v2/File/Pb/PbFile';

export class TvaCertificateGenerator extends PdfGenerator {
    private _file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile | PbFile;

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


    constructor( file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile | PbFile ) {
        super();
        this._file = file;
        this.type  = PdfType.Tva;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._generateHeader,
                {
                    text:      'ATTESTATION SIMPLIFIEE',
                    bold:      true,
                    fontSize:  12,
                    alignment: 'center',
                },
                this._generateRow1(),
                this._generateRow2( this._file.housing.type !== 'appartement', this._file.housing.isRentedHouse ),
                this._generateRow3( this._file.type === FILE_PAC_RO ),
                this._generateRow4(),
                this._generateRow5(),
                this._generateSignature,
                this._generateFooter,
                this._addPages,
            ],
            styles:  this._style,
        };
    }

    private _generateHeader: Content = {
        margin:     [ 0, 0, 0, 5 ],
        lineHeight: 1.5,
        columns:    [
            {
                width: '20%',
                stack: [
                    {
                        image: LOGO_REP_FRANCE,
                        width: 75,
                    },
                ],
            },
            {
                width:  '*',
                margin: [ 0, 15, 0, 0 ],
                stack:  [
                    {
                        text:      'DIRECTION GÉNÉRALE DES FINANCES PUBLIQUES',
                        alignment: 'center',
                        fontSize:  8,
                    },
                ],
            },
            {
                width: '20%',
                stack: [
                    {
                        image: LOGO_CERFA_TVA,
                        width: 50,
                    },
                ],
            },
        ],
    };

    private _generateRow1(): Content {
        return {
            style:  [ 'table' ],
            margin: [ 0, 3 ],
            table:  {
                body: [
                    [
                        {
                            text:    '1 IDENTITÉ DU CLIENT OU DE SON REPRÉSENTANT :',
                            bold:    true,
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    'Je soussigné(e) :',
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        `Nom : ${ this._file.beneficiary.lastName }`,
                        `Prénom : ${ this._file.beneficiary.firstName }`,
                    ],
                    [
                        `Adresse : ${ this._file.housing.address }`,
                        `Code postal : ${ this._file.housing.zipCode } Commune : ${ this._file.housing.city }`,
                    ],
                ],
                widths: [ '50%', '*' ],
            },
            layout: {
                ...this._rowLayout,
            },
        };

    }

    private _generateRow2( isHouse, isRentedHouse ): Content {
        return {
            style:  [ 'table' ],
            margin: [ 0, 3 ],
            table:  {
                body: [
                    [
                        {
                            text:    '2 NATURE DES LOCAUX',
                            bold:    true,
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text: 'J’atteste que les travaux à réaliser portent sur un immeuble achevé depuis plus de deux ans à la date de commencement des travaux et affecté à l’habitation à l’issue de ces travaux :',
                        },
                        {},
                    ],
                    [
                        {
                            colSpan: 2,
                            columns: [
                                {
                                    width: '33%',
                                    text:  [
                                        this.getCheckBox( isHouse ),
                                        ' maison ou immeuble individuel',
                                    ],
                                },
                                {
                                    width: '33%',
                                    text:  [
                                        this.getCheckBox(),
                                        ' immeuble collectif',
                                    ],
                                },
                                {
                                    width: '33%',
                                    text:  [
                                        this.getCheckBox( !isHouse ),
                                        ' appartement individuel',
                                    ],
                                },
                            ],
                        },
                        {},
                    ],
                    [
                        {
                            text:    [
                                this.getCheckBox(),
                                ' autre (précisez la nature du local à usage d’habitation) ...................................................................',
                            ],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    'Les travaux sont réalisés dans :',
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    [
                                this.getCheckBox( true ),
                                ' un local affecté exclusivement ou principalement à l’habitation',
                            ],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    [
                                this.getCheckBox(),
                                ' des pièces affectées exclusivement à l’habitation situées dans un local affecté pour moins de 50 % à cet usage',
                            ],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    [
                                this.getCheckBox(),
                                ' des parties communes de locaux affectés exclusivement ou principalement à l’habitation dans une proportion de (...................) millièmes de l’immeuble',
                            ],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    [
                                this.getCheckBox(),
                                ' un local antérieurement affecté à un usage autre que d’habitation et transformé à cet usage',
                            ],
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    'Adresse2 : ...............................................................  Commune : ........................................................  Code postal : .........',
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            colSpan: 2,
                            columns: [
                                {
                                    width: '20%',
                                    text:  [
                                        'dont je suis : ',
                                        this.getCheckBox( !isRentedHouse ),
                                        ' propriétaire',
                                    ],
                                },
                                {
                                    width: '15%',
                                    text:  [
                                        this.getCheckBox( isRentedHouse ),
                                        ' locataire',
                                    ],
                                },
                                {
                                    width: '70%',
                                    text:  [
                                        this.getCheckBox(),
                                        ' autre (précisez votre qualité) : ............................................',
                                    ],
                                },
                            ],
                        },
                        {},
                    ],

                ],
                widths: [ '50%', '*' ],
            },
            layout: {
                ...this._rowLayout,
            },
        };

    }

    private _generateRow3( isPacRo ): Content {
        return {
            style:  [ 'table' ],
            margin: [ 0, 3 ],
            table:  {
                widths: [ '100%' ],
                body:   [
                    [
                        {
                            text: '3 NATURE DES TRAVAUX',
                            bold: true,
                        },
                    ],
                    [
                        {
                            text: [
                                'J’atteste que ',
                                {
                                    text:       'sur la période de deux ans précédant ou suivant la réalisation des travaux décrits dans la présente attestation,',
                                    decoration: 'underline',
                                },
                                ' les travaux :',
                            ],
                        },
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( true ),
                                ' n’affectent ni les fondations, ni les éléments, hors fondations, déterminant la résistance et la rigidité de l’ouvrage, ni la consistance des façades (hors ravalement).',
                            ],
                        },
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( true ),
                                ' n’affectent pas plus de cinq des six éléments de second œuvre suivants :',
                            ],
                        },
                    ],
                    [
                        {
                            bold: true,
                            text: [
                                'Cochez les cases correspondant aux éléments affectés : ',
                                this.getCheckBox(),
                                ' planchers qui ne déterminent pas la résistance ou la rigidité de l’ouvrage ',
                                this.getCheckBox(),
                                ' huisseries extérieures ',
                                this.getCheckBox(),
                                ' cloisons intérieures ',
                                this.getCheckBox(),
                                ' installations sanitaires et de plomberie ',
                                this.getCheckBox(),
                                ' installations électriques ',
                                this.getCheckBox( true ),
                                ' système de chauffage (pour les immeubles situés en métropole) ',
                            ],
                        },
                    ],
                    [
                        'NB : tous autres travaux sont sans incidence sur le bénéfice du taux réduit.',
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( true ),
                                ' n’entraînent pas une augmentation de la surface de plancher de la construction existante supérieure à 10 %.',
                            ],
                        },
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( true ),
                                ' ne consistent pas en une surélévation ou une addition de construction.',
                            ],
                        },
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( true ),
                                ' J’atteste que les travaux visent à améliorer la qualité énergétique du logement et portent sur la fourniture, la pose, l’installation ou l’entretien des matériaux, appareils et équipements dont la liste figure dans la notice (1 de l’article 200 quater du code général des impôts – CGI) et respectent les caractéristiques techniques et les critères de performances minimales fixés par un arrêté du ministre du budget (article 18 bis de l’annexe IV au CGI).',
                            ],
                        },
                    ],
                    [
                        {
                            text: [
                                this.getCheckBox( isPacRo ),
                                ' J’atteste que les travaux ont la nature de travaux induits indissociablement liés à des travaux d’amélioration de la qualité énergétique soumis au taux de TVA de 5,5 %.',
                            ],
                        },
                    ],

                ],
            },
            layout: {
                ...this._rowLayout,
            },
        };

    }

    private _generateRow4(): Content {
        return {
            style:  [ 'table' ],
            margin: [ 0, 3 ],
            table:  {
                widths: [ '100%' ],
                body:   [
                    [
                        {
                            text: '4 CONSERVATION DE L’ATTESTATION ET DES PIÈCES JUSTIFICATIVES',
                            bold: true,
                        },
                    ],
                    [
                        'Je conserve une copie de cette attestation ainsi que de toutes les factures ou notes émises par les entreprises prestataires jusqu’au 31 décembre de la cinquième année suivant la réalisation des travaux et m’engage à en produire une copie à l’administration fiscale sur sa demande.',
                    ],
                ],
            },
            layout: {
                ...this._rowLayout,
            },
        };
    }

    private _generateRow5(): Content {
        return {
            style:  [ 'table' ],
            margin: [ 0, 3 ],
            table:  {
                widths: [ '100%' ],
                body:   [
                    [
                        'Si les mentions portées sur l’attestation s’avèrent inexactes de votre fait et ont eu pour conséquence l’application erronée du taux réduit de la TVA, vous êtes solidairement tenu au paiement du complément de taxe résultant de la différence entre le montant de la taxe due (TVA au taux de 20 % ou 10 %) et le montant de la TVA effectivement payé au taux de :\n' +
                        '-      10 % pour les travaux d’amélioration, de transformation, d’aménagement et d’entretien portant sur des locaux à usage\n' +
                        'd’habitation achevés depuis plus de 2 ans ;\n' +
                        '-      5,5 % pour les travaux d’amélioration de la qualité énergétique des locaux à usage d’habitation achevés depuis plus de 2 ans\n' +
                        'ainsi que sur les travaux induits qui leur sont indissociablement liés.',
                    ],
                ],
            },
            layout: {
                ...this._rowLayout,
                hLineWidth: function () {
                    return 4;
                },
                vLineWidth: function () {
                    return 4;
                },
            },
        };

    }

    private _generateSignature: Content = {
        style:     'xsText',
        alignment: 'center',
        margin:    [ 0, 15, 0, 0 ],
        stack:     [
            {
                text: 'Fait à................................, le...................',
            },
            {
                text: 'Signature du client ou de son représentant :',
            },
        ],
    };

    private _generateFooter: Content = {
        style:  'xxsText',
        margin: [ 0, 80, 0, 0 ],
        stack:  [
            {
                text: '1 Pour remplir cette attestation, cochez les cases correspondant à votre situation et complétez les rubriques en pointillés. Vous pouvez vous aider de la notice explicative.',
            },
            {
                text: '2 Si différente de l’adresse indiquée dans le cadre 1',
            },
            {
                image:            LOGO_MINISTERE_ECONOMIE,
                width:            150,
                absolutePosition: { x: 220, y: 790 },
            },
        ],
    };

    private _addPages: Content[] = [
        {
            margin:    [ 0, 0, 0, 0 ],
            image:     TVA_PAGE_2,
            fit:       [ 830, 830 ],
            pageBreak: 'after',
        },
        {
            margin: [ 0, 0, 0, 0 ],
            image:  TVA_PAGE_3,
            fit:    [ 830, 830 ],
        },
    ];

    private _rowLayout = {
        hLineWidth: function ( i, node ) {
            return ( i === 0 || i === node.table.body.length ) ? 2 : 0;
        },
        vLineWidth: function ( i, node ) {
            return ( i === 0 || i === node.table.widths.length ) ? 2 : 0;
        },
        hLineColor: function ( i, node ) {
            return ( i === 0 || i === node.table.body.length ) ? DARK : 'white';
        },
        vLineColor: function ( i, node ) {
            return ( i === 0 || i === node.table.widths.length ) ? DARK : 'white';
        },
    };
}
