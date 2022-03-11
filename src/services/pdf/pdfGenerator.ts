import * as pdfMake from 'pdfmake/build/pdfmake';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ContentText, TDocumentDefinitions } from 'pdfmake/interfaces';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { savePdf } from '@/services/folder/folderService';
import { numberToPrice } from '@/services/commonService';

export enum PdfType {
    Undefined,
    Address,
    Worksheet,
    Quotation,
    Tva,
    ContributionFramework,
    MaPrimeRenov,
    ProfitabilityStudy
}

export class PdfGenerator {
    private _docDefinition: TDocumentDefinitions;
    private readonly _defaultDocDefinition: TDocumentDefinitions;
    private _icons: Icons;

    protected type: number;


    constructor() {
        this._defaultDocDefinition = {
            pageSize:     'A4',
            pageMargins:  [ 10, 10, 10, 10 ],
            styles:       {
                icon:    { font: 'Fontello' },
                table:   { fontSize: 9 },
                text:    { fontSize: 9 },
                xsText:  { fontSize: 8 },
                xxsText: { fontSize: 7 },
            },
            content:      [],
            defaultStyle: {
                font: 'Roboto',
            },
        };
        this._docDefinition        = {
            content: [],
        };
        this.type                  = PdfType.Undefined;

        this._icons = {
            emptyCheckBox: { text: '', style: 'icon' },
            checkBox:      { text: '', style: 'icon' },
        };
    }

    /**
     * Build le pdf
     * @private
     */
    private buildPdf(): TCreatedPdf {
        // Parametre par défaut de tout les PDF
        this._docDefinition = {
            ...this._defaultDocDefinition,
            ...this._docDefinition,
            styles: {
                ...this._defaultDocDefinition.styles,
                ...this._docDefinition.styles,
            },
        };

        const pdf = pdfMake;

        // Set up de nos fonts
        pdf.fonts = {
            Fontello: {
                normal:      'fontello.ttf',
                bold:        'fontello.ttf',
                italics:     'fontello.ttf',
                bolditalics: 'fontello.ttf',
            },
            Roboto:   {
                normal:      'Roboto-Regular.ttf',
                bold:        'Roboto-Bold.ttf',
                italics:     'Roboto-Italic.ttf',
                bolditalics: 'Roboto-BlackItalic.ttf',
            },
            Times:    {
                normal:      'times-new-roman.ttf',
                bold:        'times-new-roman-bold.ttf',
                italics:     'times-new-roman-italic.ttf',
                bolditalics: 'times-new-roman-bold-italic.ttf',
            },
        };

        pdf.vfs = pdfFonts.pdfMake.vfs;
        return pdf.createPdf( this._docDefinition );
    }

    /**
     * Génère le PDF
     */
    public generatePdf( openAfterGenerate = true ) {
        this.downloadPdf( this.buildPdf(), openAfterGenerate );
    }

    public previewPdf() {
        this.buildPdf().open();
    }

    private downloadPdf( pdf: TCreatedPdf, openAfterGenerate = true ) {
        pdf.getBuffer( ( buffer ) => {
            savePdf( buffer, this.type, openAfterGenerate );
        } );
    }


    /**
     * Setter pour docDefinition
     * @param value
     * @protected
     */
    protected set docDefinition( value: TDocumentDefinitions ) {
        this._docDefinition = value;
    }

    /**
     * Retourne la valeur sélectionné du list
     * @param list
     * @param value
     * @protected
     */
    protected getValueInList( list: ItemList[], value: string | number ): string {
        const val = list.find( item => item.slug === value );

        if ( val ) {
            return String( val.value );
        }

        return '';
    }

    /**
     * Retourne un boolean en français
     * @param value
     * @protected
     */
    protected yesOrNo( value: boolean ): string {
        if ( value ) {
            return 'Oui';
        } else {
            return 'Non';
        }
    }

    /**
     * Formate le numéro de téléphone
     * @param value
     * @protected
     */
    protected formatPhone( value: string ): string {
        const cleaned = ( '' + value ).replace( /\D/g, '' );
        const match   = cleaned.match( /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/ );
        if ( match ) {
            return `${ match[ 1 ] }.${ match[ 2 ] }.${ match[ 3 ] }.${ match[ 4 ] }.${ match[ 5 ] }`;
        }
        return ' ';
    }

    /**
     * Formate le prix en xx.xx €
     * @param value
     * @param quantity
     * @param positiveNumber
     * @param canBeFree
     * @protected
     */
    protected formatPrice( value: number | string, quantity = 1, positiveNumber = true, canBeFree = true ): string {
        return positiveNumber ? numberToPrice( value, quantity, canBeFree ) : `- ${ numberToPrice( value, quantity, canBeFree ) }`;
    }

    /**
     * Retourne une checkBox
     * @param checked
     * @protected
     */
    protected getCheckBox( checked = false ) {
        if ( checked ) {
            return this._icons.checkBox;
        }

        return this._icons.emptyCheckBox;
    }

    /**
     * Retourne un texte en remplaçant les values souhaitées dans le texte
     * @param text
     * @param values
     * @protected
     */
    protected getTextWithValue( text: string, values: { searchValue: string; replaceValue: string }[] ): string {
        let nexText = text;
        for ( const value of values ) {
            nexText = text.replace( `{{${ value.searchValue }}}`, value.replaceValue );
        }

        return nexText;
    }
}

interface Icons {
    emptyCheckBox: ContentText;
    checkBox: ContentText;
}
