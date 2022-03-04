import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

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
 * List des unités extérieurs par tension
 */
interface UnitExtList {
    monophase: UnitExt[];
    triphase: UnitExt[];
}

/**
 * Unité intérieurs
 */
interface UnitInt {
    ref: string;
    size: number;
    hotWaterTank: number;
    bizone: boolean;
}

/**
 * Les des unités intérieurs par tension
 */
interface UnitIntList {
    monophase: UnitInt[];
    triphase: UnitInt[];
}


export class RoAlgo extends PacAlgo {
    private readonly unitExtList: UnitExtList;
    private readonly unitIntList: UnitIntList;

    constructor( housing: PacHousing ) {
        super( housing );

        this.unitExtList = {
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
        this.unitIntList = {
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
    }

    /**
     * Retourne le niveau de tempéature que peut gérer le type de radiateur
     * @param heater
     */
    private heaterToValue = ( heater: string ): number => {
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
     * Retourne si oui ou non la PAC doit être Bi Zone selon les radiatieurs
     * @param heater
     */
    private isBiZone = ( heater: string ): boolean => {
        return heater === 'r_autre_p_chauffant' || heater === 'r_fonte_p_chauffant';
    };

    public getUnitsRo = ( volumeECS: number ): { unitExt: UnitExt; unitInt: UnitInt } | null => {
        console.log( '%c GET UNITS RO', 'background: #5ADFFF; color: #000000' );
        const requiredPower: number = this.calcRequiredPower( this.housing );
        const baseTemp: number      = this.getBaseTemperature( this.housing.climaticZone, this.housing.altitude );
        const heaterValue: number   = this.heaterToValue( this.housing.heaters );

        let formatedBaseTemp: string;
        if ( baseTemp > -7 ) {
            formatedBaseTemp = '-7';
        } else {
            formatedBaseTemp = '-15';
        }

        console.log( {
                         'puissance_requise':        requiredPower,
                         'temperature_base':         baseTemp,
                         'temperature_base_formate': formatedBaseTemp,
                         'radiateurs':               this.housing.heaters,
                         'valeur_radiateurs':        heaterValue,
                     } );

        // Si on ne trouve pas dans la liste la tension souhaité on retourne null
        if ( this.unitExtList[ this.housing.availableVoltage ] === undefined ) {
            return null;
        }

        // On filtre la liste pour trouver la PAC souhaité
        const filterredUnitExt: UnitExt[] = this.unitExtList[ this.housing.availableVoltage ].filter( ( pac: UnitExt ) => {
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
                        selectedUnitExt = unitExt;
                    }
                }
            }
        }

        if ( selectedUnitExt === null ) {
            return null;
        }

        // Si on ne trouve pas dans la liste la tension souhaité on retourne null
        if ( this.unitIntList[ this.housing.availableVoltage ] === undefined ) {
            return null;
        }

        const hotWater = volumeECS;
        const bizone   = this.isBiZone( this.housing.heaters );
        const size     = selectedUnitExt.size;

        // ON récupère le model intérieur selon les infos renseigné
        const filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {
            return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.size === size;
        } );

        let selectedUnitInt: UnitInt;
        if ( filteredUnitInt.length === 0 ) {
            return null;
        } else {
            selectedUnitInt = filteredUnitInt[ 0 ];
        }

        console.log( 'PAC RO ->', {
            unitExt: selectedUnitExt,
            unitInt: selectedUnitInt,
        } );
        return {
            unitExt: selectedUnitExt,
            unitInt: selectedUnitInt,
        };
    };
}
