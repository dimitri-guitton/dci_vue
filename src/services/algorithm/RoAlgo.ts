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
    sizes: number[];
    highTemperature: boolean;
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
                            '-15': 6,
                            '-13': 7,
                            '-11': 7,
                            '-9':  8,
                            '-8':  8,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                        55: {
                            '-15': 7,
                            '-13': 7,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                        40: {
                            '-15': 6,
                            '-13': 7,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                    },
                },
                {
                    ref:    'EPRA10EV3', // 70°C
                    size:   10,
                    output: {
                        65: {
                            '-15': 7,
                            '-13': 8,
                            '-11': 8,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  10,
                            '-4':  10,
                        },
                        55: {
                            '-15': 8,
                            '-13': 8,
                            '-11': 9,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  9,
                            '-4':  9,
                        },
                        40: {
                            '-15': 7,
                            '-13': 8,
                            '-11': 8,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  9,
                            '-4':  9,
                        },
                    },
                },
                {
                    ref:    'EPRA12EV3', // 70°C
                    size:   12,
                    output: {
                        65: {
                            '-15': 7,
                            '-13': 9,
                            '-11': 10,
                            '-9':  10,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  11,
                            '-4':  11,
                        },
                        55: {
                            '-15': 9,
                            '-13': 10,
                            '-11': 10,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        40: {
                            '-15': 9,
                            '-13': 9,
                            '-11': 10,
                            '-9':  10,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                    },
                },
                {
                    ref:    'EPRA14DV3', // 70°C
                    size:   14,
                    output: {
                        65: {
                            '-15': 9,
                            '-13': 9,
                            '-11': 9,
                            '-9':  9,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        55: {
                            '-15': 10,
                            '-13': 10,
                            '-11': 10,
                            '-9':  10,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        40: {
                            '-15': 9,
                            '-13': 10,
                            '-11': 10,
                            '-9':  10,
                            '-8':  10,
                            '-7':  11,
                            '-6':  10,
                            '-5':  10,
                            '-4':  9,
                        },
                    },
                },
                {
                    ref:    'EPRA16DV3', // 70°C
                    size:   16,
                    output: {
                        65: {
                            '-15': 10,
                            '-13': 10,
                            '-11': 11,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  11,
                            '-4':  11,
                        },
                        55: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 11,
                            '-9':  12,
                            '-8':  12,
                            '-7':  12,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,
                        },
                        40: {
                            '-15': 10,
                            '-13': 11,
                            '-11': 11,
                            '-9':  11,
                            '-8':  12,
                            '-7':  12,
                            '-6':  11,
                            '-5':  11,
                            '-4':  10,
                        },
                    },
                },
                {
                    ref:    'EPRA18DV3', // 70°C
                    size:   18,
                    output: {
                        65: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 11,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,
                        },
                        55: {
                            '-15': 11,
                            '-13': 12,
                            '-11': 12,
                            '-9':  12,
                            '-8':  12,
                            '-7':  12,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,
                        },
                        40: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 12,
                            '-9':  12,
                            '-8':  12,
                            '-7':  13,
                            '-6':  12,
                            '-5':  12,
                            '-4':  11,
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
                            '-15': 4,
                            '-13': 4,
                            '-11': 4,
                            '-9':  4,
                            '-8':  4,
                            '-7':  4,
                            '-6':  4,
                            '-5':  4,
                            '-4':  4,
                        },
                        40: {
                            '-15': 5,
                            '-13': 5,
                            '-11': 5,
                            '-9':  5,
                            '-8':  5,
                            '-7':  5,
                            '-6':  5,
                            '-5':  5,
                            '-4':  5,
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
                            '-15': 5,
                            '-13': 5,
                            '-11': 5,
                            '-9':  5,
                            '-8':  5,
                            '-7':  5,
                            '-6':  5,
                            '-5':  5,
                            '-4':  5,
                        },
                        40: {
                            '-15': 6,
                            '-13': 6,
                            '-11': 6,
                            '-9':  6,
                            '-8':  6,
                            '-7':  6,
                            '-6':  6,
                            '-5':  6,
                            '-4':  6,
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
                            '-15': 6,
                            '-13': 6,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  7,
                            '-6':  7,
                            '-5':  7,
                            '-4':  7,
                        },
                        40: {
                            '-15': 7,
                            '-13': 7,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  7,
                            '-6':  7,
                            '-5':  7,
                            '-4':  7,
                        },
                    },
                },
                {
                    ref:    'EPGA11DV',
                    size:   11,
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
                            '-15': 9,
                            '-13': 9,
                            '-11': 9,
                            '-9':  10,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        40: {
                            '-15': 10.96,   // TODO CHANGER AVEC LES VRAIES VALEURS
                            '-13': 10.96,
                            '-11': 10.96,
                            '-9':  10.96,
                            '-8':  10.96,
                            '-7':  10.86,
                            '-6':  10.86,
                            '-5':  10.86,
                            '-4':  10.86,
                        },
                    },
                },
                {
                    ref:    'EPGA14DV',
                    size:   14,
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
                            '-15': 10,
                            '-13': 10,
                            '-11': 11,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  12,
                            '-4':  12,
                        },
                        40: {
                            '-15': 12.33,   // TODO CHANGER AVEC LES VRAIES VALEURS
                            '-13': 12.33,
                            '-11': 12.33,
                            '-9':  12.33,
                            '-8':  12.33,
                            '-7':  12.22,
                            '-6':  12.22,
                            '-5':  12.22,
                            '-4':  12.22,
                        },
                    },
                },
                {
                    ref:    'EPGA16DV',
                    size:   16,
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
                            '-15': 11,
                            '-13': 11,
                            '-11': 12,
                            '-9':  12,
                            '-8':  12,
                            '-7':  13,
                            '-6':  13,
                            '-5':  13,
                            '-4':  13,
                        },
                        40: {
                            '-15': 13.70,   // TODO CHANGER AVEC LES VRAIES VALEURS
                            '-13': 13.70,
                            '-11': 13.70,
                            '-9':  13.70,
                            '-8':  13.70,
                            '-7':  13.57,
                            '-6':  13.57,
                            '-5':  13.57,
                            '-4':  13.57,
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
                            '-15': 6,
                            '-13': 7,
                            '-11': 7,
                            '-9':  8,
                            '-8':  8,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                        55: {
                            '-15': 7,
                            '-13': 7,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                        40: {
                            '-15': 6,
                            '-13': 7,
                            '-11': 7,
                            '-9':  7,
                            '-8':  7,
                            '-7':  8,
                            '-6':  8,
                            '-5':  8,
                            '-4':  8,
                        },
                    },
                },
                {
                    ref:    'EPRA10EW1', // 70°C
                    size:   10,
                    output: {
                        65: {
                            '-15': 7,
                            '-13': 8,
                            '-11': 8,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  10,
                            '-4':  10,
                        },
                        55: {
                            '-15': 8,
                            '-13': 8,
                            '-11': 9,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  9,
                            '-4':  9,
                        },
                        40: {
                            '-15': 7,
                            '-13': 8,
                            '-11': 8,
                            '-9':  9,
                            '-8':  9,
                            '-7':  9,
                            '-6':  9,
                            '-5':  9,
                            '-4':  9,
                        },
                    },
                },
                {
                    ref:    'EPRA12EW1', // 70°C
                    size:   12,
                    output: {
                        65: {
                            '-15': 7,
                            '-13': 9,
                            '-11': 10,
                            '-9':  10,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  11,
                            '-4':  11,
                        },
                        55: {
                            '-15': 9,
                            '-13': 10,
                            '-11': 10,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        40: {
                            '-15': 9,
                            '-13': 9,
                            '-11': 10,
                            '-9':  10,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                    },
                },
                {
                    ref:    'EPRA14DW1', // 70°C
                    size:   14,
                    output: {
                        65: {
                            '-15': 9,
                            '-13': 10,
                            '-11': 10,
                            '-9':  10,
                            '-8':  10,
                            '-7':  10,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                        55: {
                            '-15': 10,
                            '-13': 10,
                            '-11': 11,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  11,
                            '-4':  11,
                        },
                        40: {
                            '-15': 10,
                            '-13': 10,
                            '-11': 10,
                            '-9':  10,
                            '-8':  11,
                            '-7':  11,
                            '-6':  10,
                            '-5':  10,
                            '-4':  10,
                        },
                    },
                },
                {
                    ref:    'EPRA16DW1', // 70°C
                    size:   16,
                    output: {
                        65: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 11,
                            '-9':  11,
                            '-8':  11,
                            '-7':  11,
                            '-6':  11,
                            '-5':  11,
                            '-4':  12,
                        },
                        55: {
                            '-15': 12,
                            '-13': 12,
                            '-11': 12,
                            '-9':  12,
                            '-8':  12,
                            '-7':  13,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,

                        },
                        40: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 11,
                            '-9':  12,
                            '-8':  12,
                            '-7':  12,
                            '-6':  11,
                            '-5':  11,
                            '-4':  11,
                        },
                    },
                },
                {
                    ref:    'EPRA18DW1', // 70°C
                    size:   18,
                    output: {
                        65: {
                            '-15': 11,
                            '-13': 11,
                            '-11': 12,
                            '-9':  12,
                            '-8':  12,
                            '-7':  12,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,
                        },
                        55: {
                            '-15': 12,
                            '-13': 12,
                            '-11': 13,
                            '-9':  13,
                            '-8':  13,
                            '-7':  13,
                            '-6':  13,
                            '-5':  13,
                            '-4':  13,
                        },
                        40: {
                            '-15': 11,
                            '-13': 12,
                            '-11': 12,
                            '-9':  12,
                            '-8':  13,
                            '-7':  13,
                            '-6':  12,
                            '-5':  12,
                            '-4':  12,
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
                {
                    ref:             'EABH16D6V',
                    sizes:           [ 11, 14, 16 ],
                    hotWaterTank:    0,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EAVH16S18D6V',
                    sizes:           [ 11, 14, 16 ],
                    hotWaterTank:    180,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EAVH16S23D6V',
                    sizes:           [ 11, 14, 16 ],
                    hotWaterTank:    230,
                    bizone:          false,
                    highTemperature: false,
                },
                {
                    ref:             'EAVZ16S18D6V',
                    sizes:           [ 11, 14, 16 ],
                    hotWaterTank:    180,
                    bizone:          true,
                    highTemperature: false,
                },
                {
                    ref:             'EAVZ16S23D6V',
                    sizes:           [ 11, 14, 16 ],
                    hotWaterTank:    230,
                    bizone:          true,
                    highTemperature: false,
                },
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

        if ( heater === 'p_chauffant' ) {
            return 40;
        }

        return 0;
    }

    /**
     * Retourne si oui ou non la PAC doit être Bi Zone selon les radiatieurs
     * @param heater
     */
    private isBiZone( heater: string ): boolean {
        return heater === 'r_autre_p_chauffant' || heater === 'r_fonte_p_chauffant';
    }

    public getUnitsRo( volumeECS: number ): { unitExt: UnitExt; unitInt: UnitInt; needBiZoneSupplement: boolean } | null {
        console.log( '%c GET UNITS RO', 'background: #5ADFFF; color: #000000' );
        const requiredPower: number = this.calcRequiredPower( this.housing, 'pac_ro' );
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
            console.log( 'filterredUnitExt -->', filterredUnitExt );
            // Si il y a plus de 1 PAC on parcours les pacs et on récupère celle à la plus faible puissance (la plus proche de la puissance requise)
            // Si Même puissance la moins chère
            for ( const unitExt of filterredUnitExt ) {
                console.log( unitExt );
                console.log( 's1 ->', selectedUnitExt );
                if ( selectedUnitExt === null ) {
                    selectedUnitExt = unitExt;
                } else if ( selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ] > unitExt.output[ heaterValue ][ formatedBaseTemp ] ) {
                    selectedUnitExt = unitExt;
                } else if ( selectedUnitExt.output[ heaterValue ][ formatedBaseTemp ] === unitExt.output[ heaterValue ][ formatedBaseTemp ] ) {
                    console.log( '%c MEME PUISSANCE', 'background: #fdd835; color: #000000' );

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

        // Si on ne trouve pas dans la liste la tension souhaité on retourne null
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

        // Pompe à chaleur bi-zone avec ECS n'existe pas, on doit rajouter un KIT-Bi-Zone
        // On passe donc bizone à false
        let needBiZoneSupplement = false;
        if ( bizone && hotWater === 0 ) {
            bizone               = false;
            needBiZoneSupplement = true;
        }

        // On récupère le model intérieur selon les infos renseigné
        const filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {

            const highTemperature = heaterValue === 65;

            console.log( '---' );
            console.log( '---' );
            console.log( `${ unit.hotWaterTank } --- ${ hotWater }` );
            if ( highTemperature === unit.highTemperature ) {
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


            return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.sizes.includes( size ) && highTemperature === unit.highTemperature;
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
     * Retourne la puissance réel d'une unité extérieur selon la zone climatique
     */
    public getRealPowerUnitExt(): number {
        const requiredPower: number = this.calcRequiredPower( this.housing, 'pac_ro' );
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

        // Si on ne trouve pas dans la liste la tension souhaité on retourne null
        if ( this.unitExtList[ this.housing.availableVoltage ] === undefined ) {
            return 0;
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
            // Si Même puissance la moins chère
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
