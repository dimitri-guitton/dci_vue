import { ceil10 } from '@/services/MathService';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PB, FILE_PG, FILE_SOL } from '@/services/constantService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { Product } from '@/types/v2/File/Common/Product';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { getCodeBonus } from '@/services/data/dataService';

export const getEnergyZone = ( zipCode: number ): string => {
    const formatedZipCode = parseFloat( zipCode.toString().substr( 0, 2 ) );

    const ZONES = [
        {
            label: 'H1',
            depts: [
                1,
                2,
                3,
                5,
                8,
                10,
                14,
                15,
                19,
                21,
                23,
                25,
                27,
                28,
                38,
                39,
                42,
                43,
                45,
                51,
                52,
                54,
                55,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                67,
                68,
                69,
                70,
                71,
                73,
                74,
                75,
                76,
                77,
                78,
                80,
                87,
                88,
                89,
                90,
                91,
                92,
                93,
                94,
                95,
            ],
        },
        {
            label: 'H2',
            depts: [
                4,
                7,
                9,
                12,
                16,
                17,
                18,
                22,
                24,
                26,
                29,
                31,
                32,
                33,
                35,
                36,
                37,
                40,
                41,
                44,
                46,
                47,
                48,
                49,
                50,
                53,
                56,
                64,
                65,
                72,
                79,
                81,
                82,
                84,
                85,
                86,
            ],
        },
    ];

    const currentZone = ZONES.filter( ( zone ) => zone.depts.indexOf( formatedZipCode ) > -1 );

    return currentZone.length > 0 ? currentZone[ 0 ].label : 'H3';
};


export const roundCeeBonus = ( ceeBonus: number | string ): number => {

    if ( typeof ceeBonus === 'string' ) {
        ceeBonus = +ceeBonus;
    }

    return ceil10( ceeBonus, -2 );
};

/**
 * Coup de pouce
 */
export const getHelpingHandRo = ( codeBonus ): number => {
    if ( codeBonus === 'GP' ) {
        return 5000;
    } else if ( codeBonus === 'P' ) {
        return 4000;
    } else {
        return 2500;
    }
};

