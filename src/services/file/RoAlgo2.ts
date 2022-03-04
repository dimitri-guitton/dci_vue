import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

/**
 * Altitude suivi de la température de base
 */
interface CoefTemperatureItem {
    0: number;
    201: number;
    401: number;
    601: number;
    801: number;
}

interface CoefTemperature {
    B: CoefTemperatureItem;
    C: CoefTemperatureItem;
    D: CoefTemperatureItem;
    E: CoefTemperatureItem;
}

/**
 * Sortie en KW de la PAC
 * -7 -> A -7°C
 * -15 -> A -15°C
 */
interface UnitExtOutput {
    '-7': number;
    '-15': number;
}

/**
 * output selon la température de l'eau de la PAC
 * 65 -> 65°C
 * 55 -> 55°C
 * 40 -> 40°C
 */
interface UnitExt {
    ref: string;
    size: number;
    output: {
        65: UnitExtOutput;
        55: UnitExtOutput;
        40: UnitExtOutput;
    };
}

/**
 * List des PAC par tension
 */
interface UnitExtList {
    monophase: UnitExt[];
    triphase: UnitExt[];
}

interface UnitIntList {
    monophase: UnitInt[];
    triphase: UnitInt[];
}

interface UnitInt {
    ref: string;
    size: number;
    hotWaterTank: number;
    bizone: boolean;
}

/**
 * Retourne le niveau de tempéature que peut gérer le type de radiateur
 * @param heater
 */
const heaterToValue = ( heater: string ): number => {
    if ( heater === 'r_fonte' || heater === 'r_fonte_p_chauffant' ) {
        return 65;
    }

    if ( heater === 'r_autre' || heater === 'r_autre_p_chauffant' ) {
        return 55;
    }

    if ( heater === 'p_chauffant' ) {
        return 40;
    }

    if ( heater === 'r_fonte_p_chauffant' ) {
        return 65;
    }

    return 0;
};

/**
 * Retourne si oui ou non la PAC doit être un Bi Zone selon les radiatieurs
 * @param heater
 */
const isBiZone = ( heater: string ): boolean => {
    return heater === 'r_autre_p_chauffant' || heater === 'r_fonte_p_chauffant';
};

/**
 * Retourne la température de base pour DeltaT {@link calcDeltaT}
 * @param climaticZone
 * @param altitude
 */
const getBaseTemperature = ( climaticZone: string, altitude: number ): number => {
    const coef: CoefTemperature = {
        B: {
            '0':   -4,
            '201': -5,
            '401': -6,
            '601': -7,
            '801': -8,
        },
        C: {
            '0':   -5,
            '201': -6,
            '401': -7,
            '601': -8,
            '801': -9,
        },
        D: {
            '0':   -7,
            '201': -8,
            '401': -9,
            '601': -11,
            '801': -13,
        },
        E: {
            '0':   -8,
            '201': -9,
            '401': -11,
            '601': -13,
            '801': -15,
        },
    };

    if ( typeof coef[ climaticZone ] !== 'undefined' && typeof coef[ climaticZone ][ altitude ] !== 'undefined' ) {
        return coef[ climaticZone ][ altitude ];
    }

    // Par défaut on retourne -7
    console.warn( 'Coef non trouvé utilisation de la température par defaut -7' );
    return -7;
};


/**
 * Retourne le delta de la température
 * Correspond à la différence entre la température de consigne et la température de base
 * @param setPointTemperature   température de consigne (19°C ou 20°C)
 * @param climaticZone
 * @param altitude
 */
const calcDeltaT = ( setPointTemperature: number, climaticZone: string, altitude: number ): number => {
    return setPointTemperature - getBaseTemperature( climaticZone, altitude );
};

/**
 * Calcul la puissance (KW) minimal requise de la PAC
 */
const calcRequiredPower = ( housing: PacHousing ): number => {
    // Volume à chauffer
    const volume = housing.area * housing.ceilingHeight;
    console.log( 'Volume -->', volume );
    const deltaT = calcDeltaT( housing.setPointTemperature, housing.climaticZone, housing.altitude );


    console.log( 'Temp de consigne -->', housing.setPointTemperature );
    console.log( 'Zone climatique  -->', housing.climaticZone );
    console.log( 'Altitude  -->', housing.altitude );
    console.log( 'Delta T -->', deltaT );
    console.log( 'Coef de construction', housing.buildingCoefficient );

    // Puissance en W
    const power = volume * deltaT * housing.buildingCoefficient * 0.9;
    console.log( 'Power en W', power );

    // Retourne la puissance en KW
    return power / 1000;
};

