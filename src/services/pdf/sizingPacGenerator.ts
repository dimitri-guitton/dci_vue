import { PdfGenerator, PdfType } from '@/services/pdf/pdfGenerator';
import { PAC_DIMENSION } from '@/services/pdf/pdfVariable';
import { Content, StyleDictionary, TDocumentDefinitions } from 'pdfmake/interfaces';
import { getAddress } from '@/services/data/dataService';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { FILE_PAC_RO } from '@/services/constantService';
import { RoAlgoV2 } from '@/services/algorithm/RoAlgoV2';

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
        const pacAlgo             = new PacAlgo( housing );
        const roAlgo = new RoAlgoV2( housing );

        const { address, zipCode, city } = getAddress( this._file );

        const deltaT     = pacAlgo.calcDeltaT( housing.setPointTemperature, housing.climaticZone, housing.altitude );
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

        let heaterText          = '';
        let powerPacText        = '';
        let finalText: string[] = [];

        const baseTemperature = pacAlgo.getBaseTemperature( housing.climaticZone, housing.altitude );
        if ( this._file.type === FILE_PAC_RO ) {

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

            const realPowerUnitExt = roAlgo.getRealPowerUnitExt( ( this._file as RoFile ).quotation.sizingPercentage ?? 80 );
            switch ( housing.heaters ) {
                case 'r_fonte':
                case 'r_fonte_p_chauffant':
                    powerPacText = `Température d’eau 65°C -> Puissance calorifique à ${ baseTemperature }°C : ${ realPowerUnitExt }KW`;
                    break;
                case 'r_autre':
                case 'r_autre_p_chauffant':
                    powerPacText = `Température d’eau 55°C -> Puissance calorifique à ${ baseTemperature }°C : ${ realPowerUnitExt }KW`;
                    break;
                case 'p_chauffant':
                case 'p_chauffant_p_chauffant':
                    powerPacText = `Température d’eau 40°C -> Puissance calorifique à ${ baseTemperature }°C : ${ realPowerUnitExt }KW`;
                    break;
            }

            let additionnalInfoText = '';

            if ( ( this._file as RoFile ).quotation.selectedProducts.length > 0 ) {
                let labelP1 = '';
                let labelP2 = '';
                if ( ( this._file as RoFile ).quotation.selectedProducts[ 0 ] ) {
                    labelP1 = ( this._file as RoFile ).quotation.selectedProducts[ 0 ].label;
                }

                if ( ( this._file as RoFile ).quotation.selectedProducts[ 1 ] ) {
                    labelP2 = ( this._file as RoFile ).quotation.selectedProducts[ 1 ].label;

                }

                additionnalInfoText = `Informations sur la pompe à chaleur : ${ labelP1 } + ${ labelP2 } \n`;

            }

            finalText = [
                'La pompe à chaleur doit couvrir au minimum 60 % et au maximum 110 % des déperditions de la maison à la température de base. Elle doit couvrir au moins 120 % des déperditions avec les appoints électriques.\n\n',
                additionnalInfoText,
                'Température d\'arrêt de la PAC : -25°c\n',
                'Les déperditions calculées concernent bien uniquement les pièces du logement desservies par le réseau de chauffage.\n',
                'Les déperditions sont bien calculées sans considération des éventuels autres générateurs présents dans les pièces du logement desservies par le réseau de chauffage.\n',
                heaterText,
                powerPacText,
            ];

        } else {
            finalText = [
                'La pompe à chaleur doit couvrir au minimum 120 % et au maximum 180 % des déperditions de la maison à la température de base\n',
                'Les déperditions calculées concernent bien uniquement les pièces du logement desservies par le réseau de chauffage.\n',
                'Les déperditions sont bien calculées sans considération des éventuels autres générateurs présents dans les pièces du logement desservies par le réseau de chauffage.\n',
            ];
        }

        const isRrMulti = this._file.type === 'pac_rr' && ( this._file as RrFile ).quotation.rrType === 'multi';
        return {
            content: [
                {
                    // unbreakable: true,
                    stack: [
                        {
                            margin:    [ 0, 5, 0, 2 ],
                            text:      `POMPE À CHALEUR ${ this._file.type === 'pac_rr' ? 'AIR/AIR' : 'AIR/EAU' }`,
                            bold:      false,
                            fontSize:  14,
                            alignment: 'center',
                        },
                        {
                            margin:   [ 0, 2, 0, 5 ],
                            text:      'Note de dimensionnement',
                            bold:      true,
                            fontSize: 14,
                            alignment: 'center',
                        },
                        {
                            text:      `${ this._file.beneficiary.lastName } ${ this._file.beneficiary.firstName }`,
                            fontSize: 11,
                            alignment: 'center',
                        },
                        {
                            text:      `${ address } ${ zipCode } ${ city }`,
                            fontSize: 11,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 10, 0, 5 ],
                            text:      'Déperdition = G x V x Delta T',
                            fontSize: 16,
                            bold:      true,
                            alignment: 'center',
                        },
                        {
                            text:      `Température de consigne : ${ housing.setPointTemperature }°c`,
                            italics:   true,
                            fontSize: 9,
                            alignment: 'center',
                        },
                        {
                            text:      `Zone climatique: ${ housing.climaticZone }`,
                            italics:   true,
                            fontSize: 9,
                            alignment: 'center',
                        },
                        {
                            text:      `Altitude: ${ altitudeText }`,
                            italics:   true,
                            fontSize: 9,
                            alignment: 'center',
                        },
                        {
                            text:     `Donc le delta T est de : ${ housing.setPointTemperature } - (${ baseTemperature })`,
                            italics:   true,
                            fontSize: 9,
                            alignment: 'center',
                        },
                        {
                            margin:    [ 0, 5, 0, 15 ],
                            text:      `Déperdition = ${ housing.buildingCoefficient } x ${ housing.area * housing.ceilingHeight } x ${ deltaT } = ${ pacAlgo.calcRequiredPower(
                                housing ) } KW`,
                            fontSize:  18,
                            alignment: 'center',
                        },
                        this._addMultiSizingData(),
                        this._addPages,
                        {
                            text:             ` : ${ baseTemperature } °C`,
                            absolutePosition: { x: 152, y: isRrMulti ? 512 : 502 },
                            fontSize:         12,
                        },
                        {
                            lineHeight: 1.2,
                            margin:     [ 48, -20, 0, 0 ],
                            fontSize:   8,
                            color:      '#323232',
                            text:       finalText,
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
            fit: [ 550, 550 ],
        },
    ];

    /**
     * Ajoute le dimensionnement pour les pièces pour les pac RR multi
     */
    private _addMultiSizingData = (): Content => {
        const rrMulti             = ( this._file as RrFile ).quotation.rrMulti;
        const housing: PacHousing = this._file.housing as PacHousing;
        const pacAlgo             = new PacAlgo( housing );

        const columns: Content[] = [];

        let fontSize = 8;
        if ( this._file.type === 'pac_rr' && ( this._file as RrFile ).quotation.rrType === 'multi' ) {
            for ( let i = 1; i <= rrMulti.roomNumber; i++ ) {
                columns.push(
                    {
                        text:      `Déperdition pièce ${ i } = ${ pacAlgo.calcRequiredPower( housing, eval( `rrMulti.areaP${ i }` ) )
                                                                         .toFixed( 4 ) } KW`,
                        alignment: 'center',
                    },
                );
            }
            fontSize = rrMulti.roomNumber > 3 ? 7 : 8;
        }


        return {
            margin:  [ 0, 0, 0, 0 ],
            fontSize,
            columns: columns,
        };
    };
}