const getCeeRo = ( pacs: Product[], localType: string, area: number, zone: string ): number => {
    let formatedEtas = 0;
    let formatedArea;
    const codeBonus  = getCodeBonus();
    let formatedCodeBonus;

    let etas = 0;
    for ( const pac of pacs ) {
        console.log( 'PAC -->', pac );
        if ( pac.etas !== undefined && pac.etas > 0 ) {
            etas = pac.etas;
        }
    }

    console.log( 'formatedEtas', formatedEtas );

    if ( etas >= 110 && etas < 120 ) {
        formatedEtas = 110;
    } else if ( etas >= 120 ) {
        formatedEtas = 120;
    }

    if ( area > 0 && area < 35 ) {
        formatedArea = 0;
    }
    if ( area >= 35 && area < 60 ) {
        if ( localType === 'appartement' ) {
            formatedArea = 35;
        } else {
            formatedArea = 0;
        }
    }
    if ( area >= 60 && area < 70 ) {
        if ( localType === 'appartement' ) {
            formatedArea = 60;
        } else {
            formatedArea = 0;
        }
    }
    if ( area >= 70 && area < 90 ) {
        formatedArea = 70;
    }
    if ( area >= 90 && area < 110 ) {
        formatedArea = 90;
    }
    if ( area >= 110 && area <= 130 ) {
        formatedArea = 110;
    }
    if ( area > 130 ) {
        formatedArea = 130;
    }

    console.log( 'formatedArea', formatedArea );


    if ( codeBonus !== null && codeBonus.toUpperCase() === 'GP' ) {
        formatedCodeBonus = 'GP';
    } else {
        formatedCodeBonus = 'other';
    }


    const listBonus: CeePacRo = {
        H1: {
            appartement: {
                110: {
                    0:   {
                        other: 86.94,
                        GP:    92.575,
                    },
                    35:  {
                        other: 121.72,
                        GP:    129.605,
                    },
                    60:  {
                        other: 173.88,
                        GP:    185.15,
                    },
                    70:  {
                        other: 208.66,
                        GP:    222.18,
                    },
                    90:  {
                        other: 260.82,
                        GP:    277.725,
                    },
                    110: {
                        other: 330.37,
                        GP:    351.785,
                    },
                    130: {
                        other: 434.70,
                        GP:    462.875,
                    },
                },
                120: {
                    0:   {
                        other: 107.19,
                        GP:    114.1375,
                    },
                    35:  {
                        other: 150.07,
                        GP:    159.7925,
                    },
                    60:  {
                        other: 214.38,
                        GP:    228.275,
                    },
                    70:  {
                        other: 257.26,
                        GP:    273.93,
                    },
                    90:  {
                        other: 321.57,
                        GP:    342.4125,
                    },
                    110: {
                        other: 407.32,
                        GP:    433.7225,
                    },
                    130: {
                        other: 535.95,
                        GP:    570.6875,
                    },
                },
            },
            'maison_individuelle': {
                110: {
                    0:   {
                        other: 179.28,
                        GP:    190.9,
                    },
                    70:  {
                        other: 250.99,
                        GP:    267.26,
                    },
                    90:  {
                        other: 358.56,
                        GP:    381.8,
                    },
                    110: {
                        other: 394.42,
                        GP:    419.98,
                    },
                    130: {
                        other: 573.70,
                        GP:    610.88,
                    },
                },
                120: {
                    0:   {
                        other: 215.73,
                        GP:    229.7125,
                    },
                    70:  {
                        other: 302.02,
                        GP:    321.5975,
                    },
                    90:  {
                        other: 431.46,
                        GP:    459.425,
                    },
                    110: {
                        other: 474.61,
                        GP:    505.3675,
                    },
                    130: {
                        other: 690.34,
                        GP:    735.08,
                    },
                },
            },
        },
        H2: {
            appartement:           {
                110: {
                    0:   {
                        other: 71.28,
                        GP:    75.9,
                    },
                    35:  {
                        other: 99.79,
                        GP:    106.26,
                    },
                    60:  {
                        other: 142.56,
                        GP:    151.8,
                    },
                    70:  {
                        other: 171.07,
                        GP:    182.16,
                    },
                    90:  {
                        other: 213.84,
                        GP:    227.7,
                    },
                    110: {
                        other: 270.86,
                        GP:    288.42,
                    },
                    130: {
                        other: 356.40,
                        GP:    379.5,
                    },
                },
                120: {
                    0:   {
                        other: 87.75,
                        GP:    93.4375,
                    },
                    35:  {
                        other: 122.85,
                        GP:    130.8125,
                    },
                    60:  {
                        other: 175.50,
                        GP:    186.875,
                    },
                    70:  {
                        other: 210.60,
                        GP:    224.25,
                    },
                    90:  {
                        other: 263.25,
                        GP:    280.3125,
                    },
                    110: {
                        other: 333.45,
                        GP:    355.0625,
                    },
                    130: {
                        other: 438.75,
                        GP:    467.1875,
                    },
                },
            },
            'maison_individuelle': {
                110: {
                    0:   {
                        other: 146.88,
                        GP:    156.4,
                    },
                    70:  {
                        other: 205.63,
                        GP:    218.96,
                    },
                    90:  {
                        other: 293.76,
                        GP:    312.8,
                    },
                    110: {
                        other: 323.14,
                        GP:    344.08,
                    },
                    130: {
                        other: 470.02,
                        GP:    500.48,
                    },
                },
                120: {
                    0:   {
                        other: 176.58,
                        GP:    188.025,
                    },
                    70:  {
                        other: 247.21,
                        GP:    263.235,
                    },
                    90:  {
                        other: 353.16,
                        GP:    376.05,
                    },
                    110: {
                        other: 388.48,
                        GP:    413.655,
                    },
                    130: {
                        other: 565.06,
                        GP:    601.68,
                    },
                },
            },
        },
    };

    console.log( '%c OK', 'background: #fdd835; color: #000000' );
    console.log( '%c OK', 'background: #fdd835; color: #000000' );
    console.log( '%c OK', 'background: #fdd835; color: #000000' );
    console.log( listBonus[ 'ok' ] );

    try {
        console.log( listBonus );
        console.log( listBonus[ zone ] );
        console.log( listBonus[ zone ][ localType ] );
        console.log( listBonus[ zone ][ localType ][ formatedEtas ] );
        console.log( formatedEtas );
        return listBonus[ zone ][ localType ][ formatedEtas ][ formatedArea ][ formatedCodeBonus ];
    } catch ( e ) {
        console.warn( 'Prime CEE non trouvé ', e );
        return 0;
    }


};


