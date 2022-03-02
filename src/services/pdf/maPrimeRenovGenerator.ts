import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import {
    ASIDE_MA_PRIME_RENOV,
    CERFA_MA_PRIME_RENOV,
    EA_SIGNATURE,
    LIGHT_GREEN,
    LOGO_ANAH,
    LOGO_MA_PRIME_RENO,
    LOGO_REP_FRANCE_VERTICAL,
    MA_PRIME_RENOV_PAGE_2,
} from '@/services/pdf/pdfVariable';
import { AllFile } from '@/types/v2/File/All';

export class MaPrimeRenovGenerator extends PdfGenerator {
    private _file: AllFile;
    private _style: StyleDictionary = {
        green:   {
            color: LIGHT_GREEN,
        },
        table:   {
            fontSize: 8,
            font:     'Times',
        },
        text:    {
            fontSize: 8,
            font:     'Times',
        },
        xsText:  {
            fontSize: 7,
            font:     'Times',
        },
        xxsText: {
            fontSize: 6,
            font:     'Times',
        },
    };


    constructor( file: AllFile ) {
        super();
        this._file = file;
        this.type  = PdfType.MaPrimeRenov;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            pageMargins: [ 70, 40, 70, 40 ],
            content:     [
                this._generateHeader,
                this._generateTitle,
                this._generateSubTitle(),
                this._generateForm(),
                this._genetateEndPage1(),
                this._generatePage2,
                this._generateSignature,
            ],
            styles:      this._style,
        };
    }

    private _generateHeader: Content = {

        columns: [
            {
                width: '20%',
                stack: [
                    {
                        image: LOGO_REP_FRANCE_VERTICAL,
                        width: 90,
                    },
                ],
            },
            {
                width: '65%',
                stack: [],
            },
            {
                width: '15%',
                stack: [
                    {
                        image: LOGO_ANAH,
                        width: 70,
                    },
                ],
            },
        ],
    };

    private _generateTitle: Content = {

        stack: [
            {
                image:            CERFA_MA_PRIME_RENOV,
                width:            35,
                absolutePosition: { x: 60, y: 150 },
            },
            {
                margin:    [ 70, 0 ],
                alignment: 'center',
                bold:      true,
                fontSize:  12,
                text:      [
                    {
                        text:     'MANDAT\n\n',
                        fontSize: 13,
                    },
                    {
                        text:     'Administratif',
                        fontSize: 13,
                    },
                    ' : pour la constitution d’une demande d’aide et sa demande de paiement\n',
                    {
                        text:  'et/ou\n',
                        style: 'green',
                    },
                    {
                        text:     'Financier',
                        fontSize: 13,
                    },
                    ' : pour la perception des fonds (procuration)',
                ],
            },
            {
                margin:     [ 60, 5 ],
                style:      'xsText',
                lineHeight: 1.1,
                text:       [
                    'Articles 1984 et suivants du code civil / décret n°2020-26 du 14 janvier 2020 / arrêté du 14 janvier 2020 relatifs à la prime de transition énergétique. Articles 1984 et suivants du code civil / décret n°2020-26 du 14 janvier 2020 / arrêté du 14 janvier 2020 relatifs à la prime de transition énergétique - ',
                    {
                        text:  'PROPRIETAIRE OCCUPANT',
                        style: 'green',
                        bold:  true,
                    },
                ],
            },
        ],
    };

    private _generateSubTitle(): Content {
        return {
            style:      [ 'text' ],
            margin:     [ 0, 5 ],
            lineHeight: 1.2,
            table:      {
                body: [
                    [
                        {
                            text: [
                                'Ce formulaire doit ',
                                {
                                    text: 'obligatoirement',
                                    bold: true,
                                },
                                ' être utilisé si vous voulez désigner',
                                {
                                    text: 'un mandataire',
                                    bold: true,
                                },
                                ' pour effectuer les démarches relatives à MaPrimeRénov’. Vous pouvez cocher une, ou l’ensemble des démarches proposées dans les cases ci-dessous, à savoir :\n',
                                '– constitution d’une demande d’aide et d’une demande de paiement,\n',
                                '– perception des fonds (procuration).\n',
                                'Le mandataire s\'identifie obligatoirement auprès de l’Anah, préalablement à la validation de votre demande de mandat. Pour être valable, ce mandat doit être daté et signé par vous-même (le mandant) et par la personne que vous désignez (votre mandataire).',
                                {
                                    text: 'Ce mandat reste valide tant que sa révocation à votre initiative ou à celle de votre mandataire n’aura pas été réceptionnée par l’Anah. ',
                                    bold: true,
                                },
                            ],
                        },
                    ],
                ],
            },
            layout:     {
                hLineWidth:    function () {
                    return 0;
                },
                vLineWidth:    function () {
                    return 0;
                },
                fillColor:     function () {
                    return LIGHT_GREEN;
                },
                paddingTop:    function () {
                    return 11;
                },
                paddingBottom: function () {
                    return 11;
                },
                paddingLeft:   function () {
                    return 11;
                },
                paddingRight:  function () {
                    return 11;
                },
            },
        };
    }

    private _generateForm(): Content {
        let address = this._file.beneficiary.address;
        let city    = this._file.beneficiary.city;
        let zipCode = this._file.beneficiary.zipCode;

        if ( !this._file.housing.isAddressBenef ) {
            address = this._file.housing.address;
            city    = this._file.housing.city;
            zipCode = this._file.housing.zipCode;
        }

        return {
            margin:     [ 0, 5 ],
            style:      'text',
            lineHeight: 1.7,
            stack:      [
                {
                    text:     'Je, soussigné(e) (vous, le mandant) :',
                    bold:     true,
                    fontSize: 10,
                },
                {
                    text: [
                        'M. ',
                        this.getCheckBox( this._file.beneficiary.civility === 'm' ),
                        ' ou Mme ',
                        this.getCheckBox( this._file.beneficiary.civility !== 'm' ),
                    ],
                },
                {
                    columns: [
                        {
                            width: '60%',
                            text:  `Nom : ${ this._file.beneficiary.lastName } `,
                        },
                        {
                            width: 'auto',
                            text:  `Prénom : ${ this._file.beneficiary.firstName } `,
                        },
                    ],
                },
                {
                    text: [
                        this.getCheckBox( true ),
                        ' Propriétaire du logement à rénover sis au (indiquer l’adresse complète, y compris s’il y en a, les numéros de bâtiments et/ ou d’étages) :\n',
                        address,
                    ],
                },
                {
                    columns: [
                        {
                            width: '20%',
                            text:  `Code postal : ${ zipCode }`,
                        },
                        {
                            width: 'auto',
                            text:  `Commune : ${ city }`,
                        },
                    ],
                },
                {
                    columns: [
                        {
                            width: '60%',
                            text:  `Adresse mail : ${ this._file.beneficiary.email }`,
                        },
                        {
                            width: 'auto',
                            text:  `tél (mobile et/ ou fixe) : ${ this._file.beneficiary.mobile !== ''
                                                                  ? this._file.beneficiary.mobile
                                                                  : this._file.beneficiary.phone }`,
                        },
                    ],
                },
                {
                    text: 'Donne MANDAT à (votre mandataire):',
                    bold: true,
                },
                {
                    text: [
                        'M. ',
                        this.getCheckBox( true ),
                        ' ou Mme ',
                        this.getCheckBox(),
                        ' (si personne morale, nom-prénom du représentant ayant délégation de signature)',
                    ],
                },
                {
                    columns: [
                        {
                            width: '60%',
                            text:  'Nom : Bories',
                        },
                        {
                            width: 'auto',
                            text:  'Prénom : Quentin',
                        },
                    ],
                },
                {
                    text: [
                        ' Raison sociale (si personne morale) : SARL ECO ATLANTIQUE',
                    ],
                },
                {
                    text: [
                        ' adresse complète : 11 rue Françoise Giroud 17000 La Rochelle.\n',
                        '..................................................................................................................................................................................................................................',
                    ],
                },
                {
                    columns: [
                        {
                            width: '60%',
                            text:  'Adresse mail : quentin.ecoatlantique@gmail.com',
                        },
                        {
                            width: 'auto',
                            text:  'tél (mobile et/ ou fixe) : 05 46 52 95 94',
                        },
                    ],
                },
            ],
        };

    }

    private _genetateEndPage1(): Content {
        return {
            style:      'text',
            lineHeight: 1.5,
            stack:      [
                {
                    text: [
                        'Pour effectuer en mon nom et pour mon compte les démarches suivantes relatives à ',
                        {
                            text:  'MaPrimeRénov’',
                            style: 'green',
                        },
                        ' :',
                    ],
                    bold: true,
                },
                {
                    text: [
                        '1) DEMANDE DE L’AIDE MaPrimeRénov’',
                        {
                            text:  'MaPrimeRénov’',
                            style: 'green',
                        },
                        '  : mandat ADMINISTRATIF (à cocher si le mandat porte sur cette démarche)',
                    ],
                    bold: true,
                },
                {
                    margin:  [ 0, 5, 0, 0 ],
                    columns: [
                        {
                            width:  'auto',
                            margin: [ 0, 0, 10, 0 ],
                            stack:  [
                                {
                                    ...this.getCheckBox( true ),
                                    fontSize: 25,
                                },
                            ],
                        },
                        {
                            width:    '*',
                            fontSize: 9,
                            text:     [
                                {
                                    text: 'Je donne mandat pour la constitution de mon dossier de demande d’aide et son dépôt EN LIGNE, pour la constitution de mon dossier de demande de paiement et son dépôt en ligne, ainsi que pour la réception et le traitement de toute correspondance avec l’Anah et ses services.',
                                    bold: true,
                                },
                                '  Il appartient au mandataire de joindre l’ensemble des pièces nécessaires à la constitution de la demande',
                            ],
                        },
                    ],
                },
                {
                    margin:   [ 0, 5, 0, 0 ],
                    text:     'J’ATTESTE:',
                    fontSize: 11,
                    bold:     true,
                },
                {
                    text: [
                        '– ne pas avoir commencé les travaux avant le dépôt en ligne de la demande d’aide ',
                        {
                            text:  'MaPrimeRénov’',
                            style: 'green',
                        },
                        ' ;',
                    ],
                    bold: true,
                },
                {
                    text: [
                        '– que mon logement est achevé depuis',
                        {
                            text: ' plus de 2ans ',
                            bold: true,
                        },
                        ' à la date de début des travaux ;',
                    ],
                },
                {
                    text: [
                        '– que j’en suis',
                        {
                            text: ' propriétaire',
                            bold: true,
                        },
                        ', et que je',
                        {
                            text: ' l’occupe personnellement à titre de résidence principale',
                            bold: true,
                        },
                        ' ou qu’il le sera au plus tard à la date du début des travaux ;',
                    ],
                },
                {
                    text: [
                        '– que j’ai bien déclaré les ressources de ',
                        {
                            text: 'l’ensemble des occupants',
                            bold: true,
                        },
                        ' du logement',
                    ],
                },
                {
                    image:            ASIDE_MA_PRIME_RENOV,
                    width:            40,
                    height:           310,
                    absolutePosition: { x: 5, y: 510 },
                },
                {
                    image:            LOGO_MA_PRIME_RENO,
                    width:            100,
                    absolutePosition: { x: 60, y: 790 },
                },


            ],
        };

    }

    private _generatePage2: Content = {
        margin:           [ 0, 0, 0, 0 ],
        image:            MA_PRIME_RENOV_PAGE_2,
        fit:              [ 600, 700 ],
        absolutePosition: { x: 50, y: 40 },
        pageBreak:        'before',
    };

    private _generateSignature: Content = {
        absolutePosition: { x: 380, y: 730 },
        image:            EA_SIGNATURE,
        width:            125,
    };
}