export const getUnitsRo = ( housing: PacHousing, volumeECS: number ): { unitExt: UnitExt; unitInt: UnitInt } | null => {
    console.log( '%c GET PAC RO', 'background: #1EFF6C; color: #000000' );

    const requiredPower    = calcRequiredPower( housing );
    const baseTemp: number = getBaseTemperature( housing.climaticZone, housing.altitude );
    const heaterValue      = heaterToValue( housing.heaters );
    let formatedBaseTemp;
    if ( baseTemp > -7 ) {
        console.log( '%c IN', 'background: #fdd835; color: #000000' );
        formatedBaseTemp = '-7';
    } else {
        console.log( '%c ELSE', 'background: #fdd835; color: #000000' );
        formatedBaseTemp = '-15';
    }

    console.log( 'Required power', requiredPower );
    console.log( 'baseTemp', baseTemp );
    console.log( 'formatedBaseTemp', formatedBaseTemp );
    console.log( 'housing.heaters', housing.heaters );
    console.log( 'heaterValue', heaterValue );

    const pacList: UnitExtList = {
        monophase: [
            {
                ref:    'EPRA08EV3', // 70°C
                size:   8,
                output: {
                    65: {
                        '-7':  8,
                        '-15': 6.24,
                    },
                    55: {
                        '-7':  7.55,
                        '-15': 6.54,
                    },
                    40: {
                        '-7':  7.51,
                        '-15': 6.46,
                    },
                },
            },
            {
                ref:    'EPRA10EV3', // 70°C
                size:   10,
                output: {
                    65: {
                        '-7':  9.25,
                        '-15': 6.73,
                    },
                    55: {
                        '-7':  9.1,
                        '-15': 7.57,
                    },
                    40: {
                        '-7':  8.93,
                        '-15': 7.47,
                    },
                },
            },
            {
                ref:    'EPRA12EV3', // 70°C
                size:   12,
                output: {
                    65: {
                        '-7':  10.75,
                        '-15': 6.73,
                    },
                    55: {
                        '-7':  10.58,
                        '-15': 8.79,
                    },
                    40: {
                        '-7':  10.37,
                        '-15': 8.68,
                    },
                },
            },
            {
                ref:    'EPRA14EV3', // 70°C
                size:   14,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
            {
                ref:    'EPRA16EV3', // 70°C
                size:   16,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
            {
                ref:    'EPRA18EV3', // 70°C
                size:   18,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
            {
                ref:    'ERGA04EV',
                size:   4,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  4,
                        '-15': 3.94,
                    },
                    40: {
                        '-7':  5.34,
                        '-15': 4.64,
                    },
                },
            },
            {
                ref:    'ERGA06EV',
                size:   6,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  4.91,
                        '-15': 4.91,
                    },
                    40: {
                        '-7':  6.25,
                        '-15': 5.53,
                    },
                },
            },
            {
                ref:    'ERGA08EV',
                size:   8,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  6.74,
                        '-15': 6.33,
                    },
                    40: {
                        '-7':  7.29,
                        '-15': 6.53,
                    },
                },
            },
            {
                ref:    'EPGA11EV',
                size:   11,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  10.12,
                        '-15': 8.71,
                    },
                    40: {
                        '-7':  10.86,
                        '-15': 10.96,
                    },
                },
            },
            {
                ref:    'EPGA14EV',
                size:   14,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  11.38,
                        '-15': 9.80,
                    },
                    40: {
                        '-7':  12.22,
                        '-15': 12.33,
                    },
                },
            },
            {
                ref:    'EPGA16EV',
                size:   16,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  12.65,
                        '-15': 10.89,
                    },
                    40: {
                        '-7':  13.57,
                        '-15': 13.70,
                    },
                },
            },
        ],
        triphase:  [
            {
                ref:    'EPRA08EW1', // 70°C
                size:   8,
                output: {
                    65: {
                        '-7':  8,
                        '-15': 6.24,
                    },
                    55: {
                        '-7':  7.55,
                        '-15': 6.54,
                    },
                    40: {
                        '-7':  7.51,
                        '-15': 6.46,
                    },
                },
            },
            {
                ref:    'EPRA10EW1', // 70°C
                size:   10,
                output: {
                    65: {
                        '-7':  9.25,
                        '-15': 6.73,
                    },
                    55: {
                        '-7':  9.1,
                        '-15': 7.57,
                    },
                    40: {
                        '-7':  8.93,
                        '-15': 7.47,
                    },
                },
            },
            {
                ref:    'EPRA12EW1', // 70°C
                size:   12,
                output: {
                    65: {
                        '-7':  10.75,
                        '-15': 6.73,
                    },
                    55: {
                        '-7':  10.58,
                        '-15': 8.79,
                    },
                    40: {
                        '-7':  10.37,
                        '-15': 8.68,
                    },
                },
            },
            {
                ref:    'EPRA14EW1', // 70°C
                size:   14,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
            {
                ref:    'EPRA16EW1', // 70°C
                size:   16,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
            {
                ref:    'EPRA18EW1', // 70°C
                size:   18,
                output: {
                    65: {
                        '-7':  0,
                        '-15': 0,
                    },
                    55: {
                        '-7':  0,
                        '-15': 0,
                    },
                    40: {
                        '-7':  0,
                        '-15': 0,
                    },
                },
            },
        ],
    };

    // Si on ne trouve pas dans la liste la tension souhaité on retourne null
    if ( pacList[ housing.availableVoltage ] === undefined ) {
        return null;
    }

    // On filtre la liste pour trouver la PAC souhaité
    const filterredUnitExt: UnitExt[] = pacList[ housing.availableVoltage ].filter( ( pac: UnitExt ) => {
        // Si valeur de chauffage n'est pas défini
        if ( pac.output[ heaterValue ] === undefined ) {
            return false;
        }

        // On retourne la PAC que si sont output est supérieur à la puissance requise
        return pac.output[ heaterValue ][ formatedBaseTemp ] > requiredPower;
    } );

    let selectedUnitExt: UnitExt | null = null;

    if ( filterredUnitExt.length === 1 ) {
        selectedUnitExt = filterredUnitExt[ 0 ];
    } else {
        // Si il y a plus de 1 PAC on parcours les pacs et on récupère celle à la plus faible puissance (la plus proche de la puissance requise)
        for ( const unitExt of filterredUnitExt ) {
            console.log( unitExt );
            if ( selectedUnitExt === null ) {
                selectedUnitExt = unitExt;
            } else {
                if ( selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ] > unitExt.output[ heaterValue ][ formatedBaseTemp ] ) {
                    console.log( '%c IN IF ELSE', 'background: #00FF55; color: #000000' );
                    selectedUnitExt = unitExt;
                }
            }
        }
    }

    console.log( filterredUnitExt );
    console.log( selectedUnitExt );
    if ( selectedUnitExt === null ) {
        return null;
    }

    console.log( 'selectedUnitExt -->', selectedUnitExt );


    const unitIntList: UnitIntList = {
        monophase: [
            {
                ref:          'ETBH16E6V',
                size:         16,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'ETVH16S18E6V',
                size:         16,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'ETVH16S23E6V',
                size:         16,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'ETVZ16S18E6V',
                size:         16,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'ETVZ16S23E6V',
                size:         16,
                hotWaterTank: 230,
                bizone:       true,
            },
            {
                ref:          'EHBH04E6V',
                size:         4,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'EHBH08E6V',
                size:         8,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'EHVH04S18E6V',
                size:         4,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'EHVH08S18E6V',
                size:         8,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'EHVH04S23E6V',
                size:         4,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'EHVH08S23E6V',
                size:         8,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'EHVZ04S18E6V',
                size:         4,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'EHVZ08S18E6V',
                size:         8,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'EHVZ08S23E6V',
                size:         8,
                hotWaterTank: 230,
                bizone:       true,
            },
            {
                ref:          'EABH16D6V',
                size:         16,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'EAVH16S18D6V',
                size:         16,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'EAVH16S23D6V',
                size:         16,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'EAVZ16S18D6V',
                size:         16,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'EAVZ16S23D6V',
                size:         16,
                hotWaterTank: 230,
                bizone:       true,
            },
            {
                ref:          'ETBH12E6V',
                size:         12,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'ETVH12S18E6V',
                size:         12,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'ETVH12S23E6V',
                size:         12,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'ETVZ12S18E6V',
                size:         12,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'ETVZ12S23E6V',
                size:         12,
                hotWaterTank: 230,
                bizone:       true,
            },
        ],
        triphase:  [
            {
                ref:          'ETBH16E9W',
                size:         16,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'ETVH16S18E9W',
                size:         16,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'ETVH16S23E9W',
                size:         16,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'ETVZ16S18E9W',
                size:         16,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'ETVZ16S23E9W',
                size:         16,
                hotWaterTank: 230,
                bizone:       true,
            },
            {
                ref:          'ETBH12E9W',
                size:         12,
                hotWaterTank: 0,
                bizone:       false,
            },
            {
                ref:          'ETVH12S18E9W',
                size:         12,
                hotWaterTank: 180,
                bizone:       false,
            },
            {
                ref:          'ETVH12S23E9W',
                size:         12,
                hotWaterTank: 230,
                bizone:       false,
            },
            {
                ref:          'ETVZ12S18E9W',
                size:         12,
                hotWaterTank: 180,
                bizone:       true,
            },
            {
                ref:          'ETVZ12S23E9W',
                size:         12,
                hotWaterTank: 230,
                bizone:       true,
            },
        ],
    };

    // Si on ne trouve pas dans la liste la tension souhaité on retourne null
    if ( unitIntList[ housing.availableVoltage ] === undefined ) {
        return null;
    }

    const hotWater = volumeECS;
    const bizone   = isBiZone( housing.heaters );
    const size     = selectedUnitExt.size;

    // ON récupère le model intérieur selon les infos renseigné
    const filteredUnitInt = unitIntList[ housing.availableVoltage ].filter( ( unit: UnitInt ) => {
        return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.size === size;
    } );

    console.log( filteredUnitInt );
    let selectedUnitInt: UnitInt;
    if ( filteredUnitInt.length === 0 ) {
        return null;
    } else {
        selectedUnitInt = filteredUnitInt[ 0 ];
    }

    console.log( 'selectedUnitInt -->', selectedUnitInt );

    return {
        unitExt: selectedUnitExt,
        unitInt: selectedUnitInt,
    };
};