const getCeeRr = ( pacs: Product[], localType: string, area: number, zone: string ): number => {
    let formatedScop = '';
    let formatedArea;
    const codeBonus  = getCodeBonus();
    let formatedCodeBonus;

    let scop = 0;
    for ( const pac of pacs ) {
        console.log( 'PAC -->', pac );
        if ( pac.scop !== undefined && pac.scop > 0 ) {
            scop = pac.scop;
        }
    }

    if ( localType === 'appartement' ) {
        if ( scop >= 3.9 ) {
            formatedScop = '3_9';
        }
    } else {
        if ( scop >= 3.9 && scop < 4.3 ) {
            formatedScop = '3_9';
        } else if ( scop >= 4.3 ) {
            formatedScop = '4_3';
        }
    }


    if ( area > 0 && area < 35 ) {
        formatedArea = 0;
    }
    if ( area >= 35 && area < 60 ) {
        formatedArea = 35;
    }
    if ( area >= 60 && area < 70 ) {
        formatedArea = 60;
    }
    if ( area >= 70 && area < 90 ) {
        formatedArea = 70;
    }
    if ( area >= 90 && area < 110 ) {
        formatedArea = 90;
    }
    if ( area >= 110 && area <= 130 ) {
        formatedArea = 110;
    }
    if ( area > 130 ) {
        formatedArea = 130;
    }
    console.log( 'CODE BONUS -->', codeBonus );

    if ( codeBonus !== null && codeBonus.toUpperCase() === 'GP' ) {
        formatedCodeBonus = 'GP';
    } else {
        formatedCodeBonus = 'other';
    }

    const listBonus: CeePacRr = {
        H1: {
            appartement:           {
                '3_9': {
                    0:   {
                        other: 57.51,
                        GP:    61.24,
                    },
                    35:  {
                        other: 80.51,
                        GP:    85.7325,
                    },
                    60:  {
                        other: 115.02,
                        GP:    122.475,
                    },
                    70:  {
                        other: 138.02,
                        GP:    146.97,
                    },
                    90:  {
                        other: 172.53,
                        GP:    183.7125,
                    },
                    110: {
                        other: 218.54,
                        GP:    232.7025,
                    },
                    130: {
                        other: 287.55,
                        GP:    306.1875,
                    },
                },
            },
            'maison_individuelle': {
                '3_9': {
                    0:   {
                        other: 126.20,
                        GP:    134.3775,
                    },
                    35:  {
                        other: 210.33,
                        GP:    223.9625,
                    },
                    60:  {
                        other: 252.40,
                        GP:    268.755,
                    },
                    70:  {
                        other: 294.46,
                        GP:    313.5475,
                    },
                    90:  {
                        other: 420.66,
                        GP:    447.925,
                    },
                    110: {
                        other: 462.73,
                        GP:    492.7175,
                    },
                    130: {
                        other: 673.06,
                        GP:    716.68,
                    },
                },
                '4_3': {
                    0:   {
                        other: 129.92,
                        GP:    138.345,
                    },
                    35:  {
                        other: 216.54,
                        GP:    230.575,
                    },
                    60:  {
                        other: 259.85,
                        GP:    276.69,
                    },
                    70:  {
                        other: 303.16,
                        GP:    322.805,
                    },
                    90:  {
                        other: 433.08,
                        GP:    461.15,
                    },
                    110: {
                        other: 476.39,
                        GP:    507.265,
                    },
                    130: {
                        other: 692.93,
                        GP:    737.84,
                    },
                },
            },
        },
        H2: {
            appartement:           {
                '3_9': {
                    0:   {
                        other: 46.98,
                        GP:    50.025,
                    },
                    35:  {
                        other: 65.77,
                        GP:    70.035,
                    },
                    60:  {
                        other: 93.96,
                        GP:    100.05,
                    },
                    70:  {
                        other: 112.75,
                        GP:    120.06,
                    },
                    90:  {
                        other: 140.94,
                        GP:    150.075,
                    },
                    110: {
                        other: 178.52,
                        GP:    190.095,
                    },
                    130: {
                        other: 234.90,
                        GP:    250.125,
                    },
                },
            },
            'maison_individuelle': {
                '3_9': {
                    0:   {
                        other: 103.19,
                        GP:    109.8825,
                    },
                    35:  {
                        other: 171.99,
                        GP:    183.1375,
                    },
                    60:  {
                        other: 206.39,
                        GP:    219.765,
                    },
                    70:  {
                        other: 240.79,
                        GP:    256.3925,
                    },
                    90:  {
                        other: 343.98,
                        GP:    366.275,
                    },
                    110: {
                        other: 378.38,
                        GP:    402.9025,
                    },
                    130: {
                        other: 550.37,
                        GP:    586.04,
                    },
                },
                '4_3': {
                    0:   {
                        other: 106.27,
                        GP:    113.16,
                    },
                    35:  {
                        other: 177.12,
                        GP:    188.6,
                    },
                    60:  {
                        other: 212.54,
                        GP:    226.32,
                    },
                    70:  {
                        other: 247.97,
                        GP:    264.04,
                    },
                    90:  {
                        other: 354.24,
                        GP:    377.2,
                    },
                    110: {
                        other: 389.66,
                        GP:    414.92,
                    },
                    130: {
                        other: 566.78,
                        GP:    603.52,
                    },
                },
            },
        },
    };

    try {
        console.log( zone );
        console.log( localType );
        console.log( formatedScop );
        console.log( formatedArea );
        console.log( formatedCodeBonus );
        console.log( listBonus );
        console.log( listBonus[ zone ] );
        console.log( listBonus[ zone ][ localType ] );
        console.log( listBonus[ zone ][ localType ][ formatedScop ] );
        console.log( formatedScop );
        return listBonus[ zone ][ localType ][ formatedScop ][ formatedArea ][ formatedCodeBonus ];
    } catch ( e ) {
        console.warn( 'Prime CEE non trouvé ', e );
        return 0;
    }
};


