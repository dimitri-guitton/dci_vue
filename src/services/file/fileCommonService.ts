import { ceil10 } from '@/services/MathService';
import { FILE_CET, FILE_COMBLE, FILE_PB, FILE_PG, FILE_SOL } from '@/services/constantService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';

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


const roundCeeBonus = ( ceeBonus: number | string ): number => {

    if ( typeof ceeBonus === 'string' ) {
        ceeBonus = +ceeBonus;
    }

    return ceil10( ceeBonus, -2 );
};

export const getCeeBonus = ( data: BaseFile ): number => {
    const type        = data.type;
    const codeBonus   = data.codeBonus;
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
    }
    return roundCeeBonus( value );
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

export const getMaPrimeRenov = ( type: string, codeBonus: string ): number => {
    let value = 0;

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
    }

    return roundCeeBonus( value );
};

