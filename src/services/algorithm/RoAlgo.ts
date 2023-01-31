import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { getProductByRef } from '@/services/data/dataService';
import { Product } from '@/types/v2/File/Common/Product';

/**
 * Sortie en KW de la PAC
 * -7 -> A -7°C
 * -15 -> A -15°C
 */
interface UnitExtOutput {
    '-15': number;
    '-13': number;
    '-11': number;
    '-9': number;
    '-8': number;
    '-7': number;
    '-6': number;
    '-5': number;
    '-4': number;
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
 * List des unités extérieures par tension
 */
interface UnitExtList {
    monophase: UnitExt[];
    triphase: UnitExt[];
}

/**
 * Unité intérieure
 */
interface UnitInt {
    ref: string;
    sizes: number[];
    highTemperature: boolean;
    hotWaterTank: number;
    bizone: boolean;
}

/**
 * Les unités intérieures par tension
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
                            '-15': 6.24,
                            '-13': 6.70,
                            '-11': 7.16,
                            '-9':  7.60,
                            '-8':  7.80,
                            '-7':  8.00,
                            '-6':  8.17,
                            '-5':  8.33,
                            '-4':  8.47,
                        },
                        55: {
                            '-15': 6.54,
                            '-13': 6.85,
                            '-11': 7.04,
                            '-9':  7.24,
                            '-8':  7.37,
                            '-7':  7.55,
                            '-6':  7.78,
                            '-5':  8.04,
                            '-4':  8.30,
                        },
                        40: {
                            '-15': 6.46,
                            '-13': 6.62,
                            '-11': 6.78,
                            '-9':  7.04,
                            '-8':  7.24,
                            '-7':  7.50,
                            '-6':  7.84,
                            '-5':  8.19,
                            '-4':  8.49,
                        },
                    },
                },
                {
                    ref:    'EPRA10EV3', // 70°C
                    size:   10,
                    output: {
                        65: {
                            '-15': 6.72,
                            '-13': 7.52,
                            '-11': 8.20,
                            '-9':  8.77,
                            '-8':  9.02,
                            '-7':  9.25,
                            '-6':  9.45,
                            '-5':  9.62,
                            '-4':  9.78,
                        },
                        55: {
                            '-15': 7.57,
                            '-13': 8.10,
                            '-11': 8.53,
                            '-9':  8.87,
                            '-8':  9.00,
                            '-7':  9.10,
                            '-6':  9.18,
                            '-5':  9.23,
                            '-4':  9.28,
                        },
                        40: {
                            '-15': 7.47,
                            '-13': 7.85,
                            '-11': 8.24,
                            '-9':  8.61,
                            '-8':  8.78,
                            '-7':  8.93,
                            '-6':  9.05,
                            '-5':  9.14,
                            '-4':  9.17,
                        },
                    },
                },
                {
                    ref:    'EPRA12EV3', // 70°C
                    size:   12,
                    output: {
                        65: {
                            '-15': 6.72,
                            '-13': 8.56,
                            '-11': 9.75,
                            '-9':  10.43,
                            '-8':  10.63,
                            '-7':  10.75,
                            '-6':  10.81,
                            '-5':  10.83,
                            '-4':  10.84,
                        },
                        55: {
                            '-15': 8.79,
                            '-13': 9.50,
                            '-11': 10.11,
                            '-9':  10.51,
                            '-8':  10.59,
                            '-7':  10.58,
                            '-6':  10.46,
                            '-5':  10.28,
                            '-4':  10.07,
                        },
                        40: {
                            '-15': 8.68,
                            '-13': 9.26,
                            '-11': 9.84,
                            '-9':  10.26,
                            '-8':  10.37,
                            '-7':  10.37,
                            '-6':  10.27,
                            '-5':  10.07,
                            '-4':  9.79,
                        },
                    },
                },
                {
                    ref:    'EPRA14DV3', // 70°C
                    size:   14,
                    output: {
                        65: {
                            '-15': 8.87,
                            '-13': 9.06,
                            '-11': 9.26,
                            '-9':  9.45,
                            '-8':  9.54,
                            '-7':  9.64,
                            '-6':  9.73,
                            '-5':  9.83,
                            '-4':  9.92,
                        },
                        55: {
                            '-15': 9.65,
                            '-13': 9.85,
                            '-11': 10.06,
                            '-9':  10.27,
                            '-8':  10.37,
                            '-7':  10.47,
                            '-6':  10.41,
                            '-5':  10.35,
                            '-4':  10.29,
                        },
                        40: {
                            '-15': 9.30,
                            '-13': 9.61,
                            '-11': 9.92,
                            '-9':  10.23,
                            '-8':  10.39,
                            '-7':  10.54,
                            '-6':  10.19,
                            '-5':  9.83,
                            '-4':  9.48,
                        },
                    },
                },
                {
                    ref:    'EPRA16DV3', // 70°C
                    size:   16,
                    output: {
                        65: {
                            '-15': 10.09,
                            '-13': 10.31,
                            '-11': 10.53,
                            '-9':  10.75,
                            '-8':  10.86,
                            '-7':  10.96,
                            '-6':  11.07,
                            '-5':  11.18,
                            '-4':  11.29,
                        },
                        55: {
                            '-15': 10.98,
                            '-13': 11.21,
                            '-11': 11.44,
                            '-9':  11.68,
                            '-8':  11.80,
                            '-7':  11.91,
                            '-6':  11.85,
                            '-5':  11.78,
                            '-4':  11.71,
                        },
                        40: {
                            '-15': 10.30,
                            '-13': 10.64,
                            '-11': 10.99,
                            '-9':  11.33,
                            '-8':  11.50,
                            '-7':  11.67,
                            '-6':  11.28,
                            '-5':  10.89,
                            '-4':  10.49,
                        },
                    },
                },
                {
                    ref:    'EPRA18DV3', // 70°C
                    size:   18,
                    output: {
                        65: {
                            '-15': 10.56,
                            '-13': 10.79,
                            '-11': 11.02,
                            '-9':  11.25,
                            '-8':  11.36,
                            '-7':  11.47,
                            '-6':  11.59,
                            '-5':  11.70,
                            '-4':  11.82,
                        },
                        55: {
                            '-15': 11.49,
                            '-13': 11.73,
                            '-11': 11.98,
                            '-9':  12.22,
                            '-8':  12.34,
                            '-7':  12.47,
                            '-6':  12.40,
                            '-5':  12.33,
                            '-4':  12.25,
                        },
                        40: {
                            '-15': 11.08,
                            '-13': 11.45,
                            '-11': 11.86,
                            '-9':  12.32,
                            '-8':  12.55,
                            '-7':  12.78,
                            '-6':  12.26,
                            '-5':  11.74,
                            '-4':  11.28,
                        },
                    },
                },
                {
                    ref:    'ERGA04EV',
                    size:   4,
                    output: {
                        65: {
                            '-15': 0,
                            '-13': 0,
                            '-11': 0,
                            '-9':  0,
                            '-8':  0,
                            '-7':  0,
                            '-6':  0,
                            '-5':  0,
                            '-4':  0,
                        },
                        55: {
                            '-15': 3.94,
                            '-13': 3.80,
                            '-11': 3.70,
                            '-9':  3.85,
                            '-8':  3.90,
                            '-7':  4.00,
                            '-6':  4.09,
                            '-5':  4.18,
                            '-4':  4.26,
                        },
                        40: {
                            '-15': 4.64,
                            '-13': 4.85,
                            '-11': 5.05,
                            '-9':  5.22,
                            '-8':  5.29,
                            '-7':  5.34,
                            '-6':  5.38,
                            '-5':  5.40,
                            '-4':  5.40,
                        },
                    },
                },
                {
                    ref:    'ERGA06EV',
                    size:   6,
                    output: {
                        65: {
                            '-15': 0,
                            '-13': 0,
                            '-11': 0,
                            '-9':  0,
                            '-8':  0,
                            '-7':  0,
                            '-6':  0,
                            '-5':  0,
                            '-4':  0,
                        },
                        55: {
                            '-15': 4.91,
                            '-13': 4.91,
                            '-11': 4.91,
                            '-9':  4.91,
                            '-8':  4.91,
                            '-7':  4.91,
                            '-6':  4.99,
                            '-5':  5.07,
                            '-4':  5.16,
                        },
                        40: {
                            '-15': 5.53,
                            '-13': 5.71,
                            '-11': 5.89,
                            '-9':  6.07,
                            '-8':  6.16,
                            '-7':  6.25,
                            '-6':  6.24,
                            '-5':  6.23,
                            '-4':  6.21,
                        },
                    },
                },
                {
                    ref:    'ERGA08EV',
                    size:   8,
                    output: {
                        65: {
                            '-15': 0,
                            '-13': 0,
                            '-11': 0,
                            '-9':  0,
                            '-8':  0,
                            '-7':  0,
                            '-6':  0,
                            '-5':  0,
                            '-4':  0,
                        },
                        55: {
                            '-15': 6.33,
                            '-13': 6.43,
                            '-11': 6.54,
                            '-9':  6.64,
                            '-8':  6.69,
                            '-7':  6.74,
                            '-6':  6.76,
                            '-5':  6.78,
                            '-4':  6.79,
                        },

                        40: {
                            '-15': 6.53,
                            '-13': 6.72,
                            '-11': 6.91,
                            '-9':  7.10,
                            '-8':  7.20,
                            '-7':  7.29,
                            '-6':  7.28,
                            '-5':  7.28,
                            '-4':  7.27,
                        },
                    },
                },
                // {
                //     ref:    'EPGA11DV',
                //     size:   11,
                //     output: {
                //         65: {
                //             '-15': 0,
                //             '-13': 0,
                //             '-11': 0,
                //             '-9':  0,
                //             '-8':  0,
                //             '-7':  0,
                //             '-6':  0,
                //             '-5':  0,
                //             '-4':  0,
                //         },
                //         55: {
                //             '-15': 8.71,
                //             '-13': 9.06,
                //             '-11': 9.42,
                //             '-9':  9.77,
                //             '-8':  9.94,
                //             '-7':  10.12,
                //             '-6':  10.18,
                //             '-5':  10.24,
                //             '-4':  10.30,
                //         },
                //         40: {
                //             '-15': 10.96,   // TODO CHANGER AVEC LES VRAIES VALEURS
                //             '-13': 10.96,
                //             '-11': 10.96,
                //             '-9':  10.96,
                //             '-8':  10.96,
                //             '-7':  10.86,
                //             '-6':  10.86,
                //             '-5':  10.86,
                //             '-4':  10.86,
                //         },
                //     },
                // },
                // {
                //     ref:    'EPGA14DV',
                //     size:   14,
                //     output: {
                //         65: {
                //             '-15': 0,
                //             '-13': 0,
                //             '-11': 0,
                //             '-9':  0,
                //             '-8':  0,
                //             '-7':  0,
                //             '-6':  0,
                //             '-5':  0,
                //             '-4':  0,
                //         },
                //         55: {
                //             '-15': 9.80,
                //             '-13': 10.20,
                //             '-11': 10.59,
                //             '-9':  10.99,
                //             '-8':  11.18,
                //             '-7':  11.38,
                //             '-6':  11.45,
                //             '-5':  11.52,
                //             '-4':  11.59,
                //         },
                //         40: {
                //             '-15': 12.33,   // TODO CHANGER AVEC LES VRAIES VALEURS
                //             '-13': 12.33,
                //             '-11': 12.33,
                //             '-9':  12.33,
                //             '-8':  12.33,
                //             '-7':  12.22,
                //             '-6':  12.22,
                //             '-5':  12.22,
                //             '-4':  12.22,
                //         },
                //     },
                // },
                // {
                //     ref:    'EPGA16DV',
                //     size:   16,
                //     output: {
                //         65: {
                //             '-15': 0,
                //             '-13': 0,
                //             '-11': 0,
                //             '-9':  0,
                //             '-8':  0,
                //             '-7':  0,
                //             '-6':  0,
                //             '-5':  0,
                //             '-4':  0,
                //         },
                //         55: {
                //             '-15': 10.89,
                //             '-13': 11.33,
                //             '-11': 11.77,
                //             '-9':  12.21,
                //             '-8':  12.43,
                //             '-7':  12.65,
                //             '-6':  12.73,
                //             '-5':  12.80,
                //             '-4':  12.88,
                //         },
                //         40: {
                //             '-15': 13.70,   // TODO CHANGER AVEC LES VRAIES VALEURS
                //             '-13': 13.70,
                //             '-11': 13.70,
                //             '-9':  13.70,
                //             '-8':  13.70,
                //             '-7':  13.57,
                //             '-6':  13.57,
                //             '-5':  13.57,
                //             '-4':  13.57,
                //         },
                //     },
                // },
            ],
            triphase:  [
                {
                    ref:    'EPRA08EW1', // 70°C
                    size:   8,
                    output: {
                        65: {
                            '-15': 6.24,
                            '-13': 6.70,
                            '-11': 7.16,
                            '-9':  7.60,
                            '-8':  7.80,
                            '-7':  8.00,
                            '-6':  8.17,
                            '-5':  8.33,
                            '-4':  8.47,
                        },
                        55: {
                            '-15': 6.54,
                            '-13': 6.85,
                            '-11': 7.04,
                            '-9':  7.24,
                            '-8':  7.37,
                            '-7':  7.55,
                            '-6':  7.78,
                            '-5':  8.04,
                            '-4':  8.30,
                        },
                        40: {
                            '-15': 6.46,
                            '-13': 6.62,
                            '-11': 6.78,
                            '-9':  7.04,
                            '-8':  7.24,
                            '-7':  7.50,
                            '-6':  7.84,
                            '-5':  8.19,
                            '-4':  8.49,
                        },
                    },
                },
                {
                    ref:    'EPRA10EW1', // 70°C
                    size:   10,
                    output: {
                        65: {
                            '-15': 6.72,
                            '-13': 7.52,
                            '-11': 8.20,
                            '-9':  8.77,
                            '-8':  9.02,
                            '-7':  9.25,
                            '-6':  9.45,
                            '-5':  9.62,
                            '-4':  9.78,
                        },
                        55: {
                            '-15': 7.57,
                            '-13': 8.10,
                            '-11': 8.53,
                            '-9':  8.87,
                            '-8':  9.00,
                            '-7':  9.10,
                            '-6':  9.18,
                            '-5':  9.23,
                            '-4':  9.28,
                        },
                        40: {
                            '-15': 7.47,
                            '-13': 7.85,
                            '-11': 8.24,
                            '-9':  8.61,
                            '-8':  8.78,
                            '-7':  8.93,
                            '-6':  9.05,
                            '-5':  9.14,
                            '-4':  9.17,
                        },
                    },
                },
                {
                    ref:    'EPRA12EW1', // 70°C
                    size:   12,
                    output: {
                        65: {
                            '-15': 6.72,
                            '-13': 8.56,
                            '-11': 9.75,
                            '-9':  10.43,
                            '-8':  10.63,
                            '-7':  10.75,
                            '-6':  10.81,
                            '-5':  10.83,
                            '-4':  10.84,
                        },
                        55: {
                            '-15': 8.79,
                            '-13': 9.50,
                            '-11': 10.11,
                            '-9':  10.51,
                            '-8':  10.59,
                            '-7':  10.58,
                            '-6':  10.46,
                            '-5':  10.28,
                            '-4':  10.07,
                        },
                        40: {
                            '-15': 8.68,
                            '-13': 9.26,
                            '-11': 9.84,
                            '-9':  10.26,
                            '-8':  10.37,
                            '-7':  10.37,
                            '-6':  10.27,
                            '-5':  10.07,
                            '-4':  9.79,
                        },
                    },
                },
                {
                    ref:    'EPRA14DW1', // 70°C
                    size:   14,
                    output: {
                        65: {
                            '-15': 9.47,
                            '-13': 9.59,
                            '-11': 9.72,
                            '-9':  9.84,
                            '-8':  9.90,
                            '-7':  9.96,
                            '-6':  10.02,
                            '-5':  10.08,
                            '-4':  10.14,
                        },
                        55: {
                            '-15': 10.20,
                            '-13': 10.40,
                            '-11': 10.60,
                            '-9':  10.79,
                            '-8':  10.89,
                            '-7':  10.99,
                            '-6':  10.87,
                            '-5':  10.75,
                            '-4':  10.63,
                        },
                        40: {
                            '-15': 9.62,
                            '-13': 9.88,
                            '-11': 10.14,
                            '-9':  10.39,
                            '-8':  10.52,
                            '-7':  10.65,
                            '-6':  10.32,
                            '-5':  9.99,
                            '-4':  9.67,
                        },
                    },
                },
                {
                    ref:    'EPRA16DW1', // 70°C
                    size:   16,
                    output: {
                        65: {
                            '-15': 10.78,
                            '-13': 10.91,
                            '-11': 11.05,
                            '-9':  11.19,
                            '-8':  11.26,
                            '-7':  11.33,
                            '-6':  11.40,
                            '-5':  11.46,
                            '-4':  11.53,
                        },
                        55: {
                            '-15': 11.61,
                            '-13': 11.83,
                            '-11': 12.05,
                            '-9':  12.28,
                            '-8':  12.39,
                            '-7':  12.50,
                            '-6':  12.37,
                            '-5':  12.23,
                            '-4':  12.10,
                        },
                        40: {
                            '-15': 10.66,
                            '-13': 10.94,
                            '-11': 11.22,
                            '-9':  11.50,
                            '-8':  11.65,
                            '-7':  11.79,
                            '-6':  11.43,
                            '-5':  11.06,
                            '-4':  10.70,
                        },
                    },
                },
                {
                    ref:    'EPRA18DW1', // 70°C
                    size:   18,
                    output: {
                        65: {
                            '-15': 11.28,
                            '-13': 11.42,
                            '-11': 11.59,
                            '-9':  11.96,
                            '-8':  12.14,
                            '-7':  12.33,
                            '-6':  12.28,
                            '-5':  12.23,
                            '-4':  12.18,
                        },
                        55: {
                            '-15': 12.15,
                            '-13': 12.38,
                            '-11': 12.61,
                            '-9':  12.85,
                            '-8':  12.97,
                            '-7':  13.08,
                            '-6':  12.94,
                            '-5':  12.80,
                            '-4':  12.66,
                        },
                        40: {
                            '-15': 11.46,
                            '-13': 11.76,
                            '-11': 12.07,
                            '-9':  12.37,
                            '-8':  12.52,
                            '-7':  12.67,
                            '-6':  12.29,
                            '-5':  11.90,
                            '-4':  11.51,
                        },
                    },
                },
            ],
        };

        this.unitIntList = {
            monophase: [
                {
                    ref:             'ETBH16E6V',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH16S18E6V',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH16S23E6V',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ16S18E6V',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ16S23E6V',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: false,
                },
                {
                    ref:             'EHBH04E6V',
                    sizes:           [ 4 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHBH08E6V',
                    sizes:           [ 6, 8 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHVH04S18E6V',
                    sizes:           [ 4 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHVH08S18E6V',
                    sizes:           [ 6, 8 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHVH04S23E6V',
                    sizes:           [ 4 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHVH08S23E6V',
                    sizes:           [ 6, 8 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EHVZ04S18E6V',
                    sizes:           [ 4 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: false,
                },
                {
                    ref:             'EHVZ08S18E6V',
                    sizes:           [ 6, 8 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: false,
                },
                {
                    ref:             'EHVZ08S23E6V',
                    sizes:           [ 6, 8 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: false,
                },
                // {
                //     ref:             'EABH16D6V',
                //     sizes:           [ 11, 14, 16 ],
                //     hotWaterTank:    0,
                //     bizone:          false,
                //     highTemperature: false,
                // },
                // {
                //     ref:             'EAVH16S18D6V',
                //     sizes:           [ 11, 14, 16 ],
                //     hotWaterTank:    180,
                //     bizone:          false,
                //     highTemperature: false,
                // },
                // {
                //     ref:             'EAVH16S23D6V',
                //     sizes:           [ 11, 14, 16 ],
                //     hotWaterTank:    230,
                //     bizone:          false,
                //     highTemperature: false,
                // },
                // {
                //     ref:             'EAVZ16S18D6V',
                //     sizes:           [ 11, 14, 16 ],
                //     hotWaterTank:    180,
                //     bizone:          true,
                //     highTemperature: false,
                // },
                // {
                //     ref:             'EAVZ16S23D6V',
                //     sizes:           [ 11, 14, 16 ],
                //     hotWaterTank:    230,
                //     bizone:          true,
                //     highTemperature: false,
                // },
                {
                    ref:             'ETBH12E6V',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH12S18E6V',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH12S23E6V',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ12S18E6V',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ12S23E6V',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: true,
                },
            ],
            triphase:  [
                {
                    ref:             'ETBH16E9W',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH16S18E9W',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH16S23E9W',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ16S18E9W',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ16S23E9W',
                    sizes:           [ 14, 16, 18 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: true,
                },
                {
                    ref:             'ETBH12E9W',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH12S18E9W',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVH12S23E9W',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ12S18E9W',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: true,
                },
                {
                    ref:             'ETVZ12S23E9W',
                    sizes:           [ 8, 10, 12 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: true,
                },
            ],
        };
    }

    /**
     * Retourne le niveau de tempéature que peut gérer le type de radiateur
     * @param heater
     */
    private heaterToValue( heater: string ): number {
        if ( heater === 'r_fonte' || heater === 'r_fonte_p_chauffant' ) {
            return 65;
        }

        if ( heater === 'r_autre' || heater === 'r_autre_p_chauffant' ) {
            return 55;
        }

        if ( heater === 'p_chauffant' || heater === 'p_chauffant_p_chauffant' ) {
            return 40;
        }

        return 0;
    }

