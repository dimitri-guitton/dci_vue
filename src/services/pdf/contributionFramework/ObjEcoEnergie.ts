import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import {
    CADRE_CONTRIBUTION_CHECKBOX,
    CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
    DARK,
    EA_SIGNATURE,
    FOOTER_CONTRIBUTION_OBJ_ECO,
    LOGO_CEE,
    LOGO_ECO,
    LOGO_OBJ_ECO_ENERGIE,
} from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PB, FILE_PG, FILE_SOL } from '@/services/constantService';
import { AllFile } from '@/types/v2/File/All';

export class ObjEcoEnergie extends PdfGenerator {
    private _file: AllFile;

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


    constructor( file: AllFile ) {
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
                        margin: [ 30, 5 ],
                        stack:  [
                            {
                                image:  LOGO_OBJ_ECO_ENERGIE,
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
                        image: LOGO_ECO,
                        width: 75,
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
                            text: ' Objectif EcoEnergie ',
                            bold: true,
                        },
                        ', la société ',
                        '..............................................................................................',
                        ' s\'engage à vous apporter :',
                        '\n',
                    ],
                },
                {
                    text:             'SARL ECO ATLANTIQUE',
                    absolutePosition: { x: 330, y: 151 },

                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX,
                    width:            12,
                    absolutePosition: { x: 30, y: 187 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `une prime d'un montant de .............. euros;`,
                            bold: true,
                        },
                    ],
                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
                    width:            12,
                    absolutePosition: { x: 30, y: 206 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `un bon d’achat pour des produits de consommation courante d’un montant de ....... euros;`,
                        },
                    ],
                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
                    width:            12,
                    absolutePosition: { x: 30, y: 225 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `un prêt bonifié d’un montant de ....... euros proposé par ....... au taux effectif global (TEG) de ....... % (valeur de la bonification = ...);`,
                        },
                    ],
                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
                    width:            12,
                    absolutePosition: { x: 30, y: 244 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `un audit ou conseil personnalisé, remis sous forme écrite au bénéficiaire (valeur = .......);`,
                        },
                    ],
                },
                {
                    image:            CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
                    width:            12,
                    absolutePosition: { x: 30, y: 263 },
                },
                {
                    margin: [ 15, 5, 0, 0 ],
                    text:   [
                        {
                            text: `un produit ou service offert : ....... d’une valeur de ....... €;`,
                        },
                    ],
                },
                {
                    text:             this._file.quotation.ceeBonus.toString(),
                    absolutePosition: { x: 159, y: 185 },

                },
            ]
            ,
        };
    }

    private _generateTable(): Content {

        // On récup l'adresse
        // L'adresse du client est l'adresse du bénéficiaire même si l'adresse des travaux est différente de celle du bénéficiaire.
        const address = this._file.beneficiary.address;
        const zipCode = this._file.beneficiary.zipCode;
        const city    = this._file.beneficiary.city;

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
                work = 'Installation d’une pompe à chaleur air / eau';
                break;
            case FILE_PAC_RR:
                cee  = 'TH-129';
                work = 'Installation d’une pompe à chaleur air / air';
                break;
            case FILE_PG:
            case FILE_PB:
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
                                'Installateur qualifié «RGE»\nCritères d\'éligibilités de la fiche d’opération standardisée ',
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
                    absolutePosition: { x: 275, y: 363 },
                    style:            'xsText',
                },
                {
                    // 150 CHARACTERS
                    text:             line2,
                    absolutePosition: { x: 30, y: 375 },
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
                margin: [ 0, 10 ],
                text:   'Date de cette proposition :',
            },
            {
                margin: [ 0, 10 ],
                text:   'Signature :',
            },
            {
                image:            EA_SIGNATURE,
                width:            100,
                absolutePosition: { x: 80, y: 437 },
            },
        ],
    };

    private _generateFooter(): Content {
        return {
            margin: [ 0, 100, 0, 0 ],
            style:  [ 'xsText' ],
            stack:  [
                {
                    text: '/!\\ Faites réaliser plusieurs devis afin de prendre une décision éclairée. Attention, seules les propositions remises avant l\'acceptation du devis ou du bon de commande sont valables, et vous ne pouvez pas cumuler plusieurs offres CEE différentes pour la même opération.',
                },
                {
                    margin: [ 0, 5 ],
                    text:   '/!\\ Seul le professionnel est responsable de la conformité des travaux que vous lui confiez. Vérifiez ses qualifications techniques et l\'éligibilité des produits proposés avant d\'engager vos travaux. Un contrôle des travaux effectués dans votre logement pourra être réalisé sur demande d\'Objectif Eco Energie ou des autorités publiques.',
                },
                {
                    margin: [ 0, 5, 0, 0 ],
                    image:  FOOTER_CONTRIBUTION_OBJ_ECO,
                    width:  510,
                },
            ],
        };
    }
}
