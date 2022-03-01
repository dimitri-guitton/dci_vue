import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { CADRE_CONTRIBUTION_CHECKBOX, DARK, EA_SIGNATURE, LOGO_CEE, LOGO_EDF, ORANGE, TEL_FRANCE_RENOV } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { PvFile } from '@/types/v2/File/Pv/PvFile';

export class ContributionFrameworkGenerator extends PdfGenerator {
    private _file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile | PbFile | PvFile;

    private _style: StyleDictionary = {
        header:      {
            fontSize: 14,
            bold:     true,
        },
        tableHeader: {
            fontSize:  9,
            alignment: 'center',
        },
    };


    constructor( file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile | PbFile | PvFile ) {
        super();
        this._file = file;
        this.type  = PdfType.ContributionFramework;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            pageMargins: [ 30, 15, 30, 15 ],
            content:     [
                this._generateHeader,
                this._generateSubHeader(),
                this._generateTable(),
                this._generateSubTable,
                this._generateFooter(),
            ],
            styles:      this._style,
        };
    }

    private _generateHeader: Content = {
        margin:     [ 0, 0, 0, 5 ],
        lineHeight: 1.5,
        columns:    [
            {
                margin: [ 0, 15, 0, 0 ],
                width:  '25%',
                stack:  [
                    {
                        image: LOGO_CEE,
                        width: 140,
                    },
                ],
            },
            {
                width:      '*',
                lineHeight: 1,
                margin:     [ 45, 0 ],
                stack:      [
                    {
                        text:      'CADRE CONTRIBUTION',
                        alignment: 'center',
                        bold:      true,
                        fontSize:  16,
                    },
                    {
                        margin:    [ 0, 5, 0, 0 ],
                        text:      'A conserver impérativement avec votre devis signé et votre facture',
                        alignment: 'center',
                        fontSize:  8,
                        bold:      true,
                        color:     ORANGE,
                    },
                    {
                        margin: [ 30, 5 ],
                        stack:  [
                            {
                                image:  'data:image/png;base64,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',
                                width:  120,
                                height: 65,
                            },
                        ],
                    },
                ],
            },
            {
                margin: [ 20, 15, 0, 0 ],
                width:  '25%',
                stack:  [
                    {
                        image: LOGO_EDF,
                        width: 105,
                    },
                ],
            },
        ],
    };

    private _generateSubHeader(): Content {
        return {
            style:      'text',
            lineHeight: 1.3,
            stack:      [
                {
                    text: [
                        'Le dispositif national des certificats d\'économies d\'énergie (CEE) mis en place par le Ministère en charge de l\'énergie impose à l\'ensemble des fournisseurs d\'énergie (électricité, gaz, fioul domestique, chaleur ou froid, carburants automobiles), de réaliser des économies et de promouvoir les comportements vertueux auprès des consommateurs d\'énergie.',
                        '\n',
                        'Dans le cadre de son partenariat avec',
                        {
                            text: 'EDF ',
                            bold: true,
                        },
                        '(SIREN 552 081 317), la société ',
                        '..............................................................................................',
                        ' s\'engage à vous apporter :',
                        '\n',
                    ],
                },
                {
                    text:             'sarl eco atlantique',
                    absolutePosition: { x: 330, y: 175 },

                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX,
                    width:            12,
                    absolutePosition: { x: 30, y: 210 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `une prime d'un montant de ................................. euros`,
                            bold: true,
                        },
                    ],
                },
                {
                    text:             this._file.quotation.ceeBonus.toString(),
                    absolutePosition: { x: 160, y: 206 },

                },
            ]
            ,
        };
    }

    private _generateTable(): Content {

        let address = this._file.housing.address;
        let zipCode = this._file.housing.zipCode;
        let city    = this._file.housing.city;

        if ( this._file.housing.isAddressBenef ) {
            address = this._file.beneficiary.address;
            zipCode = this._file.beneficiary.zipCode;
            city    = this._file.beneficiary.city;
        }

        const formatedInfo = `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }, ${ address }, ${ city } ${ zipCode }`;

        let line1;
        let line2 = '';

        if ( formatedInfo.length > 70 ) {
            line1 = `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }`;
            line2 = `${ address }, ${ city } ${ zipCode }`;
        } else {
            line1 = formatedInfo;
        }
        let cee  = '';
        let work = '';
        switch ( this._file.type ) {
            case FILE_COMBLE:
                cee  = 'EN-101';
                work = 'Isolation des combles perdues';
                break;
            case FILE_SOL:
                cee  = 'EN-103';
                work = 'Isolation d’un plancher bas';
                break;
            case FILE_PAC_RO:
                cee  = 'TH-104';
                work = 'Installation d’un pompe à chaleur air / eau';
                break;
            case FILE_PAC_RR:
                cee  = 'TH-129';
                work = 'Installation d’un pompe à chaleur air / air/ eau';
                break;
            case FILE_PG:
                cee  = 'TH-112';
                work = 'Installation d’un appareil indépendant de chauffage au bois';
                break;
            case FILE_CET:
                cee  = 'TH-148';
                work = 'Installation d’un chauffe eau thermodynamique à accumulation';
                break;
        }

        return {
            margin: [ 0, 5 ],
            style:  [ 'text' ],
            stack:  [
                {
                    text: 'Dans le cadre des travaux suivant (1 ligne par opération) :',
                },
                {
                    table:  {
                        widths: [ '60%', '15%', '*' ],
                        body:   [
                            [
                                {
                                    text:  'Nature des travaux',
                                    style: 'tableHeader',
                                },
                                {
                                    text:  'Fiche CEE',
                                    style: 'tableHeader',
                                },
                                {
                                    text:  'Conditions à respecter',
                                    style: 'tableHeader',
                                },
                            ],
                            [
                                work,
                                `BAR-${ cee }`,
                                ' ',
                            ],
                            [
                                ' ',
                                ' ',
                                ' ',
                            ],
                            [
                                ' ',
                                ' ',
                                ' ',
                            ],
                            [
                                ' ',
                                ' ',
                                ' ',
                            ],
                            [
                                ' ',
                                ' ',
                                ' ',
                            ],
                            [
                                ' ',
                                ' ',
                                ' ',
                            ],
                        ],
                    },
                    layout: {
                        hLineWidth:    function () {
                            return 0.5;
                        },
                        vLineWidth:    function () {
                            return 0.5;
                        },
                        hLineColor:    function () {
                            return DARK;
                        },
                        vLineColor:    function () {
                            return DARK;
                        },
                        paddingTop:    function ( i ) {
                            if ( i === 0 ) {
                                return 5;
                            }
                            return 7;
                        },
                        paddingBottom: function ( i ) {
                            if ( i !== 0 ) {
                                return 7;
                            }
                            return 2;
                        },
                        paddingLeft:   function () {
                            return 5;
                        },
                    },
                },
                {
                    margin: [ 0, 10, 0, 0 ],
                    text:   [
                        'Au bénéfice de : (Nom, Prénom et ',
                        {
                            text: ' Adresse du bénéficiaire',
                            bold: true,
                        },
                        ')',
                        ' ...........................................................................................................................',
                        '\n',
                        ' .................................................................................................................................................................................................................................',
                    ],
                },
                {
                    // 70 CHARACTERS
                    text:             line1,
                    absolutePosition: { x: 275, y: 416 },
                    style:            'xsText',
                },
                {
                    // 150 CHARACTERS
                    text:             line2,
                    absolutePosition: { x: 30, y: 428 },
                    style:            'xsText',
                },
            ],
        };
    }

    private _generateSubTable: Content = {
        style:  [ 'text' ],
        margin: [ 0, 10 ],
        stack:  [
            {
                text: 'Le montant de cette prime ne pourra être révisé à la baisse qu’en cas de modification du volume de Certificats d’Economies d’Energie attaché à l’opération ou aux opérations d’économies d’énergie ou de la situation de précarité énergétique et ce, de manière proportionnelle. Dans le cadre de la réglementation un contrôle qualité des travaux sur site ou par contact pourra être demandé. Un refus de ce contrôle sur site ou par contact via EDF ou un prestataire d’EDF conduira au refus de cette prime par EDF',
            },
            {
                margin: [ 0, 10 ],
                text:   'Date de cette proposition : ......................... [à dater — le présent document doit être signé au plus tard quatorze jours après la date d\'engagement de l\'opération, et en tout état de cause avant la date de début des travaux.]',
            },
            {
                margin: [ 0, 10 ],
                text:   'Signature [à signer de façon manuscrite ou générique par le partenaire] :',
            },
            {
                image:            EA_SIGNATURE,
                width:            100,
                absolutePosition: { x: 320, y: 540 },
            },
        ],
    };

    private _generateFooter(): Content {
        return {
            margin: [ 0, 15 ],
            style:  [ 'xsText' ],
            stack:  [
                {
                    text: '/!\\ Faites réaliser plusieurs devis afin de prendre une décision éclairée. Attention, seules les propositions remises avant l\'acceptation du devis ou du bon de commande sont valables, et vous ne pouvez pas cumuler plusieurs offres CEE différentes pour la même opération.',
                },
                {
                    margin: [ 0, 5 ],
                    text:   '/!\\ Seul le professionnel est responsable de la conformité des travaux que vous lui confiez. Vérifiez ses qualifications techniques et l\'éligibilité des produits proposés avant d\'engager vos travaux. Un contrôle des travaux effectués dans votre logement pourra être réalisé sur demande de EDF ou des autorités publiques.',
                },
                {
                    margin: [ 0, 5, 0, 0 ],
                    table:  {
                        widths: [ '100%' ],
                        body:   [
                            [
                                {
                                    margin:     [ 0, 3, 0, 0 ],
                                    text:       'Où se renseigner pour bénéficier de cette offre ?',
                                    decoration: 'underline',
                                },
                            ],
                            [
                                {
                                    margin: [ 70, -3, 0, 0 ],
                                    text:   [
                                        'Numéro de téléphone du professionnel : ',
                                        {
                                            text: '05.46.52.95.94',
                                            bold: true,
                                        },
                                    ],
                                },
                            ],
                            [
                                {
                                    margin: [ 70, -2, 0, 0 ],
                                    text:   [
                                        'Site du professionnel : ',
                                        {
                                            text: 'https://ecoatlantique.fr',
                                            bold: true,
                                        },
                                    ],
                                },
                            ],
                            [
                                {
                                    margin:     [ 0, 0 ],
                                    text:       'Où s\'informer sur les aides pour les travaux d\'économies d\'énergie ?',
                                    decoration: 'underline',
                                },
                            ],
                            [
                                {
                                    margin: [ 140, 0 ],
                                    text:   'Site de réseau FAIRE : https://www.faire.gouv.fr',
                                },
                            ],
                            [
                                {
                                    margin: [ 140, 8, 0, 0 ],
                                    text:   'Tél :',
                                },
                            ],
                            [
                                {
                                    text:       'En cas de litige avec le porteur de l\'offre ou son partenaire, vous pouvez faire appel gratuiteent au médiateur de la consommation (6 de l\'article L.611-1 du code de la consommation)',
                                    decoration: 'underline',
                                },
                            ],
                            [
                                {
                                    margin: [ 140, 0 ],
                                    text:   'Site du Médiateur EDF : https://mediateur.edf.fr',
                                },
                            ],
                            [
                                {
                                    margin: [ 140, 0, 0, 0 ],
                                    stack:  [
                                        {
                                            text: 'Adresse: Médiateur du groupe EDF',
                                        },
                                        {
                                            margin: [ 33, 0, 0, 0 ],
                                            text:   'TSA 50.026',
                                        },
                                        {
                                            margin: [ 33, 0, 0, 0 ],
                                            text:   '75804 Paris cedex 08',

                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                    layout: this._rowLayout,
                },
                {
                    image:            TEL_FRANCE_RENOV,
                    width:            120,
                    absolutePosition: { x: 190, y: 720 },
                },
            ],
        };
    }

    private _rowLayout = {
        hLineWidth: function ( i, node ) {
            return ( i === 0 || i === node.table.body.length ) ? 1 : 0;
        },
        vLineWidth: function ( i, node ) {
            return ( i === 0 || i === node.table.widths.length ) ? 1 : 0;
        },
        hLineColor: function ( i, node ) {
            return ( i === 0 || i === node.table.body.length ) ? DARK : 'white';
        },
        vLineColor: function ( i, node ) {
            return ( i === 0 || i === node.table.widths.length ) ? DARK : 'white';
        },
    };
}
