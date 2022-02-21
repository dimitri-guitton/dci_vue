import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, ContentText, CustomTableLayout, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { BLUE, GREEN, LOGO_ECO, LOGO_QUALIBOIS, LOGO_RGE_CERTIBAT } from '@/services/pdf/pdfVariable';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import CombleList from '@/types/v2/File/Comble/CombleList';
import SolList from '@/types/v2/File/Sol/SolList';
import RoList from '@/types/v2/File/Ro/RoList';
import RrList from '@/types/v2/File/Rr/RrList';
import { CetList } from '@/types/v2/File/Cet/CetList';
import PgList from '@/types/v2/File/Pg/PgList';
import { CombleQuotation } from '@/types/v2/File/Comble/CombleQuotation';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import { PgQuotation } from '@/types/v2/File/Pg/PgQuotation';
import { toFrenchDate } from '@/services/commonService';

export class QuotationGenerator extends PdfGenerator {
    private _file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile;

    private _style: StyleDictionary = {
        header:          {
            fontSize: 14,
            bold:     true,
        },
        tableHeader:     {
            bold:      true,
            fontSize:  10,
            alignment: 'center',
        },
        commercialTable: {
            alignment: 'center',
            fontSize:  9,
            margin:    [ 0, 25, 0, 10 ],
        },
    };


