import { getCodeBonus, getHousingType } from '@/services/data/dataService';
import { ceil10 } from '@/services/MathService';

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

export const getCetCeeBonus = (): number => {
    const codeBonus   = getCodeBonus();
    const housingType = getHousingType();
    console.log( '%c BUILD NATURE', 'background: #5ADFFF; color: #000000' );
    console.log( housingType );
    console.log( '%c CODE BONUS', 'background: #5ADFFF; color: #000000' );
    console.log( codeBonus );
    console.log( codeBonus === 'GP' );
    let value: number;

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

    return roundCeeBonus( value );
};
