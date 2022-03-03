/**
 * Altitude suivi de la température de base
 */
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';

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

interface PacItem {
    ref: string;
}

interface PacList {
    monopahse: PacItem[];
    triphase: PacItem[];
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
export const calcRequiredPower = ( housing: PacHousing ): number => {
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

export const getPacRo = () => {
    console.log( 'IN GET PAC RO' );
};