export const getCeeBonus = ( data: BaseFile ): number => {
    const type        = data.type;
    const codeBonus   = getCodeBonus();
    const housingType = data.housing.type;
    const energyZone  = data.energyZone;
    console.log( '%c TYPE', 'background: #5ADFFF; color: #000000' );
    console.log( type );
    console.log( '%c BUILD NATURE', 'background: #5ADFFF; color: #000000' );
    console.log( housingType );
    console.log( '%c CODE BONUS', 'background: #5ADFFF; color: #000000' );
    console.log( codeBonus );
    console.log( '%c ENERGY ZONE', 'background: #5ADFFF; color: #000000' );
    console.log( energyZone );
    let value = 0;

    switch ( type ) {
        case FILE_CET:
            if ( housingType === 'appartement' ) {
                if ( codeBonus === 'GP' ) {
                    value = 68.425;
                } else {
                    value = 64.26;
                }

            } else {
                if ( codeBonus === 'GP' ) {
                    value = 89.7;
                } else {
                    value = 84.24;
                }
            }
            break;
        case FILE_COMBLE:
            if ( energyZone === 'H1' ) {
                if ( codeBonus === 'GP' ) {
                    value = 9.775;
                } else {
                    value = 9.18;
                }

            } else {
                if ( codeBonus === 'GP' ) {
                    value = 8.05;
                } else {
                    value = 7.56;
                }
            }
            break;
        case FILE_SOL:
            if ( energyZone === 'H1' ) {
                if ( codeBonus === 'GP' ) {
                    value = 9.2;
                } else {
                    value = 8.64;
                }

            } else {
                if ( codeBonus === 'GP' ) {
                    value = 7.475;
                } else {
                    value = 7.02;
                }
            }
            break;
        case FILE_PG:
        case FILE_PB:
            if ( energyZone === 'H1' ) {
                if ( codeBonus === 'GP' ) {
                    value = 219.65;
                } else {
                    value = 206.28;
                }

            } else {
                if ( codeBonus === 'GP' ) {
                    value = 179.975;
                } else {
                    value = 169.02;
                }
            }
            break;
        case FILE_PAC_RO:
            const roData = data as RoFile;
            value        = getCeeRo( roData.quotation.selectedProducts,
                                     roData.housing.type,
                                     roData.housing.area,
                                     roData.energyZone );
            break;
        case FILE_PAC_RR:
            const rrData = data as RrFile;
            value        = getCeeRr( rrData.quotation.selectedProducts,
                                     rrData.housing.type,
                                     rrData.housing.area,
                                     rrData.energyZone );
            break;

    }

    // Si de type COMBLE OU SOL on arrondie après car on miltiplie la prime par la surface
    switch ( type ) {
        case FILE_COMBLE:
        case FILE_SOL:
            return value;
    }

    return roundCeeBonus( value );
};

