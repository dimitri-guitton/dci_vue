import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import { generatedUnitExtList } from '@/commands/import_pac_ro_products/dist/unitExtList';
import { Product } from '@/types/v2/File/Common/Product';
import { getProductByRef } from '@/services/data/dataService';
import { generatedUnitIntList } from '@/commands/import_pac_ro_products/dist/unitIntList';

export const MODEL_DAIKIN   = 'DAIKIN';
export const MODEL_ATLANTIC = 'ATLANTIC';

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

const AVAILABLE_RANGE = [
    'ALFEA EXCELLIA',
    'ALFEA EXTENSA',
    'EPRA',
    'ERGA',
    'ERLA',
    'EDLA',
];


export class RoAlgoV2 extends PacAlgo {
    private readonly unitExtList: UnitExtList;
    private readonly unitIntList: UnitIntList;

    constructor( housing: PacHousing ) {
        super( housing );

        this.unitExtList = generatedUnitExtList;
        this.unitIntList = generatedUnitIntList;
    }

    /**
     * Retourne le niveau de température que peut gérer le type de radiateur
     *
     * @param heater Type de radiateur
     */
    private heaterToValue( heater: string ): number {
        const heaterTypes: Record<string, number> = {
            'r_fonte':                 65,
            'r_fonte_p_chauffant':     65,
            'r_autre':                 55,
            'r_autre_p_chauffant':     55,
            'p_chauffant':             40,
            'p_chauffant_p_chauffant': 40,
        };

        // Utilise la valeur par défaut de 65 si le type de radiateur n'est pas trouvé dans la liste
        return heaterTypes[ heater ] || 65;
    }

    /**
     * Retourne si oui ou non la PAC doit être Bi Zone selon les radiateurs
     *
     * @param heater Type de radiateur
     */
    private isBiZone( heater: string ): boolean {
        const biZoneHeaters: string[] = [ 'r_autre_p_chauffant', 'r_fonte_p_chauffant', 'p_chauffant_p_chauffant' ];

        return biZoneHeaters.includes( heater );
    }

    /**
     * Vériie si la tension est disponible dans les produits
     *
     * @param voltage Tension
     * @private
     */
    private voltageIsAvailable( voltage: string ): boolean {
        return this.unitExtList[ voltage ] !== undefined;
    }

    public getExternalProducts( sizingPercentage: number, model: string, ecsIsDeporte = false ): Product[] {
        model                          = model.toUpperCase();
        // Puissance requise
        const requiredPower: number    = this.calcRequiredPower( this.housing );
        // Température de base (pour DeltaT)
        const baseTemp: number         = this.getBaseTemperature( this.housing.climaticZone, this.housing.altitude );
        // Niveau de température que peut gérer un radiateur
        const heaterValue: number      = this.heaterToValue( this.housing.heaters );
        // Température de base formatée
        const formatedBaseTemp: string = this.formatBaseTemperature( baseTemp );

        // Vérification s'il y a des produits avec la tension souhaitée
        if ( !this.voltageIsAvailable( this.housing.availableVoltage ) ) {
            return [];
        }

        console.log( 'Données de l\'algo', {
            'Model':                                             model,
            'Puissance requise':                                 requiredPower,
            'Température de base':                               baseTemp,
            'Niveau de température que peut gérer un radiateur': heaterValue,
            'Température de base formatée':                      formatedBaseTemp,
        } );


        // Filtre les produits qui respectent les conditions
        let filteredProducts: UnitExt[] = this.unitExtList[ this.housing.availableVoltage ].filter( ( product: UnitExt ) => {
            // Si aucune valeur de chauffage n'est renseignée, on passe
            if ( product.output[ heaterValue ] === undefined ) {
                return false;
            }

            // Les PAC atlantic ne sont pas compatible avec les ballon ESC déporté
            if ( ecsIsDeporte && product.model === MODEL_ATLANTIC ) {
                return false;
            }

            // On vérifie la marque souhaitée
            if ( model === MODEL_DAIKIN && product.model !== MODEL_DAIKIN ) {
                return false;
            } else if ( model === MODEL_ATLANTIC && product.model !== MODEL_ATLANTIC ) {
                return false;
            }

            // On vérifie si la puissance est suffisante
            return product.output[ heaterValue ][ formatedBaseTemp ] >= requiredPower * ( sizingPercentage / 100 );
        } );

        // Trie les produits par ordre croissant de prix
        filteredProducts.sort( ( a: UnitExt, b: UnitExt ) => {
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
            if ( p1.pu > p2.pu ) { // Si le prix de P1 est plus grand que le prix de P2
                return 1;
            } else if ( p1.pu < p2.pu ) {   // Si le prix de P1 est plus petit que le prix de P2
                return -1;
            } else {
                return 0;
            }
        } );


        // Retourne les produits filtrés
        filteredProducts = this.getOneProductPerRange( filteredProducts );

        // Récupère les vrais produits
        const products: Product[] = filteredProducts.map( ( product ) => {
            const p: Product | undefined = getProductByRef( product.ref );

            if ( p === undefined ) {
                throw new Error( 'Impossible de trouvé le produit : ' + product.ref );
            }

            return p;
        } );

        return products;
    }

