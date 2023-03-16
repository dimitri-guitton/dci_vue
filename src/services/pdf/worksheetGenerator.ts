import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { CombleWorkSheet } from '@/types/v2/File/Comble/CombleWorkSheet';
import { BROWN, DARK } from '@/services/pdf/pdfVariable';
import {
    FILE_CET,
    FILE_CET_TYPE,
    FILE_COMBLE,
    FILE_COMBLE_TYPE,
    FILE_PAC_RO,
    FILE_PAC_RO_TYPE,
    FILE_PAC_RR,
    FILE_PAC_RR_TYPE,
    FILE_PB,
    FILE_PB_TYPE,
    FILE_PG,
    FILE_PG_TYPE,
    FILE_PV,
    FILE_PV_TYPE,
    FILE_SOL,
    FILE_SOL_TYPE,
} from '@/services/constantService';
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
import { RoQuotation } from '@/types/v2/File/Ro/RoQuotation';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { ProfitabilityStudyGenerator } from '@/services/pdf/profitabilityStudyGenerator';
import { PbWorkSheet } from '@/types/v2/File/Pb/PbWorkSheet';
import PbList from '@/types/v2/File/Pb/PbList';

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

    generatePdf() {
        if ( this._file.type === FILE_PV ) {
            const profitabilityStudyGenerator = new ProfitabilityStudyGenerator( this._file );
            profitabilityStudyGenerator.generatePdf();

            // On génère une fiche que si infoSup n'est pas vide et différent de RAS
            if ( !( this._file.worksheet.infosSup !== '' && this._file.worksheet.infosSup.toUpperCase() !== 'RAS' ) ) {
                return;
            }
        }

        super.generatePdf();
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


        let type = '';
        switch ( this._file.type ) {
            case FILE_CET:
                type = FILE_CET_TYPE.name;
                break;
            case FILE_SOL:
                type = FILE_SOL_TYPE.name;
                break;
            case FILE_COMBLE:
                type = FILE_COMBLE_TYPE.name;
                break;
            case FILE_PAC_RR:
                type = FILE_PAC_RR_TYPE.name;
                break;
            case FILE_PAC_RO:
                type = FILE_PAC_RO_TYPE.name;
                break;
            case FILE_PG:
                type = FILE_PG_TYPE.name;
                break;
            case FILE_PB:
                type = FILE_PB_TYPE.name;
                break;
            case FILE_PV:
                type = FILE_PV_TYPE.name;
                break;
        }

        return {
            style:  [ 'text' ],
            table:  {
                widths: [ '50%', '*' ],
                body:   [
                    [
                        `FICHE VISITE TECHNIQUE POUR ${ type.toUpperCase() }`,
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
                    [
                        `VISITE TECHNIQUE DEMANDÉ : ${ this.yesOrNo( this._file.quotation.requestTechnicalVisit ) }`,
                        this._file.quotation.requestTechnicalVisit ? `MOTIF : ${ this._file.quotation.technicalVisitReason }` : '',
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

                    if ( i === ( node.table.body.length - 1 ) ) {
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
                            text:    `CHANTIER NOM ET PRÉNOM DU CLIENT FINAL : ${ beneficiary.lastName } ${ beneficiary.firstName }`,
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

                if ( quotation.selectedProducts.length > 0 ) {
                    selectedProduct = quotation.selectedProducts[ 0 ].label;
                }

                console.log( 'Options : ', quotation.options );

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
                                value: this.getValueInList( list.chantierTypeList, worksheet.typeChantier ),
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
                                value: this.getValueInList( list.charpenteTypeList, worksheet.charpenteType ),
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
                worksheet         = ( this._file.worksheet as RoWorkSheet );
                list              = ( this._file.lists as RoList );
                const roQuotation = ( this._file.quotation as RoQuotation );
                const pacHousing  = housing as PacHousing;

                if ( roQuotation.selectedProducts.length > 0 ) {
                    for ( const product of roQuotation.selectedProducts ) {
                        selectedProduct += `- ${ product.label } \n`;
                    }
                }

                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'APPAREIL À REMPLACER',
                                value: roQuotation.deviceToReplace.type !== undefined ? roQuotation.deviceToReplace.type : '',
                            },
                            {
                                label: 'Marque',
                                value: roQuotation.deviceToReplace.brand !== undefined ? roQuotation.deviceToReplace.brand : '',
                            },
                            {
                                label: 'Modèle',
                                value: roQuotation.deviceToReplace.model !== undefined ? roQuotation.deviceToReplace.model : '',
                            },
                            {
                                label: 'TYPE CHANTIER',
                                value: this.getValueInList( list.typeChantierList, worksheet.typeChantier ),
                            },
                            {
                                label: 'TYPE DE BATIMENT',
                                value: this.getValueInList( list.localTypeList, pacHousing.type ),
                            },
                            {
                                label: 'ANNÉE DE CONSTRUCTION',
                                value: pacHousing.constructionYear === null ? 'Non renseigné' : pacHousing.constructionYear.toString(),
                            },
                            {
                                label: 'Modèle',
                                value: roQuotation.ceilingHeight,
                            },
                            {
                                label: 'QUALITÉ ISOLATION',
                                value: this.getValueInList( list.qualiteIsolationList, pacHousing.buildingCoefficient ),
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
                                label: 'DISTANCE COMPTEUR ELECTRIQUE - PAC',
                                value: worksheet.distanceCompteurPac,
                            },
                            {
                                label: 'Accès des combles',
                                value: this.getValueInList( list.accesCombleList, worksheet.accesComble ),
                            },
                            {
                                label: 'RUE ETROITE / sens unique',
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
                                label: 'ESPACE AU SOL REQUIS POUR UNITÉ INTÉRIEUR 700*700MM (595*600MM)',
                                value: this.yesOrNo( worksheet.espaceSolRequisUnitInt ),
                            },
                            {
                                label: 'HAUTEUR REQUISE POUR L’UNITÉ INTÉRIEUR 2200 MM (1850MM)',
                                value: this.yesOrNo( worksheet.hauteurRequiseUnitInt ),
                            },
                            {
                                label: 'TYPE CHARPENTE',
                                value: this.getValueInList( list.typeCharpenteList, worksheet.typeCharpente ),
                            },
                            {
                                label: 'NOMBRE COMPARTIMENTS COMBLES',
                                value: worksheet.nbCompartimentComble,
                            },
                            {
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
                                value: this.getValueInList( list.tensionDisponibleList,
                                                            housing.availableVoltage === undefined ? '' : housing.availableVoltage ),
                            },
                            {
                                label: 'DISJONCTEUR 30mA',
                                value: this.yesOrNo( worksheet.disjoncteur ),
                            },
                            {
                                label: 'PUISSANCE COMPTEUR',
                                value: this.getValueInList( list.puissanceCompteurList, worksheet.puissanceCompteur ),
                            },
                            {
                                label: 'POSITION GROUPE EXTERIEUR',
                                value: this.getValueInList( list.positionEauChaudeList, worksheet.positionEauChaude ),
                            },
                            {
                                label: 'À QUELLE HAUTEUR DU SOL',
                                value: worksheet.hauteurDuSol,
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
                                label: 'SURFACE TOTALE A CHAUFFER',
                                value: `${ pacHousing.area } M2`,
                            },
                            {
                                label: 'TYPE DE PAC',
                                value: 'AIREAU',
                            },
                            {
                                label: 'DISTANCE GROUPE EXT / UNITE INT',
                                value: `${ worksheet.distanceGpExtUnitInt } M`,
                            },
                            {
                                label: 'NOMBRE TOTAL RADIATEUR',
                                value: worksheet.nbTotalRadiateur,
                            },
                            {
                                label: 'NOMBRE RADIATEUR THERMOSTATIQUE',
                                value: worksheet.nbRadiateurThermostatique,
                            },
                            {
                                label: 'TYPE RADIATEUR',
                                value: this.getValueInList( list.typeRadiateurList, worksheet.typeRadiateur ),
                            },
                            {
                                label: 'ESPACE AU SOL REQUIS POUR UNITÉ INTÉRIEUR 700*700MM (595*600MM)',
                                value: this.yesOrNo( worksheet.espaceSolRequisUnitInt ),
                            },
                            {
                                label: 'HAUTEUR REQUISE POUR L’UNITÉ INTÉRIEUR 2200 MM (1850MM)',
                                value: this.yesOrNo( worksheet.hauteurRequiseUnitInt ),
                            },
                            {
                                label: 'POSITION GROUPE EXTERIEUR',
                                value: this.getValueInList( list.positionEauChaudeList, worksheet.positionEauChaude ),
                            },
                            {
                                label: 'HAUTEUR DU SOL',
                                value: `${ worksheet.hauteurDuSol } M`,
                            },
                            {
                                label: '',
                                value: '',
                            },
                        ],
                    },
                ];
                break;
            case FILE_PAC_RR:
                worksheet          = ( this._file.worksheet as RrWorkSheet );
                list               = ( this._file.lists as RrList );
                const rrQuotation  = ( this._file.quotation as RrQuotation );
                const pacRrHousing = housing as PacHousing;

                if ( rrQuotation.selectedProducts.length > 0 ) {
                    for ( const product of rrQuotation.selectedProducts ) {
                        selectedProduct += `- ${ product.label } \n`;
                    }
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

                const pacMono2 = [
                    {
                        label: 'EMPLACEMENT DU SPLIT',
                        value: worksheet.emplacementSplitMono,
                    },
                    {
                        label: 'DISTANCE DU SPLIT DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtUnitInt,
                    },
                ];

                const pacMulti2 = [
                    {
                        label: 'EMPLACEMENT DU SPLIT 1',
                        value: worksheet.emplacementSplit1,
                    },
                    {
                        label: 'EMPLACEMENT DU SPLIT 2',
                        value: worksheet.emplacementSplit2,
                    },
                    {
                        label: 'EMPLACEMENT DU SPLIT 3',
                        value: worksheet.emplacementSplit3,
                    },
                    {
                        label: 'EMPLACEMENT DU SPLIT 4',
                        value: worksheet.emplacementSplit4,
                    },
                    {
                        label: 'EMPLACEMENT DU SPLIT 5',
                        value: worksheet.emplacementSplit5,
                    },
                    {
                        label: 'DISTANCE DU SPLIT 1 DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtSplit1,
                    },
                    {
                        label: 'DISTANCE DU SPLIT 2 DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtSplit2,
                    },
                    {
                        label: 'DISTANCE DU SPLIT 3 DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtSplit3,
                    },
                    {
                        label: 'DISTANCE DU SPLIT 4 DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtSplit4,
                    },
                    {
                        label: 'DISTANCE DU SPLIT 5 DU GROUPE EXTÉRIEUR',
                        value: worksheet.distanceGpExtSplit5,
                    },
                ];

                const pacOtherInfo  = rrQuotation.rrType === 'multi' ? pacMulti : pacMono;
                const pacOtherInfo2 = rrQuotation.rrType === 'multi' ? pacMulti2 : pacMono2;

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
                                label: 'NOMBRE DE POMPE DE RELEVAGE',
                                value: worksheet.nbPompeRelevage,
                            },
                            {
                                label: 'EMPLACEMENT DU GROUPE EXTÉRIEUR',
                                value: worksheet.emplacementGrpExt,
                            },
                            {
                                label: 'POSITION GROUPE EXTERIEUR',
                                value: this.getValueInList( list.positionEauChaudeList, worksheet.positionEauChaude ),
                            },
                            {
                                label: 'À QUELLE HAUTEUR DU SOL',
                                value: worksheet.hauteurDuSol,
                            },
                            ...pacOtherInfo,

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
                                label: 'SURFACE TOTALE A CHAUFFER',
                                value: `${ pacRrHousing.area } M2`,
                            },
                            {
                                label: 'TYPE DE PAC',
                                value: `AIR / AIR ${ rrQuotation.rrType }`,
                            },
                            {
                                label: 'EMPLACEMENT GROUPE EXTERIEUR',
                                value: worksheet.emplacementGrpExt,
                            },
                            ...pacOtherInfo2,
                            {
                                label: 'NOMBRE POMPES DE RELEVAGES',
                                value: worksheet.nbPompeRelevage,
                            },
                            {
                                label: 'HAUTEUR DU SOL',
                                value: `${ worksheet.hauteurDuSol } M`,
                            },
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
            case FILE_PB:
            case FILE_PG:
                worksheet = ( this._file.worksheet as PgWorkSheet | PbWorkSheet );
                list      = ( this._file.lists as PgList | PbList );

                const noCreationItems: WorksheetItem[] = [];
                if ( !worksheet.creation ) {
                    noCreationItems.push(
                        {
                            label: 'matériau',
                            value: worksheet.conduiteMateriau,
                        },
                        {
                            label: 'diametre',
                            value: `${ worksheet.conduiteDiametre } mm`,
                        },
                        {
                            label: 'Longueur total',
                            value: `${ worksheet.longueurTotal } m`,
                        },
                        {
                            label: 'longeur de projection horizontal',
                            value: worksheet.longeurProjection,
                        },
                        {
                            label: 'Nombre de coude à 90°',
                            value: worksheet.nbCoude90,
                        },
                        {
                            label: 'Nombre de coude à 45°',
                            value: worksheet.nbCoude45,
                        },
                        {
                            label: 'Réduction de section',
                            value: this.yesOrNo( worksheet.reductionSection ),
                        },
                        {
                            label: 'Le conduit est-il en bon état et bien fixé',
                            value: this.yesOrNo( worksheet.etat ),
                        },
                        {
                            label: 'Le conduit est-il démontable',
                            value: this.yesOrNo( worksheet.demontable ),
                        },
                        {
                            label: 'Distance de sécurité par rapport à des matériaux combustibles (mm)',
                            value: `${ worksheet.distanceSecuriteCombustible } mm`,
                        },
                        {
                            label: 'Type',
                            value: this.getValueInList( list.conduitList, worksheet.conduitType ),
                        },
                        {
                            label: 'Matériaux constitutifs',
                            value: worksheet.conduitMateriauConstitutif,
                        },
                        {
                            label: 'Présence d\'une plaque signalétique de conduit',
                            value: this.yesOrNo( worksheet.plaqueSignaletique ),
                        },
                        {
                            label: 'Classe température (ex T 450°)',
                            value: worksheet.classeTemperature,
                        },
                        {
                            label: 'Classe de pression (N)',
                            value: `${ worksheet.classePression } N`,
                        },
                        {
                            label: 'Résistance à la corrosion',
                            value: this.yesOrNo( worksheet.resistanceCorrosion ),
                        },
                        {
                            label: 'Résistance aux condensats',
                            value: this.getValueInList( list.resistanceList, worksheet.resistanceCondansat ),
                        },
                        {
                            label: 'Présence d\'un trappe de ramonage',
                            value: this.yesOrNo( worksheet.presenceTrappe ),
                        },
                        {
                            label: 'Résistance aux feu de cheminée',
                            value: `${ worksheet.resistanceFeu } G`,
                        },
                        {
                            label: 'Distance de sécurité par rapport aux matériaux combustibles',
                            value: `${ worksheet.distanceSecuriteCombustible } mm`,
                        },
                    );
                }

                data = [
                    {
                        title: 'CARACTERISTIQUES DU CHANTIER',
                        items: [
                            {
                                label: 'Le chantier est unecréation complète',
                                value: this.yesOrNo( worksheet.creation ),
                            },
                            {
                                label: 'TYPE DE BATIMENT',
                                value: this.getValueInList( list.localTypeList, housing.type ),
                            },
                            {
                                label: 'ANNÉE DE CONSTRUCTION',
                                value: housing.constructionYear === null ? 'Non renseigné' : housing.constructionYear.toString(),
                            },
                            {
                                label: 'NIVEAUX HABITATION',
                                value: this.getValueInList( list.niveauHabitationList, worksheet.niveauHabitation ),
                            },
                        ],
                    },
                    {
                        title: 'PRODUCTION DE CHALEUR',
                        items: [
                            {
                                label: 'générateur',
                                value: this.getValueInList( list.generateurList, worksheet.generateur ),
                            },
                            {
                                label: 'Puissance',
                                value: `${ this._file.energyZone } KW`,
                            },
                            {
                                label: 'Marque',
                                value: worksheet.marque,
                            },
                            {
                                label: 'modèle',
                                value: worksheet.modele,
                            },
                            ...noCreationItems,
                        ],
                    },
                    {
                        title: 'CARACTÉRISTIQUES DE L\'EXISTANT',
                        items: [
                            {
                                label: 'Hauteur total',
                                value: `${ worksheet.hauteurTotal } m`,
                            },
                            {
                                label: 'Hauteur dans locaux chauffés',
                                value: `${ worksheet.hauteurLocauxChauffe } m`,
                            },
                            {
                                label: 'Hauteur dans locaux non chauffés',
                                value: `${ worksheet.hauteurLocauxNonChauffe } m`,
                            },
                            {
                                label: 'Hauteur extérieure',
                                value: `${ worksheet.hauteurExterieur } m`,
                            },
                            {
                                label: 'Section conduit largeur',
                                value: `${ worksheet.sectionConduitLargeur } mm`,
                            },
                            {
                                label: 'Section conduit longeur',
                                value: `${ worksheet.sectionConduitLongeur } mm`,
                            },
                            {
                                label: 'Section conduit diametre',
                                value: `${ worksheet.sectionConduitDiametre } mm`,
                            },
                            {
                                label: 'Y\'a-t-il des dévoiements',
                                value: this.yesOrNo( worksheet.devoiement ),
                            },
                            {
                                label: 'Distance entre les 2 dévoiement',
                                value: `${ worksheet.distanceDevoiement } m`,
                            },
                            {
                                label: 'Le conduit est-il isolé',
                                value: this.yesOrNo( worksheet.conduitIsole ),
                            },
                        ],
                    },
                    {
                        title: 'DÉBOUCHÉ EN TOITURE',
                        items: [
                            {
                                label: 'Le débouché dépasse t\'il d\'au moins 40cm au dessus du fraîtage',
                                value: this.yesOrNo( worksheet.deboucheSup40 ),
                            },
                            {
                                label: 'Présende d\'un obstacle à moins de 8m',
                                value: this.yesOrNo( worksheet.obstacleInf8 ),
                            },
                            {
                                label: 'Le débouché est-il accessible',
                                value: this.yesOrNo( worksheet.deboucheAccessible ),
                            },
                            {
                                label: 'Type de débouché',
                                value: this.getValueInList( list.typeDeboucheList, worksheet.typeDebouche ),
                            },
                            {
                                label: 'Toiture',
                                value: this.getValueInList( list.toitureList, worksheet.toiture ),
                            },
                        ],
                    },
                    {
                        title: 'FUTUR LOCAL À POELE',
                        items: [
                            {
                                label: 'Dans quel pièce du logement',
                                value: `${ worksheet.pieceLogement } m`,
                            },
                            {
                                label: 'Longeur',
                                value: `${ worksheet.pieceLongueur } m`,
                            },
                            {
                                label: 'Largeur',
                                value: `${ worksheet.pieceLargeur } m`,
                            },
                            {
                                label: 'Hauteur',
                                value: `${ worksheet.pieceHauteur } m`,
                            },
                            {
                                label: 'Surface',
                                value: `${ worksheet.pieceSurface } m2`,
                            },
                            {
                                label: 'Accès (portes) largeur',
                                value: `${ worksheet.accesPorteLargeur } m`,
                            },
                            {
                                label: 'Accès (portes) hauteur',
                                value: `${ worksheet.accesPorteHauteur } m`,
                            },
                            {
                                label: 'Y\'a t-il un escalier',
                                value: this.yesOrNo( worksheet.escalier ),
                            },
                            {
                                label: 'Largeur de l\'escalier',
                                value: `${ worksheet.escalierLargeur } m`,
                            },
                            {
                                label: 'Nature des murs',
                                value: worksheet.natureMur,
                            },
                            {
                                label: 'Nature des sols',
                                value: worksheet.natureSol,
                            },
                            {
                                label: 'Nature du plafond',
                                value: worksheet.naturePlafond,
                            },
                            {
                                label: 'Prise électrique',
                                value: `${ worksheet.priseElec } ml`,
                            },
                            {
                                label: '\'a-t-il une amenée d\'air dans la piece de l\'appereil',
                                value: this.yesOrNo( worksheet.ameneeAir ),
                            },
                        ],
                    },

                ];
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