    constructor( file: CetFile | CombleFile | PgFile | RoFile | RrFile | SolFile ) {
        super();
        this._file = file;
        this.type  = PdfType.Quotation;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._generateHeader,
                this._generateCommercialHeader(),
                this._generateCustomerInfo(),
                this._generateHousingInfo(),
                this._generateQuotation(),
                this._generateQuotationPrice(),
                this._generateTexts(),
                this._generateFinalePrice(),
                this._generateSignature,
            ],
            styles:  this._style,
        };
    }

    private _generateHeader: Content = {
        margin:     [ 0, 0, 0, 5 ],
        lineHeight: 1.5,
        columns:    [
            {
                width: '60%',
                stack: [
                    {
                        table:  {
                            body: [
                                [
                                    {
                                        image: LOGO_RGE_CERTIBAT,
                                        width: 45,
                                    },
                                    {
                                        image: LOGO_ECO,
                                        width: 220,
                                    },
                                    {
                                        image: LOGO_QUALIBOIS,
                                        width: 45,
                                    },
                                ],
                            ],
                        },
                        layout: {
                            defaultBorder: false,
                        },
                    },
                    {
                        text:      'Siège social : 11 rue Françoise Giroud 17000 La Rochelle. Tél : 05.46.52.95.94',
                        style:     'xsText',
                        alignment: 'center',
                    },
                    {
                        text:      'RCS LA ROCHELLE 79943519300054',
                        style:     'xsText',
                        alignment: 'center',
                    },
                ],
            },
            {
                width: '*',
                stack: [
                    {
                        text:  'Devis N° AA9-20360822T1752-PO',
                        style: 'header',
                    },
                    {
                        text:  'Qualibois QB/59396',
                        style: 'text',
                    },
                    {
                        columns: [
                            { text: 'Date visite technique :' },
                            { text: '22/08/2036', alignment: 'right' },
                        ],
                        style:   'text',
                    },
                ],
            },
        ],
    };

    private _generateCommercialHeader(): Content {
        let technician = this._file.technician;
        if ( technician === undefined ) {
            technician = {
                id:        0,
                firstName: ' ',
                lastName:  ' ',
                phone:     ' ',
            };
        }
        return {
            margin: [ 0, 3 ],
            style:  [ 'table', 'commercialTable' ],
            table:  {
                body:   [
                    [
                        {
                            text:  'Technicien conseil',
                            style: 'tableHeader',
                        },
                        {
                            text:  'Téléphone',
                            style: 'tableHeader',
                        },
                        {
                            text:  'Origine',
                            style: 'tableHeader',
                        },
                        {
                            text:  'Délais d’exécution avant le',
                            style: 'tableHeader',
                        },
                    ],
                    [
                        `${ technician.firstName } ${ technician.lastName }`,
                        this.formatPhone( technician.phone ),
                        this._file.quotation.origin,
                        toFrenchDate( this._file.quotation.executionDelay ),
                    ],
                ],
                widths: [ '*', 110, 110, '*' ],
            },
            layout: {
                ...this._getTableLayout(),
                paddingTop:    function () {
                    return 5;
                },
                paddingBottom: function () {
                    return 5;
                },
            },
        };
    }

    private _generateCustomerInfo(): Content {
        return {
            margin:     [ 0, 3 ],
            lineHeight: 1.3,
            style:      [ 'text' ],
            table:      {
                body:   [
                    [
                        {
                            columns: [
                                {
                                    width: '30%',
                                    stack: [
                                        'Nom / prénom :',
                                        'Adresse :',
                                        'Ville :',
                                        'Code Postal :',
                                        'Téléphone :',
                                        'Mobile :',
                                        'Email :',
                                    ],
                                },
                                {
                                    width: '*',
                                    stack: [
                                        `${ this._file.beneficiary.firstName } ${ this._file.beneficiary.lastName }`,
                                        this._file.beneficiary.address,
                                        this._file.beneficiary.city,
                                        this._file.beneficiary.zipCode,
                                        this.formatPhone( this._file.beneficiary.phone ),
                                        this.formatPhone( this._file.beneficiary.mobile ),
                                        this._file.beneficiary.email,
                                    ],
                                },
                            ],
                        },
                        {
                            // TODO faire la différence des adresses
                            columns: [
                                [
                                    {
                                        text: 'Adresse des travaux (remplir uniquement si différente)',
                                        bold: true,
                                    },
                                    {
                                        columns: [
                                            {
                                                width: '25%',
                                                stack: [
                                                    'Adresse :',
                                                    'Ville :',
                                                    'Code Postal :',
                                                    {
                                                        text:  'Nature du bâtiment :',
                                                        style: 'xxsText',
                                                    },
                                                ],
                                            },
                                            {
                                                width: '*',
                                                stack: [
                                                    ' ',
                                                    ' ',
                                                    ' ',
                                                    '-',
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        text:      'Dans le cas d’un changement de résidence principale par rapport à l’avis d’imposition, une attestation manuscrite du bénéficiaire est obligatoire',
                                        style:     'xxsText',
                                        alignment: 'center',
                                        margin:    [ 0, 5, 0, 0 ],
                                    },
                                ],
                            ],
                        },
                    ],
                ],
                widths: [ '50%', '*' ],
            },
            layout:     {
                ...this._getBorderLayout(),
                vLineWidth:    function () {
                    return 1;
                },
                vLineColor:    function () {
                    return GREEN;
                },
                paddingTop:    function () {
                    return 5;
                },
                paddingBottom: function () {
                    return 5;
                },
            },
        };
    }

    private _getHousingData(): HousingItem {
        const housing = this._file.housing;
        let list: CombleList | SolList | RoList | RrList | CetList | PgList;
        let quotation: CombleQuotation | SolQuotation | RoQuotation | RrQuotation | CetQuotation | PgQuotation;

        switch ( this._file.type ) {
            case FILE_COMBLE:
            case FILE_SOL:
                list = ( this._file.lists as CombleList | SolList );
                return {
                    left: [
                        {
                            label: 'Chauffage',
                            value: housing.heatingType ? this.getValueInList( list.batimentNatureList, housing.heatingType ) : ' ',
                        },
                        {
                            label: 'Type de bâtiment',
                            value: this.getValueInList( list.batimentNatureList, housing.buildingNature ),
                        },
                    ],
                };
            case FILE_PAC_RO:
                list      = ( this._file.lists as RoList );
                quotation = ( this._file.quotation as RoQuotation );
                return {
                    left:  [
                        {
                            label: 'Local',
                            value: this.getValueInList( list.batimentNatureList, housing.buildingNature ),
                        },
                        {
                            label: 'Surface à chauffer (m2)',
                            value: housing.area,
                        },
                        {
                            label: 'Ce logement à moins de 2 ans',
                            value: this.yesOrNo( housing.lessThan2Years ),
                        },
                        {
                            label: 'Tension disponible',
                            value: housing.availableVoltage ? housing.availableVoltage : ' ',
                        },
                    ],
                    right: [
                        {
                            label: 'Appareil à remplacer',
                            value: quotation.deviceToReplace.type ? quotation.deviceToReplace.type : ' ',
                        },
                        {
                            label: 'Marque',
                            value: quotation.deviceToReplace.brand ? quotation.deviceToReplace.brand : ' ',
                        },
                        {
                            label: 'Modèle',
                            value: quotation.deviceToReplace.model ? quotation.deviceToReplace.model : ' ',
                        },
                    ],
                };
            case FILE_PAC_RR:
                list      = ( this._file.lists as RrList );
                quotation = ( this._file.quotation as RrQuotation );
                return {
                    left:  [
                        {
                            label: 'Local',
                            value: this.getValueInList( list.batimentNatureList, housing.buildingNature ),
                        },
                        {
                            label: 'Surface à chauffer (m2)',
                            value: housing.area,
                        },
                        {
                            label: 'Ce logement à moins de 2 ans',
                            value: this.yesOrNo( housing.lessThan2Years ),
                        },
                        {
                            label: 'Tension disponible',
                            value: housing.availableVoltage ? housing.availableVoltage : ' ',
                        },
                        {
                            label: 'Nombre de pièces',  // TODO ajouter le nombre de piece
                            value: quotation.rrMulti.roomNumber.toString(),
                        },
                    ],
                    right: [
                        {
                            label: 'Superficie de la pièce 1 (m2)',
                            value: quotation.rrMulti.areaP1.toString(),
                        },
                        {
                            label: 'Superficie de la pièce 2 (m2)',
                            value: quotation.rrMulti.roomNumber >= 2 ? quotation.rrMulti.areaP2.toString() : ' ',
                        },
                        {
                            label: 'Superficie de la pièce 3 (m2)',
                            value: quotation.rrMulti.roomNumber >= 3 ? quotation.rrMulti.areaP3.toString() : ' ',
                        },
                        {
                            label: 'Superficie de la pièce 4 (m2)',
                            value: quotation.rrMulti.roomNumber >= 4 ? quotation.rrMulti.areaP4.toString() : ' ',
                        },
                        {
                            label: 'Superficie de la pièce 5 (m2)',
                            value: quotation.rrMulti.roomNumber >= 4 ? quotation.rrMulti.areaP5.toString() : ' ',
                        },
                    ],
                };

            case FILE_PG:
                list = ( this._file.lists as PgList );
                return {
                    left: [
                        {
                            label: 'Local',
                            value: this.getValueInList( list.batimentNatureList, housing.buildingNature ),
                        },
                        {
                            label: 'Surface à chauffer (m2)',
                            value: housing.area,
                        },
                        {
                            label: 'Ce logement à moins de 2 ans',
                            value: this.yesOrNo( housing.lessThan2Years ),
                        },
                    ],
                };

            case FILE_CET:
                list = ( this._file.lists as CetList );
                return {
                    left: [
                        {
                            label: 'Local',
                            value: this.getValueInList( list.batimentNatureList, housing.buildingNature ),
                        },
                        {
                            label: 'Ce logement à moins de 2 ans',
                            value: this.yesOrNo( housing.lessThan2Years ),
                        },
                    ],
                };
        }

        return {
            left: [],
        };
    }

    private _generateHousingInfo(): Content {
        const data = this._getHousingData();

        const tableBody: ContentText[][] = [];
        let rowTable: ContentText[]      = [];

        if ( data.left !== undefined ) {
            for ( const item of data.left ) {
                rowTable.push( { text: `${ item.label } :`, bold: true } );
                rowTable.push( { text: item.value } );
                tableBody.push( rowTable );
                rowTable = [];
            }
        }

        let index = 0;
        if ( data.right !== undefined ) {
            for ( const item of data.right ) {
                rowTable.push( { text: `${ item.label } :`, bold: true } );
                rowTable.push( { text: item.value } );

                // Si il y a plus de valeur à droite qu'a gauche on ajouter des valeur vide à gauche
                if ( tableBody[ index ] === undefined ) {
                    tableBody[ index ] = [ { text: ' ' }, { text: ' ' } ];
                }

                if ( tableBody[ index ].length > 0 ) {
                    tableBody[ index ] = [ ...tableBody[ index ], ...rowTable ];
                } else {
                    tableBody.push( rowTable );
                }

                rowTable = [];
                index++;
            }
        }

        // Ajoute des champs vide pour que la tableau est toujours 4 colonnes
        for ( const row of tableBody ) {
            while ( row.length < 4 ) {
                row.push( { text: ' ' } );
            }
        }

        return {
            margin: [ 0, 3 ],
            style:  'text',
            table:  {
                widths: [ '25%', '25%', '25%', '25%' ],
                body:   tableBody,
            },
            layout: {
                ...this._getBorderLayout(),
                vLineWidth:    function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 0;
                    }
                    return ( i === 0 || i === node.table.widths.length || i === 2 ) ? 1 : 0;
                },
                vLineColor:    function () {
                    return GREEN;
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

    private _generateQuotation(): Content {
        return {
            margin: [ 0, 3, 0, 0 ],
            style:  [ 'table' ],
            table:  {
                headerRows: 1,
                widths:     [ 100, '*', 50, 55, 55 ],
                body:       [
                    [
                        {
                            text:    'Désignation (Fournitures, main d’œuvre et déplacement)',
                            style:   'tableHeader',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:  'Quantité',
                            style: 'tableHeader',
                        },
                        {
                            text:  'PU HT',
                            style: 'tableHeader',
                        },
                        {
                            text:  'TOTAL HT',
                            style: 'tableHeader',
                        },
                    ],
                    [
                        {
                            text:    'Nature des travaux réalisés (Poêle à granulé ou pellets)',
                            colSpan: 5,
                        },
                        {},
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text: 'BRIDGE/1/8KW/C/4',
                        },
                        {
                            text: 'JOLLY MEC BRIDGE 8KW PIERRE OLLAIRE\n' +
                                      'Puissance nominale 8,2 kW , Rendement nominal 91,1 %, Label Flamme verte 7 étoiles, Classe énergétique A+, émission de CO: 136,6 mg/m3 soit 0,011 %, émission de particules 14,26 mg/nm3, émission d’oxyde d’azote : 145,4 mg/nm3, conforme à la norme NF 14785.\n' +
                                      '\n- Sortie de fumée arrière ou supérieure.\n' +
                                      '- 5 niveau de fonctionnement + fonction SILENT.\n' +
                                      '- Humidificateur intégré (améliore la qualité de l’air).\n' +
                                      '- Brasier en fonte\n' +
                                      '- Chambre de combustion Fireflector haute densité. Optimise le processus de combustion et réduit les émissions\n' +
                                      '- Résistance en céramique (réduction de 40 % des temps d’allumage).\n' +
                                      '- Capacité du réservoir : 18 litres\n' +
                                      '- Autonomie min : 10h\n' +
                                      '- Autonomie max : 29h\n' +
                                      '- Volume à chauffer : 174m3 à 230 m3\n' +
                                      '- Poids : 116 kg\n' +
                                      '- Dimensions en cm : P= 53,5 L = 52,6 H = 1162',
                        },
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '3620.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '3620.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text: ' ',
                        },
                        {
                            text: 'Boisseau existant maçonné départ au plafond\n' +
                                      'KIT KRFLCTé fumée Té air\n' +
                                      'Adaptateur poêle Tuyau réglable\n' +
                                      'Tube concentrique 1000mm Tube concentrique 500mm Chapeau CTIVCollier de maintien Gaine',
                        },
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '1000.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '1000.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:     'GARANTIE 2ANS PIECES',
                            bold:     true,
                            fontSize: 14,
                            colSpan:  5,
                        },
                        {},
                        {},
                        {},
                        {},
                    ],
                    [
                        {
                            text:    'Forfait pose (livraison,pose et mise en service de l’appareil)',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '700.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '700.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:    'Forfait fournitures',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '50.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '50.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:    'Forfait enlèvement cheminée existante',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '0u',
                            alignment: 'right',
                        },
                        {
                            text:      '950.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '950.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:    'Plaque de sol en acier noir',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '0u',
                            alignment: 'right',
                        },
                        {
                            text:      '149.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '149.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:    'Option poêle 6 KW',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '0.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '0.00 €',
                            alignment: 'right',
                        },
                    ],
                    [
                        {
                            text:    'Option WIFI intégrée',
                            colSpan: 2,
                        },
                        {},
                        {
                            text:      '1u',
                            alignment: 'right',
                        },
                        {
                            text:      '0.00 €',
                            alignment: 'right',
                        },
                        {
                            text:      '0.00 €',
                            alignment: 'right',
                        },
                    ],
                ],
            },
            layout: this._getTableLayout(),

        };
    }

    private _generateQuotationPrice(): Content {
        const quotation: CombleQuotation | SolQuotation | RoQuotation | RrQuotation | CetQuotation | PgQuotation = this._file.quotation;

        return {
            margin: [ 0, 0 ],
            style:  [ 'table' ],
            table:  {
                body:   [
                    [
                        {
                            stack: [
                                {
                                    text:      'Commentaires',
                                    alignment: 'center',
                                    bold:      true,
                                },
                                {
                                    text:      quotation.commentary,
                                    alignment: 'center',
                                },
                            ],
                        },
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            width: '70%',
                                            stack: [
                                                {
                                                    text:       'Total HT',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       'TVA 5.5%',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       'Total TTC',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       'Primce CEE (1)',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       'Estimation MaPrimeRenov',
                                                    lineHeight: 2,
                                                },
                                            ],
                                        },
                                        {
                                            width: '*',
                                            stack: [
                                                {
                                                    text:       this.formatPrice( quotation.totalHt ),
                                                    alignment:  'right',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       this.formatPrice( quotation.totalTva ),
                                                    alignment:  'right',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       this.formatPrice( quotation.totalTtc ),
                                                    alignment:  'right',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       `TODO`,
                                                    alignment:  'right',
                                                    lineHeight: 2,
                                                },
                                                {
                                                    text:       `TODO`,
                                                    alignment:  'right',
                                                    lineHeight: 2,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    [
                        {
                            text: 'Assurance décennale SMA BTP C30911H',
                            bold: true,
                        },
                        {
                            stack: [
                                {
                                    columns: [
                                        {
                                            width:      '50%',
                                            text:       'A Payer',
                                            bold:       true,
                                            lineHeight: 2,
                                            fontSize:   10,
                                        },
                                        {
                                            width:      '*',
                                            text:       this.formatPrice( quotation.remainderToPay ),
                                            alignment:  'right',
                                            bold:       true,
                                            lineHeight: 2,
                                            fontSize:   10,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                ],
                widths: [ '50%', '*' ],
            },
            layout: {
                ...this._getBorderLayout(),
                hLineWidth:    function ( i, node ) {
                    return ( i === node.table.body.length ) ? 1 : 0;
                },
                vLineWidth:    function () {
                    return 1;
                },
                vLineColor:    function () {
                    return GREEN;
                },
                paddingTop:    function () {
                    return 5;
                },
                paddingBottom: function () {
                    return 5;
                },
            },
        };
    }

    private _generateTexts(): Content {
        return {
            style: [ 'table' ],
            stack: [
                {
                    margin: [ 0, 10 ],
                    table:  {
                        body:   [
                            [
                                {
                                    text:  'Modalité de paiement : Prime CEE versée directement à Eco Atlantique par Vos Travaux Eco',
                                    style: 'tableHeader',
                                },
                            ],
                            [
                                {
                                    text: 'Les travaux relatifs à ce document sont éligibles au dispositif des certificats d’économies d’énergie. Dans ce cadre, l’obligé « Vos Travaux Eco », grâce à son partenaire Eco Atlantique, me fait bénéficier d’une Prime énergie, dont le montant sera avancé par Eco Atlantique et remboursé par Vos Travaux Eco à Eco Atlantique.\n' +
                                              'La TVA à taux réduit de 5,5% ne s\'applique qu\'à des commandes passées par des particuliers et relative à des locaux à usage d\'habitation dont la construction est achevée depuis plus de deux ans. Réalisation du chantier par Allaire du temps and co Siren 852284983 Qualibois Module Air QB/58881',
                                },
                            ],
                        ],
                        widths: [ '100%' ],
                    },
                    layout: this._getTableLayout(),
                },
                {
                    margin: [ 0, 10 ],
                    table:  {
                        body:   [
                            [
                                {
                                    text:  'MaPrimeRénov\'',
                                    style: 'tableHeader',
                                },
                            ],
                            [
                                {
                                    text: '«Dans le cas où l’aide notifiée au client est inférieure au montant de l’aide prévisionnelle, l’usager n’est pas lié par le devis et l’entreprise s’engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d’une durée de quatorze jours à partir de la date de présentation du devis rectificatif.L’aide MaPrimeRénov’ est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire. En cas de fausse déclaration, de manœuvre frauduleuse ou de changement du projet de travaux subventionnés, le bénéficiaire s’expose au retrait et reversement de tout ou partie de l’aide. Les services de l’Anah pourront faire procéder à tout contrôle des engagements et sanctionner le bénéficiaire et son mandataire éventuel des manquements constatés ».',
                                },
                            ],
                        ],
                        widths: [ '100%' ],
                    },
                    layout: this._getTableLayout(),
                },
            ],
        };
    }

    private _generateFinalePrice(): Content {
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
                                    width: '30%',
                                    stack: [
                                        {
                                            text:      'Au comptant',
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
                                            columns: [
                                                {
                                                    width: '80%',
                                                    stack: [
                                                        {
                                                            text:      'Acompte à la signature de 30% du net à payer',
                                                            alignment: 'right',
                                                        },
                                                        {
                                                            text:      'Solde à verser à la fin du chantier',
                                                            alignment: 'right',
                                                        },
                                                    ],
                                                },
                                                {
                                                    width: '*',
                                                    stack: [
                                                        {
                                                            text:      this.formatPrice( this._file.quotation.remainderToPay * 0.3 ),
                                                            alignment: 'right',
                                                            bold:      true,

                                                        },
                                                        {
                                                            text:      this.formatPrice( this._file.quotation.remainderToPay * 0.7 ),
                                                            alignment: 'right',
                                                            bold:      true,

                                                        },
                                                    ],
                                                },
                                            ],
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
                ...this._getBorderLayout(),
                paddingTop:    function () {
                    return 5;
                },
                paddingBottom: function () {
                    return 45;
                },
            },
        };
    }

    private _generateSignature: Content = {
        margin:     [ 0, 25, 0, 0 ],
        lineHeight: 2,
        fontSize:   10,
        stack:      [
            {
                columns: [
                    {
                        width: '50%',
                        stack: [
                            {
                                text: 'Technicien conseil :',
                            },
                            {
                                text: 'Fait à :',
                            },
                            {
                                text: 'Le :',
                            },
                        ],
                    },
                    {
                        width: '*',
                        stack: [
                            {
                                text: 'DEVIS N° AA9-20360822T1752-PO',
                            },
                            {
                                text: [
                                    'Signature du client avec la mention ',
                                    { text: '"bon pour commande"', bold: true },
                                    ' :',
                                ],
                            },
                            {
                                text: 'Fait à :',
                            },
                            {
                                text: 'Le :',
                            },
                        ],
                    },
                ],
            },
            'Conditions générales de vente et bon de rétractation au verso',
        ],
    };

    private _getTableLayout(): CustomTableLayout {
        {
            return {
                hLineWidth:    function ( i, node ) {
                    return ( i === 0 || i === node.table.body.length ) ? 1 : 0;
                },
                vLineWidth:    function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 0;
                    }
                    return ( i === 0 || i === node.table.widths.length ) ? 1 : 0;
                },
                hLineColor:    function ( i, node ) {
                    return ( i === 0 || i === node.table.body.length ) ? GREEN : 'black';
                },
                vLineColor:    function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 'white';
                    }
                    return ( i === 0 || i === node.table.widths.length ) ? GREEN : 'black';
                },
                paddingTop:    function ( i ) {
                    if ( i === 1 ) {
                        return 10;
                    }
                    return 2;
                },
                paddingBottom: function ( i ) {
                    if ( i === 0 ) {
                        return 2;
                    }
                    return 10;
                },
                fillColor:     function ( rowIndex ) {
                    if ( rowIndex === 0 ) {
                        return BLUE;
                    }
                },
                fillOpacity:   function ( rowIndex ) {
                    if ( rowIndex === 0 ) {
                        return 0.35;
                    }
                },
            };
        }
    }

    private _getBorderLayout(): CustomTableLayout {
        return {
            hLineWidth:    function ( i, node ) {
                return ( i === 0 || i === node.table.body.length ) ? 1 : 0;
            },
            vLineWidth:    function ( i, node ) {
                if ( node.table.widths === undefined ) {
                    return 0;
                }
                return ( i === 0 || i === node.table.widths.length ) ? 1 : 0;
            },
            hLineColor:    function ( i, node ) {
                return ( i === 0 || i === node.table.body.length ) ? GREEN : 'black';
            },
            vLineColor:    function ( i, node ) {
                if ( node.table.widths === undefined ) {
                    return 'white';
                }
                return ( i === 0 || i === node.table.widths.length ) ? GREEN : 'black';
            },
            paddingTop:    function ( i ) {
                if ( i === 1 ) {
                    return 10;
                }
                return 2;
            },
            paddingBottom: function ( i ) {
                if ( i === 0 ) {
                    return 2;
                }
                return 10;
            },
        };
    }
}


interface HousingItem {
    left: { label: string; value: string }[];
    right?: { label: string; value: string }[];
}
