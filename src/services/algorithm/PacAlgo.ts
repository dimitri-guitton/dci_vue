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

        // Par défaut on retourne -7
        console.warn( 'Coef non trouvé utilisation de la température par defaut -7' );
        return -7;
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
     * @param type
     */
    public calcRequiredPower = ( housing: PacHousing, type = '' ): number => {
        // Volume à chauffer
        const volume: number = housing.area * housing.ceilingHeight;

        const deltaT: number = this.calcDeltaT( housing.setPointTemperature, housing.climaticZone, housing.altitude );

        let coef = 1;
        if ( type === 'pac_rr' ) {  // SI pac RR on surdimensionne de 10%
            coef = 1.1;
        } else if ( type === 'pac_ro' ) {
            coef = 0.9;
        }

        // Puissance en W
        const power: number = +( volume * deltaT * housing.buildingCoefficient * coef ).toFixed( 4 );


        console.log( {
                         'area':                 housing.area,
                         'hauteur_sous_plafond': housing.ceilingHeight,
                         'volume':               volume,
                         'temperature_consigne': housing.setPointTemperature,
                         'zone_climatique':      housing.climaticZone,
                         'altitude':             housing.altitude,
                         'delta_t':              deltaT,
                         'coef_construction':    housing.buildingCoefficient,
                         'puissance_w':          power,
                     } );

        // Retourne la puissance en KW
        return power / 1000;
    };

    public updateHousing( value: PacHousing ) {
        this.housing = value;

    }
}