    /**
     * Retourne si oui ou non la PAC doit être Bi Zone selon les radiatieurs
     * @param heater
     */
    private isBiZone( heater: string ): boolean {
        return heater === 'r_autre_p_chauffant' || heater === 'r_fonte_p_chauffant' || heater === 'p_chauffant_p_chauffant';
    }

    public getUnitsRo( volumeECS: number,
                       sizingPercentage: number ): { unitExt: UnitExt; unitInt: UnitInt; needBiZoneSupplement: boolean } | null {
        console.log( '%c GET UNITS RO', 'background: #5ADFFF; color: #000000' );
        const requiredPower: number = this.calcRequiredPower( this.housing );
        const baseTemp: number      = this.getBaseTemperature( this.housing.climaticZone, this.housing.altitude );
        const heaterValue: number   = this.heaterToValue( this.housing.heaters );

        let formatedBaseTemp: string;
        if ( baseTemp > -4 ) {
            formatedBaseTemp = '-4';
        } else if ( baseTemp === -10 ) {
            formatedBaseTemp = '-11';
        } else if ( baseTemp === -12 ) {
            formatedBaseTemp = '-13';
        } else if ( baseTemp === -14 ) {
            formatedBaseTemp = '-15';
        } else {
            formatedBaseTemp = baseTemp.toString();
        }

        console.log( {
                         'puissance_requise':        requiredPower,
                         'temperature_base':         baseTemp,
                         'temperature_base_formate': formatedBaseTemp,
                         'radiateurs':               this.housing.heaters,
                         'valeur_radiateurs':        heaterValue,
                     } );

        // Si on ne trouve pas dans la liste la tension souhaitée on retourne null
        if ( this.unitExtList[ this.housing.availableVoltage ] === undefined ) {
            return null;
        }

        // On filtre la liste pour trouver la PAC souhaité
        const filterredUnitExt: UnitExt[] = this.unitExtList[ this.housing.availableVoltage ].filter( ( pac: UnitExt ) => {
            // Si valeur de chauffage n'est pas définie
            if ( pac.output[ heaterValue ] === undefined ) {
                return false;
            }

            // On retourne la PAC que si son output est supérieur à la puissance requise
            return pac.output[ heaterValue ][ formatedBaseTemp ] > requiredPower * ( sizingPercentage / 100 );
        } );

        let selectedUnitExt: UnitExt | null = null;

        if ( filterredUnitExt.length === 1 ) {
            selectedUnitExt = filterredUnitExt[ 0 ];
        } else {
            console.log( 'filterredUnitExt -->', filterredUnitExt );

            // S'il y a plus de 1 PAC on parcourt les pacs et on récupère la moins chère
            for ( const unitExt of filterredUnitExt ) {
                console.log( unitExt );
                console.log( 's1 ->', selectedUnitExt );
                if ( selectedUnitExt === null ) {
                    selectedUnitExt = unitExt;
                } else {
                    const p1: Product | undefined = getProductByRef( selectedUnitExt.ref );
                    const p2: Product | undefined = getProductByRef( unitExt.ref );

                    // On check les prix et assigne la moins chère
                    if ( p1 !== undefined && p2 !== undefined ) {
                        if ( p1.pu > p2.pu ) {
                            selectedUnitExt = unitExt;
                        }
                    }
                }

                console.log( 's2 ->', selectedUnitExt );
            }
        }

        console.log( 's finale -->', selectedUnitExt );
        if ( selectedUnitExt === null ) {
            console.warn( 'Impossible de trouvé une unité extérieur' );
            return null;
        }

        // Si on ne trouve pas dans la liste la tension souhaitée on retourne null
        if ( this.unitIntList[ this.housing.availableVoltage ] === undefined ) {
            return null;
        }

        console.log( `%c VOLUME ECS IN ALGO --> ${ volumeECS }`, 'background: #fdd835; color: #000000' );
        const hotWater = volumeECS;
        let bizone     = this.isBiZone( this.housing.heaters );
        const size     = selectedUnitExt.size;

        console.log( {
                         'volume_ECS': hotWater,
                         'bizone':     bizone,
                         'size':       size,
                     } );

        // Pompe à chaleur bizone avec ECS n'existe pas, on doit rajouter un KIT-Bi-Zone
        // On passe donc bizone à false
        let needBiZoneSupplement = false;
        if ( bizone && hotWater === 0 ) {
            bizone               = false;
            needBiZoneSupplement = true;
        }

        // On récupère le model intérieur selon les infos renseignées
        const filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {

            // TODO highTemperature
            // Les highTemperature pas que 65°C mais que pour les Unité EPRA qui font de la haute température
            // Donc highTemperature = reférence == EPRA

            const highTemperature = heaterValue === 65;
            console.log( 'highTemperature', highTemperature );

            console.log( '---' );
            console.log( '---' );
            console.log( `${ unit.hotWaterTank } --- ${ hotWater }` );

            // Sinon aute température on ne check pas la si c'est égal
            if ( !highTemperature || highTemperature === unit.highTemperature ) {
                console.log( 'BONNE TEMPÉRATURE' );
                if ( unit.sizes.includes( size ) ) {
                    console.log( 'BONNE TAILLE' );
                    if ( unit.hotWaterTank === hotWater ) {
                        console.log( 'BON BALLON EAU CHAUDE' );
                        if ( unit.bizone === bizone ) {
                            console.log( 'BIZONE OK' );
                            console.log( unit );
                        }
                    }
                }
            }

            // console.log( 'unit.sizes', unit.sizes );
            // console.log( 'size', size );
            // console.log( 'unit.hotWaterTank === hotWater', unit.hotWaterTank === hotWater );
            // console.log( 'unit.bizone === bizone', unit.bizone === bizone );
            // console.log( 'unit.sizes.includes(size)', unit.sizes.includes( size ) );
            // console.log( 'highTemperature === unit.highTemperature', highTemperature === unit.highTemperature );


            return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.sizes.includes( size ) && ( !highTemperature || highTemperature === unit.highTemperature );
        } );
        console.log( 'filteredUnitInt', filteredUnitInt );

