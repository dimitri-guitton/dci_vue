import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { DARK, EA_SIGNATURE, LOGO_CEE, LOGO_EDF, ORANGE, TEL_FRANCE_RENOV } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import { toFrenchDate } from '@/services/commonService';
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
            fontSize:  10,
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
            content: [
                this._generateHeader,
                this._generateSubHeader(),
                this._generateTable(),
                this._generateSubTable,
                this._generateFooter(),
            ],
            styles:  this._style,
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
                        width: 150,
                    },
                ],
            },
            {
                width:      '*',
                lineHeight: 1,
                margin:     [ 30, 0 ],
                stack:      [
                    {
                        text:      'CADRE CONTRIBUTION',
                        alignment: 'center',
                        bold:      true,
                        fontSize:  18,
                    },
                    {
                        text:      'A conserver impérativement avec votre devis signé et votre facture',
                        alignment: 'center',
                        fontSize:  10,
                        color:     ORANGE,
                    },
                    {
                        margin:     [ 0, 5 ],
                        lineHeight: 1.5,
                        text:       [
                            {
                                text: 'SARL ECO ATLANTIQUE',
                            },
                            'Siège social : 11 Rue Françoise Giroud\n',
                            '17000 LA ROCHELLE\n',
                            'Tel : 05 46 52 95 94\n',
                            'RCS 799 435 193 APE : 4329A\n',
                        ],
                        style:      'xsText',
                        alignment:  'center',
                    },
                ],
            },
            {
                margin: [ 0, 15, 0, 0 ],
                width:  '25%',
                stack:  [
                    {
                        image: LOGO_EDF,
                        width: 125,
                    },
                ],
            },
        ],
    };

    private _generateSubHeader(): Content {
        return {
            style:      'text',
            lineHeight: 1.2,
            text:       [
                'Le dispositif national des certificats d\'économie d\'énergie (CEE) mis en place par le ministère en charge de l\'énergie impose à l\'ensemble des fournisseurs d\'énergies (électricité, gaz, fioul domestique, chaleur ou froid, carburants automobiles), de réaliser des économies et promouvoir les comportements vertueux auprès des consommateurs d\'énergie.',
                '\n',
                'Dans le cadre de son partenariat avec EDF (SIREN 552 081 317), la société ',
                {
                    text: 'SARL ECO ATLANTIQUE',
                    bold: true,
                },
                ' s\'engage à vous apporter : ',
                '\n',
                this.getCheckBox( true ),
                ' une prime d\'un montant de ',
                {
                    text: this.formatPrice( this._file.quotation.ceeBonus ),
                    bold: true,
                },
                ' euros',
            ],
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
                    table: {
                        widths: [ '50%', '20%', '*' ],
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
                },
                {
                    margin: [ 0, 5, 0, 0 ],
                    text:   [
                        'Au bénéfice de : (Nom, Prénom et Adresse du bénéficiaire) : ',
                        {
                            text: `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }, ${ address }, ${ city } ${ zipCode }`,
                            bold: true,
                        },
                    ],
                },
            ],
        };
    }

    private _generateSubTable: Content = {
        style:  [ 'text' ],
        margin: [ 0, 10 ],
        stack:  [
            {
                text: 'Le montant de cette prime ne pourra être révisé à la baisse qu\'en cas de modification du volume de Certificats d\'Economies d\'Énergie attaché à l\'opération ou aux opérations d\'économies d\'énergie ou de la situation de précarité énergétique et ce, de manière proportionnelle. Dans le cadre de la réglementation un contrôle qualité des travaux sur site ou par contact pourra être demandé. Un refus de ce contrôle sur site ou par contact via EDF ou un prestataire d\'EDF conduira au refus de cette prime par EDF',
            },
            {
                margin: [ 0, 5 ],
                text:   [
                    'Date de cette proposition : ',
                    {
                        text: toFrenchDate( ( new Date() ).toString() ),
                        bold: true,
                    },
                    ' [à dater - le présent document doit être signé au plus tard quatorze jours après la date d\'engagement de l\'opération, et en état de cause avant la date de début des travaux]',
                ],
            },
            {
                margin: [ 0, 5 ],
                text:   'Signature [à signer de façon manuscrite ou générique par le partenaire] : ',
            },
            {
                margin: [ 290, 0 ],
                image:  EA_SIGNATURE,
                width:  100,
            },
        ],
    };

    private _generateFooter(): Content {
        return {
            margin: [ 0, 75 ],
            style:  [ 'text' ],
            stack:  [
                {
                    text: '/!\\ Faites réaliser plusieurs devis afin de prendre une décision éclairée. Attention, seules les propositions remises avant l\'acceptation du devis ou du bon pour commande sont valables, et vous ne pouvez pas cumuler plusieurs offres CEE différentes pour la même opération.',
                },
                {
                    margin: [ 0, 5 ],
                    text:   '/!\\ Seul le professionnel est responsable de la conformité des travaux que vous lui confiez. Vérifier ses qualifications techniques et l\'éligibilité des produits proposés avant d\'engager vos travaux. Un contrôle des travaux effectués dans votre logement pourra être réalisé sur demande de EDF ou des autorités publiques.',
                },
                {
                    table:  {
                        widths: [ '100%' ],
                        body:   [
                            [
                                {
                                    text:       'Où se renseigner pour bénéficier de cette offre ?',
                                    decoration: 'underline',
                                },
                            ],
                            [
                                {
                                    margin: [ 60, 0 ],
                                    text:   'Numéro de téléphone du professionnel : 05.46.52.95.94',
                                },
                            ],
                            [
                                {
                                    margin: [ 60, 0 ],
                                    text:   'Site du professionnel : https://ecoatlantique.fr',
                                },
                            ],
                            [
                                {
                                    text:       'Où s\'informer sur les aides pour les travaux d\'économies d\'énergie ?',
                                    decoration: 'underline',
                                },
                            ],
                            [
                                {
                                    margin: [ 120, 0 ],
                                    text:   'Site de réseau FAIRE : https://www.faire.gouv.fr',
                                },
                            ],
                            [
                                {
                                    margin:  [ 120, 0 ],
                                    columns: [
                                        {
                                            width: 'auto',
                                            text:  'Tél : ',
                                        },
                                        {
                                            image: TEL_FRANCE_RENOV,
                                            width: 100,
                                        },
                                    ],
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
                                    alignment: 'center',
                                    text:      'Site du Médiateur EDF : https://mediateur.edf.fr',
                                },
                            ],
                            [
                                {
                                    alignment: 'center',
                                    text:      'Adresse: Médiateur du groupe EDF\nTSA 50.026\n75804 Paris cedex 08',
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
