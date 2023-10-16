import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { getProductByRef } from '@/services/data/dataService';
import { Product } from '@/types/v2/File/Common/Product';
import { generatedUnitExtList } from '@/commands/import_pac_ro_products/dist/unitExtList';
import { generatedUnitIntList } from '@/commands/import_pac_ro_products/dist/unitIntList';

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
    power: string;
    model: string;
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
    label?: string;
    sizes: number[];
    highTemperature: boolean;
    hotWaterTank: number;
    bizone: boolean;
    power: string;
    model: string;
}

/**
 * Les unités intérieures par tension
 */
export interface UnitIntList {
    monophase: UnitInt[];
    triphase: UnitInt[];
}


export class RoAlgo extends PacAlgo {
    private readonly unitExtList: UnitExtList;
    private readonly unitIntList: UnitIntList;

    constructor( housing: PacHousing ) {
        super( housing );

        this.unitExtList = generatedUnitExtList;
        this.unitIntList = generatedUnitIntList;
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

    public getUnitsRo( volumeECS: number, sizingPercentage: number, model: string, ecsIsDeporte = false ): {
        unitExt: UnitExt;
        unitInt: UnitInt;
        needBiZoneSupplement: boolean;
    } | null {
        console.log( '%c GET UNIT RO', 'background: #0056FF; color: #000000' );
        const requiredPower: number = this.calcRequiredPower( this.housing );
        console.log( 'Puissance requise : ' + requiredPower );
        const baseTemp: number = this.getBaseTemperature( this.housing.climaticZone, this.housing.altitude );
        console.log( 'Température de base : ' + baseTemp );
        const heaterValue: number = this.heaterToValue( this.housing.heaters );

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

            // Pas de ballon ECS deporté sur les PAC A.I
            if ( ecsIsDeporte && pac.ref.includes( 'A.I' ) ) {
                return false;
            }

            // 'A.I' c'est pour les PAC Atlantic
            if ( model === 'daikin' && pac.ref.includes( 'A.I' ) ) {
                return false;
            } else if ( model === 'atlantic' && !pac.ref.includes( 'A.I' ) ) {
                return false;
            }

            // On retourne la PAC que si son output est supérieur à la puissance requise
            return pac.output[ heaterValue ][ formatedBaseTemp ] > requiredPower * ( sizingPercentage / 100 );
        } );
        console.log( 'filterredUnitExt', filterredUnitExt );

        if ( filterredUnitExt.length === 0 ) {
            console.warn( 'Impossible de trouvé une unité extérieur' );
            return null;
        }

        // S'il y a plus de 1 PAC on les trie de la moins chère à la plus chère
        filterredUnitExt.sort( ( a: UnitExt, b: UnitExt ) => {
            const p1: Product | undefined = getProductByRef( a.ref );
            const p2: Product | undefined = getProductByRef( b.ref );

            if ( p1 === undefined ) {
                console.warn( 'Impossible de trouvé le produit : ' + a.ref );
            }

            // Si un produit n'est pas trouvé, on le met à la fin
            if ( p1 === undefined && p2 === undefined ) {
                return 0;
            } else if ( p1 === undefined ) {
                return 1;
            } else if ( p2 === undefined ) {
                return -1;
            }

            // Ordre des prix croissants
            if ( p1.pu > p2.pu ) {
                console.log( `P1 (${ p1.reference }) plus cher que P2 (${ p2.reference })` );
                return 1;
            } else if ( p1.pu < p2.pu ) {
                console.log( `P1 (${ p1.reference }) moins cher que P2 (${ p2.reference })` );
                return -1;
            } else {
                return 0;
            }
        } );
        console.log( 'filterredUnitExt', filterredUnitExt );


        let selectedUnitExt: UnitExt | null = null;
        let selectedUnitInt: UnitInt | null = null;
        let needBiZoneSupplement            = false;


        for ( const unitExt of filterredUnitExt ) {
            console.log( 'IN FOR LINE 621' );
            const isAtlantic     = unitExt.ref.includes( 'A.I' );
            needBiZoneSupplement = false;
            // Si on ne trouve pas dans la liste la tension souhaitée on retourne null
            if ( this.unitIntList[ this.housing.availableVoltage ] === undefined ) {
                return null;
            }

            const hotWater = volumeECS;
            let bizone     = this.isBiZone( this.housing.heaters );
            const size     = unitExt.size;

            // Pompe à chaleur bizone avec ECS n'existe pas, on doit rajouter un KIT-Bi-Zone
            // On passe donc bizone à false

            if ( isAtlantic && bizone ) {
                needBiZoneSupplement = true;
                bizone               = false;
            } else {
                if ( bizone && hotWater === 0 ) {
                    bizone               = false;
                    needBiZoneSupplement = true;
                }
            }

            let filteredUnitInt: UnitInt[] = [];
            if ( isAtlantic ) {
                console.log( '%c IS ATL', 'background: #fdd835; color: #000000' );
                // On récupère le model intérieur selon les infos renseignées
                filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {
                    if ( unit.label === undefined || unitExt?.ref === undefined ) {
                        console.log( '%c RETURN', 'background: #FF002B; color: #000000' );
                        return false;
                    }

                    const regex = /(A\.I \d+)/gm;

                    let m;

                    let formattedLabel = '';
                    while ( ( m = regex.exec( unitExt.ref ) ) !== null ) {
                        // This is necessary to avoid infinite loops with zero-width matches
                        if ( m.index === regex.lastIndex ) {
                            regex.lastIndex++;
                        }

                        // The result can be accessed through the `m`-variable.
                        m.forEach( ( match, groupIndex ) => {
                            if ( groupIndex === 0 ) {
                                formattedLabel = match;
                            }
                        } );
                    }

                    console.log( 'formattedLabel', formattedLabel );
                    return unit.hotWaterTank === hotWater && unit.bizone === bizone && ( formattedLabel !== '' && unit.label.includes(
                        formattedLabel ) );
                } );
            } else {
                // On récupère le model intérieur selon les infos renseignées
                filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {
                    // Les highTemperature pas qu'à 65°C mais que pour les unites EPRA qui font de la haute température

                    let highTemperature = false;
                    if ( unitExt !== null ) {
                        highTemperature = unitExt.ref.includes( 'EPRA' );
                    }
                    // console.log( unit.hotWaterTank === hotWater );
                    // console.log( unit.bizone === bizone );
                    // console.log( unit.sizes.includes( size ) );

                    // Sinon aute température on ne check pas la si c'est égal
                    return unit.hotWaterTank === hotWater && unit.bizone === bizone && unit.sizes.includes( size ) && ( !highTemperature || highTemperature === unit.highTemperature );
                } );
            }


            let tempSelectedUnitInt: UnitInt | null = null;
            console.log( 'filteredUnitInt : ', filteredUnitInt );
            for ( const unitInt of filteredUnitInt ) {
                if ( tempSelectedUnitInt === null ) {
                    tempSelectedUnitInt = unitInt;
                } else {
                    const maxSizeSelectedUnitInt = Math.max( ...tempSelectedUnitInt.sizes );
                    const maxSizeUnitInt         = Math.max( ...unitInt.sizes );
                    if ( maxSizeSelectedUnitInt > maxSizeUnitInt ) {
                        tempSelectedUnitInt = unitInt;
                    }
                }
            }

            console.log( 'selectedUnitInt : ', selectedUnitInt );

            if ( tempSelectedUnitInt !== null ) {
                selectedUnitExt = unitExt;
                selectedUnitInt = tempSelectedUnitInt;
                break;
            }
        }

        if ( selectedUnitInt === null || selectedUnitExt === null ) {
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
