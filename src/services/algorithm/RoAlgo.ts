import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { getProductByRef } from '@/services/data/dataService';
import { Product } from '@/types/v2/File/Common/Product';
import { generatedUnitExtList } from '@/command/unitExtList';

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
export interface UnitExtList {
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

        this.unitExtList = generatedUnitExtList;

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
            // S'il y a plus de 1 PAC on parcourt les pacs et on récupère la moins chère
            for ( const unitExt of filterredUnitExt ) {
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
            }
        }

        if ( selectedUnitExt === null ) {
            console.warn( 'Impossible de trouvé une unité extérieur' );
            return null;
        }

        // Si on ne trouve pas dans la liste la tension souhaitée on retourne null
        if ( this.unitIntList[ this.housing.availableVoltage ] === undefined ) {
            return null;
        }

        const hotWater = volumeECS;
        let bizone     = this.isBiZone( this.housing.heaters );
        const size     = selectedUnitExt.size;

        // Pompe à chaleur bizone avec ECS n'existe pas, on doit rajouter un KIT-Bi-Zone
        // On passe donc bizone à false
        let needBiZoneSupplement = false;
        if ( bizone && hotWater === 0 ) {
            bizone               = false;
            needBiZoneSupplement = true;
        }

        // On récupère le model intérieur selon les infos renseignées
        const filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {

            // Les highTemperature pas qu'à 65°C mais que pour toutes les unites EPRA qui font de la haute température

            // const highTemperature = heaterValue === 65;

            let highTemperature = false;
            if ( selectedUnitExt !== null ) {
                highTemperature = selectedUnitExt.ref.includes( 'EPRA' );
            }

            // Sinon aute température on ne check pas la si c'est égal
            return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.sizes.includes( size ) && ( !highTemperature || highTemperature === unit.highTemperature );
        } );

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

        if ( selectedUnitInt === null ) {
            console.warn( 'Impossible de trouvé une unité intérieur' );
            return null;
        }

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