    /**
     * Retourne les produits en ne gardant que le premier de chaque gamme
     *
     * @param produits Liste des produits
     */
    private getOneProductPerRange( produits: UnitExt[] ): UnitExt[] {
        const gammeMap = new Map<string, UnitExt>();

        produits.forEach( ( produit ) => {
            // Extrait la gamme à partir de la référence en utilisant les gammes spécifiées
            const gamme = AVAILABLE_RANGE.find( ( g ) => produit.ref.includes( g ) );
            // Si la gamme n'est pas déjà dans la carte, on l'ajoute
            if ( gamme && !gammeMap.has( gamme ) ) {
                gammeMap.set( gamme, produit );
            }
        } );

        // Convertit la carte en tableau de produits uniques
        return Array.from( gammeMap.values() );
    }

    public getInternalProducts( volumeECS: number, externalProduct: Product ): Product {
        const unitExt: UnitExt         = this.getUnitExtWithRealProduct( externalProduct );
        let filteredUnitInt: UnitInt[] = [];
        let bizone                     = this.isBiZone( this.housing.heaters );
        const size                     = unitExt.size;
        const isAtlantic               = unitExt.model === MODEL_ATLANTIC;


        // Pompe à chaleur bizone avec ECS n'existe pas, on doit rajouter un KIT-Bi-Zone
        // On passe donc bizone à false
        if ( isAtlantic && bizone ) {
            bizone               = false;
        } else {
            if ( bizone && volumeECS === 0 ) {
                bizone               = false;
            }
        }

        if ( isAtlantic ) {
            // On récupère le model intérieur selon les infos renseignées
            filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {
                return unit.model === MODEL_ATLANTIC && unit.hotWaterTank === volumeECS && unit.bizone === bizone && unit.sizes.includes(
                    size );
            } );
        } else {
            // On récupère le model intérieur selon les infos renseignées
            filteredUnitInt = this.unitIntList[ this.housing.availableVoltage ].filter( ( unit: UnitInt ) => {
                // Les highTemperature pas qu'à 65°C mais que pour les unites EPRA qui font de la haute température

                let highTemperature = false;
                if ( unitExt !== null ) {
                    highTemperature = unitExt.ref.includes( 'EPRA' );
                }

                // Sinon aute température on ne check pas la si c'est égal
                return unit.model === MODEL_DAIKIN && unit.hotWaterTank === volumeECS && unit.bizone === bizone && unit.sizes.includes( size ) && ( !highTemperature || highTemperature === unit.highTemperature );
            } );
        }
        // Récupère les vrais produits
        const products: Product[] = filteredUnitInt.map( ( product ) => {
            const p: Product | undefined = getProductByRef( product.ref );

            if ( p === undefined ) {
                throw new Error( 'Impossible de trouvé le produit : ' + product.ref );
            }

            return p;
        } );

        if ( products.length > 0 ) {
            return products[ 0 ];
        }

        throw new Error( 'Impossible de trouvé des produits ' );
    }

    private getUnitExtWithRealProduct( product: Product ): UnitExt {
        const unitExt = this.unitExtList[ this.housing.availableVoltage ].find( ( unitExt: UnitExt ) => {
            return unitExt.ref === product.reference;
        } );

        if ( unitExt === undefined ) {
            throw new Error( 'Impossible de trouvé le produit : ' + product.reference );
        }

        return unitExt;
    }

    public getProducts( volumeECS: number, sizingPercentage: number, model: string, ecsIsDeporte = false ) {
        let extProducts = this.getExternalProducts( sizingPercentage, model, ecsIsDeporte );

        if ( extProducts.length === 0 ) {
            return [];
        }

        // Parcours les produits extérieurs, si on ne trouve pas de produit intérieur compatible, on le retire de la liste
        extProducts = extProducts.filter( ( extProduct ) => {
            try {
                this.getInternalProducts( volumeECS, extProduct );
                return true;
            } catch ( e ) {
                return false;
            }
        } );

        // Si aucun produit n'est compatible, on retourne une liste vide
        if ( extProducts.length === 0 ) {
            return [];
        }

        return {
            'externals':            extProducts,
            'internal':             this.getInternalProducts( volumeECS, extProducts[ 0 ] ),
            'needBiZoneSupplement': this.needBiZoneSupplement( model, volumeECS ),
        };

    }

    /**
     * Détermine si un supplément de zone bizonale est nécessaire pour un modèle et un volume ECS donnés.
     * @param model La marque de la pompe à chaleur
     * @param volumeECS Le volume de l'eau chaude sanitaire.
     * @returns True si un supplément de zone bizonale est nécessaire, sinon False.
     */
    private needBiZoneSupplement( model: string, volumeECS: number ): boolean {
        const isBiZone           = this.isBiZone( this.housing.heaters );
        const isAtlantic         = model === MODEL_ATLANTIC;
        let needBiZoneSupplement = false;

        // Vérifie les conditions pour déterminer si un supplément de zone bizonale est nécessaire
        if ( ( isAtlantic && isBiZone ) || ( isBiZone && volumeECS === 0 ) ) {
            needBiZoneSupplement = true;
        }

        return needBiZoneSupplement;
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