        let selectedUnitInt: UnitInt | null = null;
        for ( const unitInt of filteredUnitInt ) {
            if ( selectedUnitInt === null ) {
                selectedUnitInt = unitInt;
            } else {
                if ( selectedUnitInt.sizes > unitInt.size ) {
                    selectedUnitInt = unitInt;
                }
            }
        }

        console.log( 'selectedUnitInt -->', selectedUnitInt );
        if ( selectedUnitInt === null ) {
            console.warn( 'Impossible de trouvé une unité intérieur' );
            return null;
        }


        // let selectedUnitInt: UnitInt;
        // if ( filteredUnitInt.length === 0 ) {
        //     console.warn( 'Impossible de trouvé une unité intérieur' );
        //     return null;
        // } else {
        //     selectedUnitInt = filteredUnitInt[ 0 ];
        // }

        console.log( 'PAC RO ->', {
            unitExt: selectedUnitExt,
            unitInt: selectedUnitInt,
        } );
        return {
            unitExt: selectedUnitExt,
            unitInt: selectedUnitInt,
            needBiZoneSupplement,
        };
    }

    /**
     * Retourne la puissance réelle d'une unité extérieure selon la zone climatique
     */
    public getRealPowerUnitExt( sizingPercentage: number ): number {
        const requiredPower: number = this.calcRequiredPower( this.housing );
        const baseTemp: number      = this.getBaseTemperature( this.housing.climaticZone, this.housing.altitude );
        const heaterValue: number   = this.heaterToValue( this.housing.heaters );

        let formatedBaseTemp: string;
        if ( baseTemp > -4 ) {
            formatedBaseTemp = '-4';
        } else if ( baseTemp === -10 ) {
            formatedBaseTemp = '-11';
        } else if ( baseTemp === -12 ) {
            formatedBaseTemp = '-13';
        } else if ( baseTemp === -14 ) {
            formatedBaseTemp = '-15';
        } else {
            formatedBaseTemp = baseTemp.toString();
        }

        // Si on ne trouve pas dans la liste la tension souhaitée on retourne null
        if ( this.unitExtList[ this.housing.availableVoltage ] === undefined ) {
            return 0;
        }

        // On filtre la liste pour trouver la PAC souhaité
        const filterredUnitExt: UnitExt[] = this.unitExtList[ this.housing.availableVoltage ].filter( ( pac: UnitExt ) => {
            // Si valeur de chauffage n'est pas définie
            if ( pac.output[ heaterValue ] === undefined ) {
                return false;
            }

            // On retourne la PAC que si son output est supérieur à la puissance requise
            return pac.output[ heaterValue ][ formatedBaseTemp ] > requiredPower * ( sizingPercentage / 100 );
        } );

        let selectedUnitExt: UnitExt | null = null;

        if ( filterredUnitExt.length === 1 ) {
            selectedUnitExt = filterredUnitExt[ 0 ];
        } else {
            // S'il y a plus de 1 PAC on parcourt les pacs et on récupère celle à la plus faible puissance (la plus proche de la puissance requise)
            // Si Même puissance la moins chère.
            for ( const unitExt of filterredUnitExt ) {
                if ( selectedUnitExt === null ) {
                    selectedUnitExt = unitExt;
                } else if ( selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ] > unitExt.output[ heaterValue ][ formatedBaseTemp ] ) {
                    selectedUnitExt = unitExt;
                } else if ( selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ] === unitExt.output[ heaterValue ][ formatedBaseTemp ] ) {
                    const p1: Product | undefined = getProductByRef( selectedUnitExt.ref );
                    const p2: Product | undefined = getProductByRef( unitExt.ref );

                    // On check les prix et assigne la moins chère
                    if ( p1 !== undefined && p2 !== undefined ) {
                        if ( p1.pu > p2.pu ) {
                            selectedUnitExt = unitExt;
                        }
                    }
                }
            }
        }

        if ( selectedUnitExt === null ) {
            return 0;
        }


        return selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ];
    }
}
