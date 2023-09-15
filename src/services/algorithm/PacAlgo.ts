import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

/**
 * Altitude suivie de la température de base
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

export class PacAlgo {

    protected housing: PacHousing;

    constructor( housing: PacHousing ) {
        this.housing = housing;
    }

    /**
     * Retourne la température de base pour DeltaT {@link calcDeltaT}
     * @param climaticZone
     * @param altitude
     */
    public getBaseTemperature = ( climaticZone: string, altitude: number ): number => {
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

        // Par défaut, on retourne -7
        console.warn( 'Coef non trouvé utilisation de la température par defaut -7' );
        return -7;
    };

    /**
     * Formate la température de base en string
     *
     * @param baseTemp
     */
    public formatBaseTemperature = ( baseTemp: number ): string => {
        if ( baseTemp > -4 ) {
            return '-4';
        } else if ( baseTemp === -10 ) {
            return '-11';
        } else if ( baseTemp === -12 ) {
            return '-13';
        } else if ( baseTemp === -14 ) {
            return '-15';
        } else {
            return baseTemp.toString();
        }
    };

    /**
     * Retourne le delta de la température
     * Correspond à la différence entre la température de consigne et la température de base
     * @param setPointTemperature
     * @param climaticZone
     * @param altitude
     */
    public calcDeltaT = ( setPointTemperature: number, climaticZone: string, altitude: number ): number => {
        return setPointTemperature - this.getBaseTemperature( climaticZone, altitude );
    };

    /**
     * Calcul la puissance (KW) minimal requise de la PAC
     * @param housing
     * @param overrideArea
     */
    public calcRequiredPower = ( housing: PacHousing, overrideArea?: number ): number => {
        // Volume à chauffer

        let volume: number = housing.area * housing.ceilingHeight;
        if ( overrideArea !== undefined ) {
            volume = overrideArea * housing.ceilingHeight;
        }


        const deltaT: number = this.calcDeltaT( housing.setPointTemperature, housing.climaticZone, housing.altitude );

        // Puissance en watt
        const power: number = +( volume * deltaT * housing.buildingCoefficient ).toFixed( 4 );

        // Retourne la puissance en KW
        return power / 1000;
    };

    public updateHousing( value: PacHousing ) {
        console.log( '%c UPDATE HOUSING', 'background: #fdd835; color: #000000' );
        this.housing = value;
    }
}

