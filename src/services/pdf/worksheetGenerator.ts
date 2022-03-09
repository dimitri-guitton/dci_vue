import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CombleWorkSheet } from '@/types/v2/File/Comble/CombleWorkSheet';
import { BROWN, DARK } from '@/services/pdf/pdfVariable';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import CombleList from '@/types/v2/File/Comble/CombleList';
import { CombleQuotation } from '@/types/v2/File/Comble/CombleQuotation';
import { CetWorkSheet } from '@/types/v2/File/Cet/CetWorkSheet';
import { CetList } from '@/types/v2/File/Cet/CetList';
import { CetQuotation } from '@/types/v2/File/Cet/CetQuotation';
import SolList from '@/types/v2/File/Sol/SolList';
import RoList from '@/types/v2/File/Ro/RoList';
import RrList from '@/types/v2/File/Rr/RrList';
import PgList from '@/types/v2/File/Pg/PgList';
import { SolQuotation } from '@/types/v2/File/Sol/SolQuotation';
import { RrQuotation } from '@/types/v2/File/Rr/RrQuotation';
import { SolWorkSheet } from '@/types/v2/File/Sol/SolWorkSheet';
import { RoWorkSheet } from '@/types/v2/File/Ro/RoWorkSheet';
import { RrWorkSheet } from '@/types/v2/File/Rr/RrWorkSheet';
import { PgWorkSheet } from '@/types/v2/File/Pg/PgWorkSheet';
import { AllFile, AllQuotation } from '@/types/v2/File/All';
import { getAddress } from '@/services/data/dataService';

export class WorksheetGenerator extends PdfGenerator {
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
        this.type  = PdfType.Worksheet;

