import * as pdfMake from 'pdfmake/build/pdfmake';
import { TCreatedPdf } from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ItemList } from '@/types/v2/File/Common/ItemList';
import { savePdf } from '@/services/folder/folderService';
import { numberToPrice } from '@/services/commonService';

export enum PdfType {
    Undefined,
    Address,
    Worksheet,
    Quotation
}

export class PdfGenerator {
    private _docDefinition: TDocumentDefinitions;
    private readonly _defaultDocDefinition: TDocumentDefinitions;
    protected type: number;

    constructor() {
        this._defaultDocDefinition = {
            pageSize:    'A4',
            pageMargins: [ 10, 10, 10, 10 ],
            styles:      {
                icon:    { font: 'Fontello' },
                table:   { fontSize: 9 },
                text:    { fontSize: 9 },
                xsText:  { fontSize: 8 },
                xxsText: { fontSize: 7 },
            },
            content:     [],
        };
        this._docDefinition        = {
            content: [],
        };
        this.type                  = PdfType.Undefined;
    }

    /**
     * Génère le PDF
     */
    public generatePdf() {
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
        };

        pdf.vfs          = pdfFonts.pdfMake.vfs;
        const createdPdf = pdf.createPdf( this._docDefinition );
        this.downloadPdf( createdPdf );
        this.openPdf( createdPdf );
    }

    private openPdf( pdf: TCreatedPdf ) {
        pdf.open();
    }

    private downloadPdf( pdf: TCreatedPdf ) {
        pdf.getBuffer( ( buffer ) => {
            savePdf( buffer, this.type );
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

    protected formatPhone( value: string ): string {
        const cleaned = ( '' + value ).replace( /\D/g, '' );
        const match   = cleaned.match( /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/ );
        if ( match ) {
            return `${ match[ 1 ] }.${ match[ 2 ] }.${ match[ 3 ] }.${ match[ 4 ] }.${ match[ 5 ] }`;
        }
        return ' ';
    }

    protected formatPrice( value: number | string ): string {
        return numberToPrice( value );
    }
}
