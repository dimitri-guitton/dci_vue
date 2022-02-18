import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ItemList } from '@/types/v2/File/Common/ItemList';

export class PdfGenerator {
    private _docDefinition: TDocumentDefinitions;
    private readonly _defaultDocDefinition: TDocumentDefinitions;

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

        console.log( 'Default DocDefinition -->', this._defaultDocDefinition );
    }

    public generatePdf() {
        // Parametre par défaut de tout les PDF

        console.log( '%c DOC DEFINTION', 'background: #CEFF00; color: #000000' );
        console.log( this._docDefinition );
        console.log( { ...this._docDefinition, ...this._defaultDocDefinition } );
        console.log( '%c DOC DEFINTION', 'background: #CEFF00; color: #000000' );
        this._docDefinition = {
            ...this._defaultDocDefinition,
            ...this._docDefinition,
            styles: {
                ...this._defaultDocDefinition.styles,
                ...this._docDefinition.styles,
            },
        };
        console.log( 'NEW DOC DEF', this._docDefinition );


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

        pdf.vfs = pdfFonts.pdfMake.vfs;
        pdf.createPdf( this._docDefinition ).open();
    }


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
}
