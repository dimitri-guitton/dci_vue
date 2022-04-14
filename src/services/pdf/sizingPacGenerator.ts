import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { PAC_DIMENSION } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getAddress } from '@/services/data/dataService';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { RoAlgo } from '@/services/algorithm/RoAlgo';

export class SizingPacGenerator extends PdfGenerator {
    private readonly _file: RoFile | RrFile;

    private _style: StyleDictionary = {
        title:   {
            fontSize:  11,
            bold:      true,
            alignment: 'center',
            margin:    [ 0, 15 ],
        },
        table:   { fontSize: 8 },
        text:    { fontSize: 8 },
        xsText:  { fontSize: 7 },
        xxsText: { fontSize: 6 },
    };


    constructor( file: RoFile | RrFile ) {
        super();
        this._file = file;
        this.type  = PdfType.SizingPac;

        this.docDefinition = this._generateDocDefinition();
    }


    private _generateDocDefinition(): TDocumentDefinitions {
        const housing: PacHousing = this._file.housing as PacHousing;
        const roAlgo              = new RoAlgo( housing );

        const { address, zipCode, city } = getAddress( this._file );

        const deltaT     = roAlgo.calcDeltaT( housing.setPointTemperature, housing.climaticZone, housing.altitude );
        let altitudeText = '0 à 200m';
        switch ( +housing.altitude ) {
            case 201:
                altitudeText = '201 à 400m';
                break;
            case 401:
                altitudeText = '401 à 600m';
                break;
            case 601:
                altitudeText = '600 à 801m';
                break;
            case 801:
                altitudeText = '801 à 1000m';
                break;
        }

        let heaterText = '';

        const prefix = `${ this.getValueInList( this._file.lists.heatersList, housing.heaters ) } :`;


        switch ( housing.heaters ) {
            case 'r_fonte':
            case 'r_fonte_p_chauffant':
                heaterText = 'Nous préconisons l\'installation d\'une pompe à chaleur haute température.\n';
                break;
            case 'r_autre':
            case 'p_chauffant':
            case 'r_autre_p_chauffant':
            case 'p_chauffant_p_chauffant':
                heaterText = 'Nous préconisons l\'installation d\'une pompe à chaleur moyenne température.\n';
                break;
        }

        heaterText = `${ prefix } ${ heaterText }`;

        let powerPacText = '';
        switch ( housing.heaters ) {
            case 'r_fonte':
            case 'r_fonte_p_chauffant':
                powerPacText = `Départ d’eau 65°C -> Puissance calorifique à ${ roAlgo.getBaseTemperature( housing.climaticZone,
                                                                                                           housing.altitude ) }°C : ${ roAlgo.getRealPowerUnitExt() }KW`;
                break;
            case 'r_autre':
            case 'r_autre_p_chauffant':
                powerPacText = `Départ d’eau 55°C -> Puissance calorifique à ${ roAlgo.getBaseTemperature( housing.climaticZone,
                                                                                                           housing.altitude ) }°C : ${ roAlgo.getRealPowerUnitExt() }KW`;
                break;
            case 'p_chauffant':
            case 'p_chauffant_p_chauffant':
                powerPacText = `Départ d’eau 40°C -> Puissance calorifique à ${ roAlgo.getBaseTemperature( housing.climaticZone,
                                                                                                           housing.altitude ) }°C : ${ roAlgo.getRealPowerUnitExt() }KW`;
                break;
        }


        // for ( const product of this._file.quotation.selectedProducts ) {
        //     if ( product.productType === 'pac_rr' || product.productType === 'pac_ro' ) {
        //         if ( product.label.toLowerCase().includes( 'unite exterieure' ) ) {
        //             const regex = /Puissance calorifique.*/gm;
        //             let m;
        //
        //             while ( ( m = regex.exec( product.description ) ) !== null ) {
        //                 if ( m.index === regex.lastIndex ) {
        //                     regex.lastIndex++;
        //                 }
        //
        //                 m.forEach( ( match, groupIndex ) => {
        //                     if ( groupIndex === 0 ) {
        //                         powerPacText = match;
        //                     }
        //                 } );
        //             }
        //         }
        //     }
        // }

        return {
            content: [
                {
                    // unbreakable: true,
                    stack: [
                        {
                            margin:    [ 0, 5, 0, 5 ],
                            text:      'Note de dimensionnement',
                            bold:      true,
                            fontSize:  16,
                            alignment: 'center',
                        },
                        {
                            text:      `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }`,
                            fontSize:  12,
                            alignment: 'center',
                        },
                        {
                            text:      `${ address } ${ zipCode } ${ city }`,
                            fontSize:  12,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 10, 0, 5 ],
                            text:      'Déperdition = G x V x Delta T',
                            fontSize:  18,
                            bold:      true,
                            alignment: 'center',
                        },
                        {
                            text:      `Température de consigne : ${ housing.setPointTemperature }°c`,
                            italics:   true,
                            fontSize:  10,
                            alignment: 'center',
                        },
                        {
                            text:      `Zone climatique: ${ housing.climaticZone }`,
                            italics:   true,
                            fontSize:  10,
                            alignment: 'center',
                        },
                        {
                            text:      `Altitude: ${ altitudeText }`,
                            italics:   true,
                            fontSize:  10,
                            alignment: 'center',
                        },
                        {
                            text:      `Donc le delta T est de : ${ housing.setPointTemperature } - (${ roAlgo.getBaseTemperature( housing.climaticZone,
                                                                                                                                   housing.altitude ) })`,
                            italics:   true,
                            fontSize:  10,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 5, 0, 15 ],
                            text: `Déperdition = ${ housing.buildingCoefficient } x ${ housing.area * housing.ceilingHeight } x ${ deltaT } = ${ roAlgo.calcRequiredPower(
                                housing ) } KW`,
                            fontSize:  18,
                            alignment: 'center',
                        },
                        this._addPages,
                        {
                            lineHeight: 1.2,
                            margin:     [ 48, -20, 0, 0 ],
                            fontSize:   11,
                            color:      '#323232',
                            text:       [
                                'Température d\'arrêt de la PAC : -25°c\n',
                                'Les déperditions concernent les pièces du logement desservies par le réseau de chauffage.\n',
                                heaterText,
                                powerPacText,
                            ],
                        },
                    ],
                },
            ],
            styles:  this._style,
        };
    }

    private _addPages: Content[] = [
        {
            margin: [ 0, 0, 0, 0 ],
            image:  PAC_DIMENSION,
            fit:    [ 575, 575 ],
        },
    ];
}