        this.docDefinition = this._generateDocDefinition();

    }

    private _generateDocDefinition(): TDocumentDefinitions {
        return {
            content: [
                this._generateHeader(),
                this._generateSubHeader(),
                this._generateBody(),
                this._generateFooter(),
            ],
            styles:  this._style,
        };
    }

    private _generateHeader(): Content {
        let technician = 'VENDEUR : ';
        if ( this._file.technician !== undefined ) {
            technician += `${ this._file.technician.firstName } ${ this._file.technician.lastName }`;
        }
        return {
            style:  [ 'text' ],
            table:  {
                widths: [ '50%', '*' ],
                body:   [
                    [
                        'FICHE VISITE TECHNIQUE POUR POELE',
                        'N° DEVIS ECO À RAPPELER LORS DE LA PRISE DE RDV',
                    ],
                    [
                        'CARTE BTP : COMMERCIAL (NON CONCERNÉ)',
                        this._file.ref,
                    ],
                    [
                        technician,
                        `DATE DE VISITE : ${ this._file.quotation.dateTechnicalVisit }`,
                    ],
                    [
                        `PÉRIODE DE POSE SOUHAITÉE : ${ this._file.worksheet.period }`,
                        `CATÉGORIE DU CLIENT : ${ this._file.codeBonus }`,
                    ],
                ],
            },
            layout: {
                hLineWidth:    function ( i, node ) {
                    return ( i === 0 || i === node.table.body.length ) ? 2 : 0;
                },
                vLineWidth:    function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 0;
                    }
                    return ( i === 0 || i === node.table.widths.length ) ? 2 : 0;
                },
                hLineColor:    function ( i, node ) {
                    return ( i === 0 || i === node.table.body.length ) ? DARK : 'white';
                },
                vLineColor:    function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 'white';
                    }
                    return ( i === 0 || i === node.table.widths.length ) ? DARK : 'white';
                },
                fillColor:     function () {
                    return BROWN;
                },
                paddingTop:    function ( i ) {
                    if ( i === 0 ) {
                        return 10;
                    }
                    return 2;
                },
                paddingBottom: function ( i, node ) {
                    if ( node.table.widths === undefined ) {
                        return 0;
                    }

                    if ( i === ( node.table.widths.length + 1 ) ) {
                        return 10;
                    }
                    return 2;
                },
            },
        };
    }

    private _generateSubHeader(): Content {
        const beneficiary = this._file.beneficiary;
        const housing     = this._file.housing;

        // On récup l'adresse
        const { address, zipCode, city } = getAddress( this._file );

        return {
            style:      [ 'xsText' ],
            margin:     [ 0, 10 ],
            lineHeight: 1.2,
            table:      {
                widths: [ '50%', '*' ],
                body:   [
                    [
                        {
                            text:    'CHANTIER NOM ET PRÉNOM DU CLIENT FINAL :',
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        `TEL : ${ beneficiary.phone }`,
                        `PORTABLE : ${ beneficiary.mobile }`,
                    ],
                    [
                        {
                            text:    `ADRESSE MAIL CLIENT : ${ beneficiary.email }`,
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    `ADRESSE CHANTIER : ${ address }`,
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        {
                            text:    `CP : ${ zipCode }`,
                            colSpan: 2,
                        },
                        {},
                    ],
                    [
                        `SITUATION : ${ housing.buildingNature }`,
                        `VILLE : ${ city }`,
                    ],
                ],
            },
            layout:     'noBorders',
        };
    }

    private _generateBody(): Content {
        const body: Content[] = [];
        for ( const data of this._parseWorksheet( this._file.type ) ) {
            body.push( this._createTitle( data.title ) );
            body.push( this._createItems( data.items ) );
        }

        return body;
    }

    private _generateFooter(): Content {
        return [
            {
                style: 'text',
                stack: [
                    this._createTitle( ' COMPLÉMENT D\'INFORMATION (INDIQUER RAS SI PAS DE COMMENTAIRE)' ),
                    this._file.worksheet.infosSup,
                    {
                        margin:  [ 0, 15, 0, 0 ],
                        columns: [
                            {
                                width: '50%',
                                text:  'Nom et signature du technicien :',
                            },
                            {
                                width: '*',
                                text:  'Nom et signature du client :',
                            },
                        ],
                    },
                ],
            },
        ];
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

    private _createItems( items: WorksheetItem[] ): Content {
        const tableBody: ( string | number )[][] = [];
        let tmpTable: ( string | number )[]      = [];
        let index                                = 0;

        for ( const item of items ) {
            tmpTable.push( item.label );
            tmpTable.push( item.value );
            index++;

            if ( index === 2 ) {
                tableBody.push( tmpTable );
                tmpTable = [];
                index    = 0;
            }
        }

        return {
            style:  'table',
            table:  {
                widths: [ '30%', '20%', '30%', '20%' ],
                body:   tableBody,
            },
            layout: 'noBorders',
        };
    }

    private _parseWorksheet( type: string ): ParsedWorksheet[] {
        let data: ParsedWorksheet[] = [];
        const housing               = this._file.housing;
        let worksheet: CombleWorkSheet | SolWorkSheet | RoWorkSheet | RrWorkSheet | CetWorkSheet | PgWorkSheet;
        let list: CombleList | SolList | RoList | RrList | CetList | PgList;
        let quotation: AllQuotation;
        let selectedProduct         = '';

        switch ( type ) {
            case FILE_COMBLE:
                worksheet = ( this._file.worksheet as CombleWorkSheet );
                list      = ( this._file.lists as CombleList );
                quotation = ( this._file.quotation as CombleQuotation );

                console.log( 'Options -->', quotation.options );

                if ( quotation.selectedProducts.length > 0 ) {
                    selectedProduct = quotation.selectedProducts[ 0 ].label;
                }

                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'VISITE DES COMBLES',
                                value: this.yesOrNo( worksheet.visiteComble ),
                            },
                            {
                                label: 'NIVEAUX HABITATION',
                                value: this.getValueInList( list.niveauHabitationList, worksheet.niveauHabitation ),
                            },
                            {
                                label: 'CHANTIER HABITE',
                                value: this.yesOrNo( worksheet.chantierHabite ),
                            },
                            {
                                label: 'GRANDE ECHELLE NECESSAIRE',
                                value: this.yesOrNo( worksheet.gdEchelle ),
                            },
                            {
                                label: 'TYPE CHANTIER',
                                value: this.getValueInList( list.chantierTypeList, worksheet.chantierType ),
                            },
                            {
                                label: 'PARTIE A ISOLER',
                                value: this.getValueInList( list.partieAIsolerList, worksheet.partieAisoler ),
                            },
                            {
                                label: 'DEMANDE DE VOIRIE / ACCES PL',
                                value: this.yesOrNo( worksheet.accesPl ),
                            },
                            {
                                label: 'PUISSANCE COMPTEUR',
                                value: worksheet.puissanceCompteur,
                            },
                            {
                                label: 'ACCES COMBLES',
                                value: worksheet.accesComble,
                            },
                            {
                                label: 'RUE ETROITE(sens unique)',
                                value: this.yesOrNo( worksheet.rueEtroite ),
                            },
                            {
                                label: 'TYPE COUVERTURE',
                                value: this.getValueInList( list.couvertureTypeList, worksheet.couvertureType ),
                            },
                            {
                                label: 'ETAT TOITURE',
                                value: this.getValueInList( list.etatToitureList, worksheet.etatToiture ),
                            },
                            {
                                label: 'TYPE CHARPENTE',
                                value: this.getValueInList( list.chantierTypeList, worksheet.charpenteType ),
                            },
                            {
                                label: 'NOMBRE COMPARTIMENTS COMBLES',
                                value: worksheet.nbCompartimentComble,
                            }, {
                                label: 'PRESENCE VOLIGE',
                                value: this.yesOrNo( worksheet.volige ),
                            },
                            {
                                label: 'NOMBRE ACCES AUX COMBLES',
                                value: worksheet.nbAccesComble,
                            },

                        ],
                    },
                    {
                        title: 'PRESTATIONS COMMANDEES',
                        items: [
                            {
                                label: 'SURFACE A ISOLER',
                                value: housing.area,
                            },
                            {
                                label: 'PRODUIT COMMANDE',
                                value: selectedProduct,
                            },
                            {
                                label: 'ANCIENNE ISOLATION',
                                value: this.yesOrNo( worksheet.isolationExistante ),
                            },
                            {
                                label: 'TYPE ANCIENNE ISOLATION',
                                value: this.getValueInList( list.isolationExistanteTypeList, worksheet.isolationExistanteType ),
                            },
                            {
                                label: 'ENLEVEMENT DE L\'EXISTANT',
                                value: this.yesOrNo( quotation.options[ 0 ].number > 0 ),
                            },
                            {
                                label: 'SURFACE À RETIRER',
                                value: quotation.options[ 0 ].number,
                            },
                            {
                                label: 'Nbre de couches',
                                value: worksheet.isolationExistanteCouches,
                            },
                            {
                                label: 'REMISE DE L\'EXISTANT',
                                value: this.yesOrNo( quotation.options[ 1 ].number > 0 ),
                            },
                            {
                                label: 'SURFACE À REMETTRE',
                                value: quotation.options[ 1 ].number,
                            },
                            {
                                label: 'LARDAGE PARE VAPEUR',
                                value: this.yesOrNo( worksheet.lardagePareVapeur ),
                            },
                            {
                                label: 'CREATION TROU D\'HOMME',
                                value: quotation.options[ 2 ].number,
                            },
                            {
                                label: 'REHAUSSE DE TRAPPE',
                                value: quotation.options[ 6 ].number,
                            },
                            {
                                label: 'TYPE DE TRAPPE',
                                value: this.getValueInList( list.rehausseTrappeTypeList, worksheet.rehausseTrappeType ),
                            }, {
                                label: 'ISOLATION DE LA TRAPPE',
                                value: quotation.options[ 7 ].number,
                            },
                            {
                                label: 'ENTOURAGE CHEMINEE',
                                value: quotation.options[ 8 ].number,
                            },
                            {
                                label: 'PROTECTION DES SPOTS',
                                value: this.yesOrNo( quotation.options[ 9 ].number > 0 ),
                            },
                            {
                                label: 'NBRE DE SPOTS',
                                value: quotation.options[ 9 ].number,
                            },
                            {
                                label: 'ENTOURAGE VOLETS ROULANTS',
                                value: this.yesOrNo( quotation.options[ 3 ].number > 0 || quotation.options[ 3 ].number > 0 ),
                            },
                            {
                                label: 'LONG < 1.50m',
                                value: quotation.options[ 3 ].number,
                            },
                            {
                                label: 'LONG > 1.50m',
                                value: quotation.options[ 4 ].number,
                            },
                            {
                                label: 'DESENCOMBREMENT COMBLES',
                                value: this.yesOrNo( worksheet.desencombrement ),
                            },
                            {
                                label: 'ENTOURAGE VMC',
                                value: quotation.options[ 5 ].number,
                            },
                            {
                                label: 'ARRÊTOIRAS EN POLYRO',
                                value: quotation.options[ 11 ].number,
                            },
                        ],
                    },
                ];
                break;
            case FILE_SOL:
                worksheet = ( this._file.worksheet as SolWorkSheet );
                list      = ( this._file.lists as SolList );
                quotation = ( this._file.quotation as SolQuotation );

                if ( quotation.selectedProducts.length > 0 ) {
                    selectedProduct = quotation.selectedProducts[ 0 ].label;
                }

                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'PRODUIT COMMANDE',
                                value: selectedProduct,
                            },
                            {
                                label: 'Epaisseur',
                                value: worksheet.epaisseurProduit,
                            },
                            {
                                label: 'SURFACE A ISOLER',
                                value: housing.area,
                            },
                            {
                                label: 'Hauteur sous plafond',
                                value: worksheet.hautPlafond,
                            },
                            {
                                label: 'Support',
                                value: this.getValueInList( list.supportList, worksheet.support ),
                            },
                            {
                                label: 'Resistance thermique',
                                value: worksheet.resistTherm,
                            },
                            {
                                label: 'Dimensions pièce 1',
                                value: worksheet.epaisseurProduit,
                            },
                            {
                                label: 'Dimensions pièce 1',
                                value: worksheet.dimensionsPieces[ 0 ],
                            },
                            {
                                label: 'Dimensions pièce 2',
                                value: worksheet.dimensionsPieces[ 1 ],
                            },
                            {
                                label: 'Dimensions pièce 3',
                                value: worksheet.dimensionsPieces[ 2 ],
                            },
                            {
                                label: 'Dimensions pièce 4',
                                value: worksheet.dimensionsPieces[ 3 ],
                            },
                            {
                                label: 'Dimensions pièce 5',
                                value: worksheet.dimensionsPieces[ 4 ],
                            },
                            {
                                label: 'Dimensions pièce 6',
                                value: worksheet.dimensionsPieces[ 5 ],
                            },
                            {
                                label: 'ISOLATION EXISTANTE',
                                value: this.yesOrNo( worksheet.isolationExistante ),
                            },
                            {
                                label: 'Distance camion <-> point d\'eau',
                                value: worksheet.distPointEau,
                            },

                        ],
                    },
                    {
                        title: 'TYPOLOGIE DU CHANTIER',
                        items: [
                            {
                                label: 'NIVEAUX HABITATION',
                                value: this.getValueInList( list.niveauHabitationList, worksheet.niveauHabitation ),
                            },
                            {
                                label: 'Habitation sur un local non chauffé (garage, cave)',
                                value: this.yesOrNo( worksheet.habitationSurLocalFroid ),
                            },
                            {
                                label: 'Vide sinataire',
                                value: this.yesOrNo( worksheet.videSanitaire ),
                            },
                            {
                                label: 'Terre plein',
                                value: this.yesOrNo( worksheet.terrePlein ),
                            },
                            {
                                label: 'Y\'a t\'il des réseaux au plafond\nLes réseaux seront pris dans la mousse',
                                value: this.yesOrNo( worksheet.reseauPlafond ),
                            },
                            {
                                label: 'Y\'a t\'il des luminaires au plafond',
                                value: this.yesOrNo( worksheet.luminairesPlafond ),
                            },
                            {
                                // TODO prévoir une option fullWith (colspan = 4)
                                label: 'Une réservation sear faite autour du luminaires sauf si idéalement, le client l\'abaisse de 12 cm',
                                value: ' ',
                            },
                            {
                                label: 'Quelle distance y\'a-t-il entre le haut des portes et le plafond',
                                value: ' ',
                            },
                            {
                                label: 'Dimensions pièce 1',
                                value: worksheet.epaisseurProduit,
                            },
                            {
                                label: 'Dimensions pièce 1',
                                value: worksheet.distancePortesPalfond[ 0 ],
                            },
                            {
                                label: 'Dimensions pièce 2',
                                value: worksheet.distancePortesPalfond[ 1 ],
                            },
                            {
                                label: 'Dimensions pièce 3',
                                value: worksheet.distancePortesPalfond[ 2 ],
                            },
                            {
                                label: 'Dimensions pièce 4',
                                value: worksheet.distancePortesPalfond[ 3 ],
                            },
                            {
                                label: 'Dimensions pièce 5',
                                value: worksheet.distancePortesPalfond[ 4 ],
                            },
                            {
                                label: 'Dimensions pièce 6',
                                value: worksheet.distancePortesPalfond[ 5 ],
                            },
                            {
                                label: 'Porte de garage',
                                value: this.getValueInList( list.porteGarageList, worksheet.porteGarage ),
                            },
                            {
                                label: 'Quantité',
                                value: worksheet.nbrPorteGarage,
                            },
                        ],
                    },
                ];
                break;
            case FILE_PAC_RO:
                break;
            case FILE_PAC_RR:
                worksheet          = ( this._file.worksheet as RrWorkSheet );
                list               = ( this._file.lists as RrList );
                const rrQquotation = ( this._file.quotation as RrQuotation );

                if ( rrQquotation.selectedProducts.length > 0 ) {
                    selectedProduct = rrQquotation.selectedProducts[ 0 ].label;
                }

                const pacMono  = [
                    {
                        label: 'Distance entre le split et groupe extérieur',
                        value: worksheet.distanceGpExtUnitInt,
                    },
                    {
                        label: 'Emplacement du split',
                        value: worksheet.emplacementSplitMono,
                    },
                ];
                const pacMulti = [
                    {
                        label: 'Distance entre le split 1 et le groupe extérieur',
                        value: worksheet.distanceGpExtSplit1,
                    },
                    {
                        label: 'Distance entre le split 2 et le groupe extérieur',
                        value: worksheet.distanceGpExtSplit2,
                    },
                    {
                        label: 'Distance entre le split 3 et le groupe extérieur',
                        value: worksheet.distanceGpExtSplit3,
                    },
                    {
                        label: 'Distance entre le split 4 et le groupe extérieur',
                        value: worksheet.distanceGpExtSplit4,
                    },
                    {
                        label: 'Distance entre le split 5 et le groupe extérieur',
                        value: worksheet.distanceGpExtSplit5,
                    },
                    {
                        label: 'Emplacement du split 1',
                        value: worksheet.emplacementSplit1,
                    },
                    {
                        label: 'Emplacement du split 2',
                        value: worksheet.emplacementSplit2,
                    },
                    {
                        label: 'Emplacement du split 3',
                        value: worksheet.emplacementSplit3,
                    },
                    {
                        label: 'Emplacement du split 4',
                        value: worksheet.emplacementSplit4,
                    },
                    {
                        label: 'Emplacement du split 5',
                        value: worksheet.emplacementSplit5,
                    },
                ];

                const pacOtherInfo = rrQquotation.rrType === 'multi' ? pacMulti : pacMono;

                // TODO TERMINER FICHE
                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'Vsite des comble',
                                value: this.yesOrNo( worksheet.visiteComble ),
                            },
                            {
                                label: 'NIVEAUX HABITATION',
                                value: this.getValueInList( list.niveauHabitationList, worksheet.niveauHabitation ),
                            },
                            {
                                label: 'Chantier Habité',
                                value: this.yesOrNo( worksheet.chantierHabite ),
                            },
                            {
                                label: 'Type de chantier',
                                value: this.getValueInList( list.typeChantierList, worksheet.typeChantier ),
                            },
                            {
                                label: 'GRANDE ECHELLE NECESSAIRE',
                                value: this.yesOrNo( worksheet.grandeEchelle ),
                            },
                            {
                                label: 'Accès des combles',
                                value: this.getValueInList( list.accesCombleList, worksheet.accesComble ),
                            },
                            {
                                label: 'NOMBRE COMPARTIMENTS COMBLES',
                                value: worksheet.nbCompartimentComble,
                            },
                            {
                                label: 'NOMBRE ACCES AUX COMBLES',
                                value: worksheet.nbAccesComble,
                            },
                            {
                                label: 'Distance entre le compteur électrique et la PAC',
                                value: worksheet.distanceCompteurPac,
                            },
                            {
                                label: 'TYPE COUVERTURE',
                                value: this.getValueInList( list.typeCouvertureList, worksheet.typeCouverture ),
                            },
                            {
                                label: 'TYPE CHARPENTE',
                                value: this.getValueInList( list.typeCharpenteList, worksheet.typeCharpente ),
                            },
                            {
                                label: 'RUE ETROITE / sens unique',
                                value: this.yesOrNo( worksheet.rueEtroite ),
                            },
                            {
                                label: 'ETAT TOITURE',
                                value: this.getValueInList( list.etatToitureList, worksheet.etatToiture ),
                            },
                            {
                                label: 'PRESENCE VOLIGE',
                                value: this.yesOrNo( worksheet.presenceVolige ),
                            },
                            {
                                label: 'NATURE DES MURS EXTERIEURS',
                                value: this.getValueInList( list.natureMurExtList, worksheet.natureMurExt ),
                            },
                            {
                                label: 'NATURE DU PLAFOND',
                                value: this.getValueInList( list.naturePlafondList, worksheet.naturePlafond ),
                            },
                            {
                                label: 'TENSION DISPONIBLE',
                                value: this.getValueInList( list.tensionDisponibleList,
                                                            housing.availableVoltage === undefined ? '' : housing.availableVoltage ),
                            },
                            {
                                label: 'PUISSANCE COMPTEUR',
                                value: this.getValueInList( list.puissanceCompteurList, worksheet.puissanceCompteur ),
                            },

                            {
                                label: 'Nombre de pompe de relevage',
                                value: worksheet.nbPompeRelevage,
                            },
                            {
                                label: 'Emplacement du groupe extérieur',
                                value: worksheet.emplacementGrpExt,
                            },
                            {
                                label: 'Position groupe exterieur',
                                value: this.getValueInList( list.positionEauChaudeList, worksheet.positionEauChaude ),
                            },
                            {
                                label: 'À quelle hauteur du sol',
                                value: worksheet.hauteurDuSol,
                            },
                            ...pacOtherInfo,

                        ],
                    },
                ];
                break;
            case FILE_CET:
                worksheet = ( this._file.worksheet as CetWorkSheet );
                list      = ( this._file.lists as CetList );
                quotation = ( this._file.quotation as CetQuotation );

                if ( quotation.selectedProducts.length > 0 ) {
                    selectedProduct = quotation.selectedProducts[ 0 ].label;
                }

                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'TYPE DE BATIMENT',
                                value: this.getValueInList( list.localTypeList, housing.type ),
                            },
                            {
                                label: 'ANNÉE DE CONSTRUCTION',
                                value: housing.constructionYear === null ? 'Non renseigné' : housing.constructionYear.toString(),
                            },
                            {
                                label: 'TYPE CHANTIER',
                                value: this.getValueInList( list.typeChantierList, worksheet.typeChantier ),
                            },
                            {
                                label: 'ZONE GEOGRAPHIQUE',
                                value: this._file.energyZone,
                            },
                            {
                                label: 'VISITE DES COMBLES',
                                value: this.yesOrNo( worksheet.visiteComble ),
                            },
                            {
                                label: 'NIVEAUX HABITATION',
                                value: this.getValueInList( list.niveauHabitationList, worksheet.niveauHabitation ),
                            },
                            {
                                label: 'CHANTIER HABITE',
                                value: this.yesOrNo( worksheet.chantierHabite ),
                            },
                            {
                                label: 'GRANDE ECHELLE NECESSAIRE',
                                value: this.yesOrNo( worksheet.grandeEchelle ),
                            },
                            {
                                label: 'DEMANDE DE VOIRIE / ACCES PL',
                                value: this.yesOrNo( worksheet.demandeVoirie ),
                            },
                            {
                                label: 'DISTANCE COMPTEUR ELECTRIQUE - CHAUFFE EAU',
                                value: worksheet.distanceCompteurCet,
                            },
                            {
                                label: 'ACCES COMBLES',
                                value: this.getValueInList( list.accesCombleList, worksheet.accesComble ),
                            },
                            {
                                label: 'RUE ETROITE(sens unique)',
                                value: this.yesOrNo( worksheet.rueEtroite ),
                            },
                            {
                                label: 'TYPE COUVERTURE',
                                value: this.getValueInList( list.typeCouvertureList, worksheet.typeCouverture ),
                            },
                            {
                                label: 'ETAT TOITURE',
                                value: this.getValueInList( list.etatToitureList, worksheet.etatToiture ),
                            },
                            {
                                label: 'TYPE CHARPENTE',
                                value: this.getValueInList( list.typeCharpenteList, worksheet.typeCharpente ),
                            },
                            {
                                label: 'NOMBRE COMPARTIMENTS COMBLES',
                                value: worksheet.nbCompartimentComble,
                            }, {
                                label: 'PRESENCE VOLIGE',
                                value: this.yesOrNo( worksheet.presenceVolige ),
                            },
                            {
                                label: 'NOMBRE ACCES AUX COMBLES',
                                value: worksheet.nbAccesComble,
                            },
                            {
                                label: 'NATURE DES MURS EXTERIEURS',
                                value: this.getValueInList( list.natureMurExtList, worksheet.natureMurExt ),
                            },
                            {
                                label: 'NATURE DU PLAFOND',
                                value: this.getValueInList( list.naturePlafondList, worksheet.naturePlafond ),
                            },
                            {
                                label: 'TENSION DISPONIBLE',
                                value: this.getValueInList( list.tensionDisponibleList, worksheet.tensionDisponible ),
                            },
                            {
                                label: 'DISJONCTEUR 30mA',
                                value: this.yesOrNo( worksheet.disjoncteur ),
                            },
                            {
                                label: 'PUISSANCE COMPTEUR',
                                value: worksheet.puissanceCompteur,
                            },
                            {
                                label: 'EMPLACEMENT DU CHAUFFE EAU (OU DE LA CHAUDIÈRE) EXISTANTE',
                                value: worksheet.emplacementCetExistante,
                            },
                            {
                                label: 'EMPLACEMENT DU CHAUFFE EAU THERMODYNAMIQUE',
                                value: worksheet.emplacementCetNew,
                            },
                        ],
                    },
                    {
                        title: 'PRESTATIONS COMMANDEES',
                        items: [
                            {
                                label: 'PRODUIT COMMANDE',
                                value: selectedProduct,
                            },
                            {
                                label: 'TYPE D\'INSTALLATION',
                                value: this.getValueInList( list.aspirationTypeList, worksheet.aspirationType ),
                            },
                            {
                                label: 'BALLON FIXÉ AU MUR',
                                value: this.yesOrNo( worksheet.ballonFixeMur ),
                            },
                            {
                                label: 'UNITÉ EXTERIEUR FIXÉE AU MUR',
                                value: this.yesOrNo( worksheet.uniteExtFixeMur ),
                            },
                            {
                                label: 'DISTANCE ENTRE LE BALLON ET L’UNITÉ EXTERIEUR',
                                value: worksheet.distanceBallonUnitExt,
                            },
                        ],
                    },
                ];
                break;
            case FILE_PG:
                break;
        }

        return data;
    }
}

interface ParsedWorksheet {
    title: string;
    items: WorksheetItem[];
}

interface WorksheetItem {
    label: string;
    value: string | number;
}
