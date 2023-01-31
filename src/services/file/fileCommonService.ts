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

    // On fix à 4 chiffre apres la virgule avant de faire l'arrondi car on peut avoir des erreur sur certain chiffre
    // Exemple 8.05 * 66 = 531.3000000000001 et donc l'arrondi est 531.31 et non 531.3
    ceeBonus = +ceeBonus.toFixed( 4 );

    return ceil10( ceeBonus, -2 );
};

/**
 * Coup de pouce
 */
export const getHelpingHandRo = ( codeBonus, deviceToReplace ): number => {
    codeBonus = codeBonus.toUpperCase();
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( '%c KO', 'background: #fdd835; color: #000000' );
    console.log( deviceToReplace );

    if ( codeBonus === 'GP' || codeBonus === 'P' ) {
        // chaudière fioul
        if ( deviceToReplace === 'CFHC' ) {
            console.log( '%c IN', 'background: #00FF2E; color: #000000' );
            return 5000;
        }
        console.log( '%c ELSE', 'background: #7F4CFF; color: #000000' );

        return 4000;
    } else {
        // chaudière fioul
        if ( deviceToReplace === 'CFHC' ) {
            console.log( '%c IN', 'background: #00FF2E; color: #000000' );
            return 4000;
        }
        console.log( '%c ELSE', 'background: #7F4CFF; color: #000000' );

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

    console.log( 'PACS -->', pacs );
    console.log( 'ETAS -->', etas );
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
                        other: 61.18,
                        GP:    67.62,
                    },
                    35:  {
                        other: 85.652,
                        GP:    94.668,
                    },
                    60:  {
                        other: 122.36,
                        GP:    135.24,
                    },
                    70:  {
                        other: 146.832,
                        GP:    162.288,
                    },
                    90:  {
                        other: 183.54,
                        GP:    202.86,
                    },
                    110: {
                        other: 232.484,
                        GP:    256.956,
                    },
                    130: {
                        other: 305.9,
                        GP:    338.1,
                    },
                },
                120: {
                    0:   {
                        other: 75.43,
                        GP:    83.37,
                    },
                    35:  {
                        other: 105.602,
                        GP:    116.718,
                    },
                    60:  {
                        other: 150.86,
                        GP:    166.74,
                    },
                    70:  {
                        other: 181.032,
                        GP:    200.088,
                    },
                    90:  {
                        other: 226.29,
                        GP:    250.11,
                    },
                    110: {
                        other: 286.634,
                        GP:    316.806,
                    },
                    130: {
                        other: 377.15,
                        GP:    416.85,
                    },
                },
            },
            'maison_individuelle': {
                110: {
                    0:   {
                        other: 126.16,
                        GP:    139.44,
                    },
                    70:  {
                        other: 176.624,
                        GP:    195.216,
                    },
                    90:  {
                        other: 252.32,
                        GP:    278.88,
                    },
                    110: {
                        other: 277.552,
                        GP:    306.768,
                    },
                    130: {
                        other: 403.712,
                        GP:    446.208,
                    },
                },
                120: {
                    0:   {
                        other: 151.81,
                        GP:    167.79,
                    },
                    70:  {
                        other: 212.534,
                        GP:    234.906,
                    },
                    90:  {
                        other: 303.62,
                        GP:    335.58,
                    },
                    110: {
                        other: 333.982,
                        GP:    369.138,
                    },
                    130: {
                        other: 485.792,
                        GP:    536.928,
                    },
                },
            },
        },
        H2: {
            appartement:           {
                110: {
                    0:   {
                        other: 50.16,
                        GP:    55.44,
                    },
                    35:  {
                        other: 70.224,
                        GP:    106.26,
                    },
                    60:  {
                        other: 100.32,
                        GP:    110.88,
                    },
                    70:  {
                        other: 120.384,
                        GP:    133.056,
                    },
                    90:  {
                        other: 150.48,
                        GP:    166.32,
                    },
                    110: {
                        other: 190.608,
                        GP:    210.672,
                    },
                    130: {
                        other: 250.8,
                        GP:    277.2,
                    },
                },
                120: {
                    0:   {
                        other: 61.75,
                        GP:    68.25,
                    },
                    35:  {
                        other: 86.45,
                        GP:    95.55,
                    },
                    60:  {
                        other: 123.5,
                        GP:    136.5,
                    },
                    70:  {
                        other: 148.2,
                        GP:    163.8,
                    },
                    90:  {
                        other: 185.25,
                        GP:    204.75,
                    },
                    110: {
                        other: 234.65,
                        GP:    259.35,
                    },
                    130: {
                        other: 308.75,
                        GP:    341.25,
                    },
                },
            },
            'maison_individuelle': {
                110: {
                    0:   {
                        other: 103.36,
                        GP:    114.24,
                    },
                    70:  {
                        other: 144.704,
                        GP:    159.936,
                    },
                    90:  {
                        other: 206.72,
                        GP:    228.48,
                    },
                    110: {
                        other: 227.392,
                        GP:    251.328,
                    },
                    130: {
                        other: 330.752,
                        GP:    365.568,
                    },
                },
                120: {
                    0:   {
                        other: 124.26,
                        GP:    137.34,
                    },
                    70:  {
                        other: 173.964,
                        GP:    192.276,
                    },
                    90:  {
                        other: 248.52,
                        GP:    274.68,
                    },
                    110: {
                        other: 273.372,
                        GP:    302.148,
                    },
                    130: {
                        other: 397.632,
                        GP:    439.488,
                    },
                },
            },
        },
    };

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
    console.log( 'PACS -->', pacs );
    for ( const pac of pacs ) {
        if ( pac === undefined ) {
            continue;
        }
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

    // CEE A PARTIR DU 1ER OCTOBRE
    let listBonus: CeePacRr;
    if ( new Date() > new Date( '2022/10/01 00:00:01' ) ) {
        listBonus = {
            H1: {
                appartement:           {
                    '3_9': {
                        0:   {
                            other: 40.47,
                            GP:    44.73,
                        },
                        35:  {
                            other: 56.658,
                            GP:    62.622,
                        },
                        60:  {
                            other: 80.94,
                            GP:    89.46,
                        },
                        70:  {
                            other: 97.128,
                            GP:    107.352,
                        },
                        90:  {
                            other: 121.41,
                            GP:    134.19,
                        },
                        110: {
                            other: 153.786,
                            GP:    169.974,
                        },
                        130: {
                            other: 202.35,
                            GP:    223.65,
                        },
                    },
                },
                'maison_individuelle': {
                    '3_9': {
                        0:   {
                            other: 88.806,
                            GP:    98.154,
                        },
                        35:  {
                            other: 148.01,
                            GP:    163.59,
                        },
                        60:  {
                            other: 177.612,
                            GP:    196.308,
                        },
                        70:  {
                            other: 207.214,
                            GP:    229.026,
                        },
                        90:  {
                            other: 296.02,
                            GP:    327.18,
                        },
                        110: {
                            other: 325.622,
                            GP:    359.898,
                        },
                        130: {
                            other: 473.632,
                            GP:    523.488,
                        },
                    },
                    '4_3': {
                        0:   {
                            other: 91.428,
                            GP:    101.052,
                        },
                        35:  {
                            other: 152.38,
                            GP:    168.42,
                        },
                        60:  {
                            other: 182.856,
                            GP:    202.104,
                        },
                        70:  {
                            other: 213.332,
                            GP:    235.788,
                        },
                        90:  {
                            other: 304.76,
                            GP:    336.84,
                        },
                        110: {
                            other: 335.236,
                            GP:    370.524,
                        },
                        130: {
                            other: 487.616,
                            GP:    538.944,
                        },
                    },
                },
            },
            H2: {
                appartement:           {
                    '3_9': {
                        0:   {
                            other: 33.06,
                            GP:    36.54,
                        },
                        35:  {
                            other: 46.284,
                            GP:    51.156,
                        },
                        60:  {
                            other: 66.12,
                            GP:    73.08,
                        },
                        70:  {
                            other: 79.344,
                            GP:    87.696,
                        },
                        90:  {
                            other: 99.18,
                            GP:    109.62,
                        },
                        110: {
                            other: 125.628,
                            GP:    138.852,
                        },
                        130: {
                            other: 165.3,
                            GP:    182.7,
                        },
                    },
                },
                'maison_individuelle': {
                    '3_9': {
                        0:   {
                            other: 72.618,
                            GP:    80.262,
                        },
                        35:  {
                            other: 121.03,
                            GP:    133.77,
                        },
                        60:  {
                            other: 145.236,
                            GP:    160.524,
                        },
                        70:  {
                            other: 169.442,
                            GP:    187.278,
                        },
                        90:  {
                            other: 242.06,
                            GP:    267.54,
                        },
                        110: {
                            other: 266.266,
                            GP:    294.294,
                        },
                        130: {
                            other: 387.296,
                            GP:    428.064,
                        },
                    },
                    '4_3': {
                        0:   {
                            other: 74.784,
                            GP:    82.656,
                        },
                        35:  {
                            other: 124.64,
                            GP:    137.76,
                        },
                        60:  {
                            other: 149.568,
                            GP:    165.312,
                        },
                        70:  {
                            other: 174.496,
                            GP:    192.864,
                        },
                        90:  {
                            other: 249.28,
                            GP:    275.52,
                        },
                        110: {
                            other: 274.208,
                            GP:    303.072,
                        },
                        130: {
                            other: 398.848,
                            GP:    440.832,
                        },
                    },
                },
            },
        };
    } else {
        console.log( '%c IN CEE BEFORE 01/10/22', 'background: #00FF9D; color: #000000' );
        listBonus = {
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
                            other: 294.47,
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
                            other: 129.93,
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
                            other: 106.28,
                            GP:    113.16,
                        },
                        35:  {
                            other: 177.12,
                            GP:    188.6,
                        },
                        60:  {
                            other: 212.55,
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
    }


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
            // CEE A PARTIR DU 1ER OCTOBRE
            if ( new Date() > new Date( '2022/10/01 00:00:01' ) ) {
                if ( housingType === 'appartement' ) {
                    if ( codeBonus === 'GP' ) {
                        value = 49.98;
                    } else {
                        value = 45.22;
                    }

                } else {
                    if ( codeBonus === 'GP' ) {
                        value = 65.52;
                    } else {
                        value = 59.28;
                    }
                }

            } else {
                console.log( '%c IN CEE BEFORE 01/10/22', 'background: #00FF9D; color: #000000' );
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
            }

            break;
        case FILE_COMBLE:
            if ( data.partner === 'obj_eco_energie' ) {
                if ( energyZone === 'H1' ) {
                    value = 1.7 * 5.7;
                } else {
                    value = 1.4 * 5.7;
                }
            } else {
                // CEE A PARTIR DU 1ER OCTOBRE
                if ( new Date() > new Date( '2022/10/01 00:00:01' ) ) {
                    if ( energyZone === 'H1' ) {
                        if ( codeBonus === 'GP' ) {
                            value = 7.14;
                        } else {
                            value = 6.46;
                        }

                    } else {
                        if ( codeBonus === 'GP' ) {
                            value = 5.88;
                        } else {
                            value = 5.32;
                        }
                    }

                } else {
                    console.log( '%c IN CEE BEFORE 01/10/22', 'background: #00FF9D; color: #000000' );
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
                }
            }
            break;
        case FILE_SOL:
            if ( data.partner === 'obj_eco_energie' ) {
                if ( energyZone === 'H1' ) {
                    value = 1.1 * 5.7;
                } else {
                    value = 0.89 * 5.7;
                }
            } else {
                // CEE A PARTIR DU 1ER OCTOBRE
                if ( new Date() > new Date( '2022/10/01 00:00:01' ) ) {
                    if ( energyZone === 'H1' ) {
                        if ( codeBonus === 'GP' ) {
                            value = 4.62;
                        } else {
                            value = 4.18;
                        }

                    } else {
                        if ( codeBonus === 'GP' ) {
                            value = 3.738;
                        } else {
                            value = 3.382;
                        }
                    }
                } else {
                    console.log( '%c IN CEE BEFORE 01/10/22', 'background: #00FF9D; color: #000000' );
                    if ( energyZone === 'H1' ) {
                        if ( codeBonus === 'GP' ) {
                            value = 6.325;
                        } else {
                            value = 5.94;
                        }

                    } else {
                        if ( codeBonus === 'GP' ) {
                            value = 5.1175;
                        } else {
                            value = 4.806;
                        }
                    }
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
    const amountGp = 5000;
    const amountP  = 4000;
    const amountIt = 3000;

    if ( totalTTC - amountGp - cee > totalTTC * 0.1 && codeBonus === 'GP' ) {
        return amountGp;
    }
    if ( totalTTC - amountGp - cee < totalTTC * 0.1 && codeBonus === 'GP' ) {
        return totalTTC - cee - totalTTC * 0.1;
    }

    if ( totalTTC - amountP - cee > totalTTC * 0.25 && codeBonus === 'P' ) {
        return amountP;
    }
    if ( totalTTC - amountP - cee < totalTTC * 0.25 && codeBonus === 'P' ) {
        return totalTTC - cee - totalTTC * 0.25;
    }

    if ( totalTTC - amountIt - cee > totalTTC * 0.4 && codeBonus === 'IT' ) {
        return amountIt;
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

