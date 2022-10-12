import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import {
    CADRE_CONTRIBUTION_CHECKBOX,
    CADRE_CONTRIBUTION_CHECKBOX_EMPTY,
    DARK,
    EA_SIGNATURE,
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
                        width: 140,
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
                    absolutePosition: { x: 275, y: 341 },
                    style:            'xsText',
                },
                {
                    // 150 CHARACTERS
                    text:             line2,
                    absolutePosition: { x: 30, y: 353 },
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
                absolutePosition: { x: 80, y: 415 },
            },
        ],
    };

    private _generateFooter(): Content {
        return {
            margin: [ 0, 125, 0, 0 ],
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
                    table:  {
                        widths: [ '100%' ],
                        body:   [
                            [
                                {
                                    margin:     [ 0, 3, 0, 0 ],
                                    text:       'Où se renseigner pour bénéficier de cette offre ?',
                                    decoration: 'underline',
                                    alignment:  'center',
                                },
                            ],
                            [
                                {
                                    margin:    [ 0, -3, 0, 0 ],
                                    text:      [
                                        'OBJECTIF ECOENERGIE - 3 Avenue de la Résistance - BP 19 - 19201 Ussel cedex',
                                    ],
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    margin:    [ 0, -2, 0, 0 ],
                                    text:      [
                                        'https://primalia.fr/ - 05 55 46 25 79',
                                    ],
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    margin:     [ 0, 0 ],
                                    text:       'Où s\'informer sur les aides pour les travaux d\'économies d\'énergie ?',
                                    decoration: 'underline',
                                    alignment:  'center',
                                },
                            ],
                            [
                                {
                                    margin:    [ 0, 0 ],
                                    text:      'Site de réseau FAIRE : https://www.faire.gouv.fr',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    margin:    [ 0, 0, 0, 0 ],
                                    text:      'Tél :',
                                    alignment: 'center',
                                },
                            ],
                            [
                                {
                                    text:       'En cas de litige avec le porteur de l\'offre ou son partenaire, vous pouvez faire appel gratuiteent au médiateur de la consommation (6 de l\'article L.611-1 du code de la consommation)',
                                    decoration: 'underline',
                                    alignment:  'center',
                                },
                            ],
                            [
                                {
                                    text:      [
                                        'Centre de la Médiation et d’Arbitrage de Paris : https://www.economie.gouv.fr/mediation-conso/mediateurs-references\n',
                                        'Tél. : +33 1 44 95 11 40 – Courriel : cmap@cmap.fr Adresse : CMAP – 39 avenue Franklin D. Roosevelt – 75008 PARIS ',
                                    ],
                                    alignment: 'center',
                                },
                            ],
                        ],
                    },
                    layout: this._rowLayout,
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
