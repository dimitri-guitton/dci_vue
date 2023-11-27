import { ceil10 } from '@/services/MathService';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PB, FILE_PG, FILE_SOL } from '@/services/constantService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { Product } from '@/types/v2/File/Common/Product';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { getCodeBonus } from '@/services/data/dataService';
import { CeePacRoValues } from '@/commands/import_cee_bonus/dist/CeePacRo';
import { CeePacRrValues } from '@/commands/import_cee_bonus/dist/CeePacRr';

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

    // On fix à 4 chiffre apres la virgule avant de faire l'arrondi, car on peut avoir des erreurs sur certain chiffre
    // Exemple 8.05 * 66 = 531.3000000000001 et donc l'arrondi est 531.31 et non 531.3
    ceeBonus = +ceeBonus.toFixed( 4 );

    return ceil10( ceeBonus, -2 );
};

/**
 * Coup de pouce
 */
export const getHelpingHandRo = ( codeBonus ): number => {
    codeBonus = codeBonus.toUpperCase();

    // Si la date du jour est supérieur ou égal au 1er novembre 2023 on applique les nouvelles valeurs
    if ( new Date() >= new Date( '2023/11/01 00:00:01' ) ) {
        if ( codeBonus === 'GP' ) {
            return 5100;
        }
        if ( codeBonus === 'P' ) {
            return 4300;
        }
        return 2700;
    }

    if ( codeBonus === 'GP' ) {
        return 4500;
    }

    if ( codeBonus === 'P' ) {
        return 4000;
    }

    return 2500;
};

const getCeeRo = ( pacs: Product[], localType: string, area: number, zone: string ): number => {
    let formatedEtas = 0;
    let formatedArea;
    const codeBonus  = getCodeBonus();
    let formatedCodeBonus;

    let etas = 0;
    for ( const pac of pacs ) {
        if ( pac.etas !== undefined && pac.etas > 0 ) {
            etas = pac.etas;
        }
    }

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

    if ( codeBonus !== null && codeBonus.toUpperCase() === 'GP' ) {
        formatedCodeBonus = 'GP';
    } else {
        formatedCodeBonus = 'other';
    }

    const listBonus: CeePacRo = CeePacRoValues;

    try {
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
        if ( pac === undefined ) {
            continue;
        }
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

    if ( codeBonus !== null && codeBonus.toUpperCase() === 'GP' ) {
        formatedCodeBonus = 'GP';
    } else {
        formatedCodeBonus = 'other';
    }

    const listBonus: CeePacRr = CeePacRrValues;


    try {
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
    let value         = 0;

    switch ( type ) {
        // Chauffe eau thermodynamique
        case FILE_CET:
            if ( housingType === 'appartement' ) {
                if ( codeBonus === 'GP' ) {
                    value = 86.87;
                } else {
                    value = 71.40;
                }

            } else {
                if ( codeBonus === 'GP' ) {
                    // value = 113.88;
                    value = 118.56;
                } else {
                    // value = 93.60;
                    value = 98.28;
                }
            }
            break;
        // Comble
        case FILE_COMBLE:
            if ( data.partner === 'obj_eco_energie' ) {
                // CEE A PARTIR DU 15 MARS 2023
                if ( new Date() > new Date( '2023/03/15 00:00:01' ) ) {
                    if ( energyZone === 'H1' ) {
                        value = 1.7 * 6;
                    } else {
                        value = 1.4 * 6;
                    }
                } else {
                    if ( energyZone === 'H1' ) {
                        value = 1.7 * 5.7;
                    } else {
                        value = 1.4 * 5.7;
                    }
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

    // Si de type COMBLE OU SOL on arrondit après car on multiplie la prime par la surface
    switch ( type ) {
        case FILE_COMBLE:
        case FILE_SOL:
            return value;
    }

    return roundCeeBonus( value );
};

const getRoMaPrimeRenov = ( totalTTC: number, cee: number, codeBonus: string ): number => {
    // const amountGp = 5000;
    const amountGp = 4000;
    // const amountP  = 4000;
    const amountP  = 3000;
    // const amountIt = 3000;
    const amountIt = 2000;

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
        // return 3000;
        return 2500;
    }
    if ( codeBonus === 'P' ) {
        // return 2500;
        return 2000;
    }

    if ( codeBonus === 'IT' ) {
        // return 1500;
        return 1000;
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