const getRoMaPrimeRenov = ( totalTTC: number, cee: number, codeBonus: string ): number => {
    const amountGp = 4000;
    const amountP  = 3000;
    const amountIt = 2000;

    if ( totalTTC - amountGp - cee > totalTTC * 0.1 && codeBonus === 'GP' ) {
        return 4000;
    }
    if ( totalTTC - amountGp - cee < totalTTC * 0.1 && codeBonus === 'GP' ) {
        return totalTTC - cee - totalTTC * 0.1;
    }

    if ( totalTTC - amountP - cee > totalTTC * 0.25 && codeBonus === 'P' ) {
        return 3000;
    }
    if ( totalTTC - amountP - cee < totalTTC * 0.25 && codeBonus === 'P' ) {
        return totalTTC - cee - totalTTC * 0.25;
    }

    if ( totalTTC - amountIt - cee > totalTTC * 0.4 && codeBonus === 'IT' ) {
        return 2000;
    }
    if ( totalTTC - amountIt - cee < totalTTC * 0.4 && codeBonus === 'IT' ) {
        return totalTTC - cee - totalTTC * 0.4;
    }
    return 0;
};


const getPgMaPrimeRenov = ( codeBonus: string ): number => {
    if ( codeBonus === 'GP' ) {
        return 3000;
    }
    if ( codeBonus === 'P' ) {
        return 2500;
    }

    if ( codeBonus === 'IT' ) {
        return 1500;
    }

    return 0;
};

const getPbMaPrimeRenov = ( codeBonus: string ): number => {
    if ( codeBonus === 'GP' ) {
        return 2500;
    }
    if ( codeBonus === 'P' ) {
        return 2000;
    }

    if ( codeBonus === 'IT' ) {
        return 1000;
    }

    return 0;
};

const getCetMaPrimeRenov = ( codeBonus: string ): number => {
    if ( codeBonus === 'GP' ) {
        return 1200;
    }
    if ( codeBonus === 'P' ) {
        return 800;
    }

    if ( codeBonus === 'IT' ) {
        return 400;
    }

    return 0;
};

export const getMaPrimeRenov = ( type: string, totalTtc = 0, cee = 0 ): number => {
    const codeBonus = getCodeBonus();
    let value       = 0;

    switch ( type ) {
        case FILE_PG:
            value = getPgMaPrimeRenov( codeBonus );
            break;
        case FILE_PB:
            value = getPbMaPrimeRenov( codeBonus );
            break;
        case FILE_CET:
            value = getCetMaPrimeRenov( codeBonus );
            break;
        case FILE_PAC_RO:
            value = getRoMaPrimeRenov( totalTtc, cee, codeBonus );
            break;
    }

    return value;
};


interface CeePacItem {
    other: number;
    GP: number;
}

interface CeePacArea1 {
    0: CeePacItem;
    35: CeePacItem;
    60: CeePacItem;
    70: CeePacItem;
    90: CeePacItem;
    110: CeePacItem;
    130: CeePacItem;
}

interface CeePacArea2 {
    0: CeePacItem;
    70: CeePacItem;
    90: CeePacItem;
    110: CeePacItem;
    130: CeePacItem;
}

interface CeePacRoZone {
    appartement: {
        110: CeePacArea1;
        120: CeePacArea1;
    };
    maison_individuelle: {
        110: CeePacArea2;
        120: CeePacArea2;
    };
}

interface CeePacRrScop {
    appartement: {
        '3_9': CeePacArea1;
    };
    maison_individuelle: {
        '3_9': CeePacArea1;
        '4_3': CeePacArea1;
    };
}


interface CeePacRo {
    H1: CeePacRoZone;
    H2: CeePacRoZone;
}

interface CeePacRr {
    H1: CeePacRrScop;
    H2: CeePacRrScop;
}

