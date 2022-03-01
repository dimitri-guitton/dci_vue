/**
 * Calcule la puissance requise pour une PAC RO
 * @param ceilingHeight Hauteur sous plafond
 * @param area  Superficie
 * @param zone  Zone géographique
 * @param insulationQuality Isolation
 */
import { Product } from '@/types/v2/File/Common/Product';

const calcRequiredPower = ( ceilingHeight: number, area: number, zone: string, insulationQuality: number ): number => {
    let initZone = 27;
    if ( zone !== null && zone.toUpperCase() === 'H2' ) {
        initZone = 25;
    }

    return ( ceilingHeight * area * initZone * insulationQuality * 1.2 ) / 1000;
};

/**
 * Calcul le model pour une PAC RPO
 * @param power Puissance
 */
const calcModel = ( power: number ): number => {

    if ( power >= 0 && power < 4.5 ) {
        return 4;
    }
    if ( power >= 4.5 && power < 6.8 ) {
        return 6;
    }
    if ( power >= 6.8 && power < 9 ) {
        return 8;
    }
    if ( power >= 9 && power < 11 ) {
        return 11;
    }
    if ( power >= 11 && power < 14 ) {
        return 14;
    }
    if ( power >= 14 && power < 18 ) {
        return 16;
    }
    if ( power >= 18 && power < 22 ) {
        return 22;
    }
    if ( power >= 22 && power < 30 ) {
        return 32;
    }
    return -1;
};

/**
 *  Retourne le code produit "Intérieur" d'une PAC RO Monophasé
 * @param model
 * @param volumeECS
 */
const getMonoCodeInt = ( model: number, volumeECS: number ): string => {
    if ( model === 4 && volumeECS < 180 ) {
        return 'DAIEBH04D6V';
    }
    if ( ( model === 6 || model === 8 ) && volumeECS < 180 ) {
        return 'DAIEHBH08E6V';
    }
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS < 180 ) {
        return 'DAIEABH16D6V';
    }
    if ( model === 4 && volumeECS < 230 ) {
        return 'DAIEHVH04S18E6V';
    }
    if ( model === 4 && volumeECS >= 230 ) {
        return 'DAIEHVH04S23E6V';
    }
    if ( ( model === 6 || model === 8 ) && volumeECS < 230 ) {
        return 'DAIEHVH08S18E6V';
    }
    if ( ( model === 6 || model === 8 ) && volumeECS >= 230 ) {
        return 'DAIEHVH08S23E6V';
    }
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS < 230 ) {
        return 'DAIEAVH16S18D6V';
    }
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS >= 230 ) {
        return 'DAIEAVH16S23D6V';
    }
    if ( model === 22 || model === 32 ) {
        return 'DAIEABH16D6V';
    }
    return 'empty';
};

/**
 * Retourne le code produit "Intérieur" d'une PAC RO Triphasé
 * @param model
 * @param volumeECS
 */
const getTriCodeInt = ( model: number, volumeECS: number ): string => {
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS < 180 ) {
        return 'DAIETBH16D9W';
    }
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS < 230 ) {
        return 'DAIETVH16S18D9W';
    }
    if ( ( model === 11 || model === 14 || model === 16 ) && volumeECS >= 230 ) {
        return 'DAIETVH16S23D9W';
    }
    if ( model === 22 || model === 32 ) {
        return 'DAIETBH16D9W';
    }

    return 'empty';
};

/**
 * Retourne le code produit "Exterieur" d'une PAC RO Monophasé
 * @param model
 */
const getMonoCodeExt = ( model: number ): string => {
    if ( model === 4 ) {
        return 'DAIERGA04EV';
    }
    if ( model === 6 ) {
        return 'DAIERGA06EV';
    }
    if ( model === 8 ) {
        return 'DAIERGA08EV';
    }
    if ( model === 11 || model === 22 ) {
        return 'DAIEPGA11DV';
    }
    if ( model === 14 ) {
        return 'DAIEPGA14DV';
    }
    if ( model === 16 || model === 32 ) {
        return 'DAIEPGA16DV';
    }
    return 'empty';
};

/**
 * Retourne le code produit "Exterieur" d'une PAC RO Triphasé
 * @param model
 */
const getTriCodeExt = ( model: number ): string => {
    if ( model === 11 || model === 22 ) {
        return 'DAIEPRA14DW1';
    }
    if ( model === 14 ) {
        return 'DAIEPRA16DW1';
    }
    if ( model === 16 || model === 32 ) {
        return 'DAIEPRA18DW1';
    }
    return 'empty';
};

/**
 * Retourne le facteur correctif pour la prime CEE des PAC RO
 * @param localType
 * @param area  Superficie
 */
const calcCeeFacteurCorrectif = ( localType: string, area: number ): number => {
    localType = localType.toUpperCase();

    if ( localType === 'APPARTEMENT' ) {
        if ( area > 0 && area <= 34 ) {
            return 0.5;
        }
        if ( area > 34 && area <= 59 ) {
            return 0.7;
        }
        if ( area > 59 && area <= 69 ) {
            return 1;
        }
        if ( area > 69 && area <= 89 ) {
            return 1.2;
        }
        if ( area > 89 && area <= 109 ) {
            return 1.5;
        }
        if ( area > 109 && area <= 130 ) {
            return 1.9;
        }
        if ( area > 130 ) {
            return 2.5;
        }
        return 0;
    }

    // Maison individuelle
    if ( area > 0 && area <= 69 ) {
        return 0.5;
    }
    if ( area > 69 && area <= 89 ) {
        return 0.7;
    }
    if ( area > 89 && area <= 109 ) {
        return 1;
    }
    if ( area > 109 && area <= 130 ) {
        return 1.1;
    }
    if ( area > 130 ) {
        return 1.6;
    }
    return 0;
};

/**
 * Retourne le montant de Ma Prime Renov
 * @param codePrime
 */
const calcMaPrimeRenov = ( codePrime ) => {
    if ( codePrime === 'GP' ) {
        return 4000;
    }
    if ( codePrime === 'P' ) {
        return 3000;
    }
    if ( codePrime === 'IT' ) {
        return 2000;
    }
    return 0;
};

/**
 * Calcul le montant de la prime CEE
 * @param codePrime
 * @param ceeCoef
 */
export const getPrimeCee = ( codePrime: string, ceeCoef: number ): number => {
    if ( codePrime === 'GP' || codePrime === 'P' ) {
        return 727.3 * ceeCoef;
    }

    if ( codePrime === 'IT' || codePrime === 'CL' ) {
        return 454.5 * ceeCoef;

    }
    return 0;
};

/**
 * Retourne la Prime CEE de Synerciel
 */
export const getCeeSynerciel = ( pac: Product, localType: string, area: number, zone: string, codePrime: string ) => {
    localType = localType.toUpperCase();

    // if ( zone === 'H1' ) {
    //     if ( localType === 'APPARTEMENT' ) {
    //         if ( pac.etas >= 120 ) {
    //             if ( codePrime === 'GP' ) {
    //                 if ( area > 0 && area < 35 ) {
    //                     return 92.575;
    //                 }
    //                 if ( area >= 35 && area < 60 ) {
    //                     return 129.605;
    //                 }
    //                 if ( area >= 60 && area < 70 ) {
    //                     return 185.15;
    //                 }
    //                 if ( area >= 70 && area < 90 ) {
    //                     return 222.18;
    //                 }
    //                 if ( area >= 90 && area < 110 ) {
    //                     return 277.725;
    //                 }
    //                 if ( area >= 110 && area <= 130 ) {
    //                     return 351.785;
    //                 }
    //                 if ( area > 130 ) {
    //                     return 462.875;
    //                 }
    //             } else {
    //                 if ( area > 0 && area < 35 ) {
    //                     return 86.94;
    //                 }
    //                 if ( area >= 35 && area < 60 ) {
    //                     return 121.72;
    //                 }
    //                 if ( area >= 60 && area < 70 ) {
    //                     return 173.88;
    //                 }
    //                 if ( area >= 70 && area < 90 ) {
    //                     return 208.66;
    //                 }
    //                 if ( area >= 90 && area < 110 ) {
    //                     return 260.82;
    //                 }
    //                 if ( area >= 110 && area <= 130 ) {
    //                     return 330.37;
    //                 }
    //                 if ( area > 130 ) {
    //                     return 434.70;
    //                 }
    //             }
    //         }
    //     }
    // }


};

/**
 * Retourne le montant de l'aide pour les PAC RO
 * @param totalTTC
 * @param cee
 * @param codePrime
 */
export const getAideRO = ( totalTTC, cee, codePrime ) => {
    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee > totalTTC * 0.1 && codePrime === 'GP' ) {
        return 4000;
    }
    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee < totalTTC * 0.1 && codePrime === 'GP' ) {
        return totalTTC - cee - totalTTC * 0.1;
    }

    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee > totalTTC * 0.25 && codePrime === 'P' ) {
        return 3000;
    }
    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee < totalTTC * 0.25 && codePrime === 'P' ) {
        return totalTTC - cee - totalTTC * 0.25;
    }

    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee > totalTTC * 0.4 && codePrime === 'IT' ) {
        return 2000;
    }
    if ( totalTTC - calcMaPrimeRenov( codePrime ) - cee < totalTTC * 0.4 && codePrime === 'IT' ) {
        return totalTTC - cee - totalTTC * 0.4;
    }
    return 0;
};

/**
 * Retourne une PAC RO selon les paramètre du devis
 * @param ceilingHeight Hauteur sous plafond
 * @param area  Superficie
 * @param zone  Zone géographique
 * @param insulationQuality Isolation
 * @param availableVoltage  Tension disponible
 * @param volumeECS
 */
export const getPacRo = ( ceilingHeight: number,
                          area: number,
                          zone: string,
                          insulationQuality: number,
                          availableVoltage: string,
                          volumeECS: number ): { cascadeSystem: boolean; productInt: string; productExt: string } => {

    const power = calcRequiredPower( ceilingHeight, area, zone, insulationQuality );
    const model = calcModel( power );

    let cascadeSystem = false;
    let productInt: string;
    let productExt: string;

    if ( model > 20 ) {
        cascadeSystem = true;
    }


    if ( availableVoltage === 'triphase' ) {
        productInt = getTriCodeInt( model, volumeECS );
        productExt = getTriCodeExt( model );
    } else {
        productInt = getMonoCodeInt( model, volumeECS );
        productExt = getMonoCodeExt( model );
    }

    return {
        cascadeSystem,
        productInt,
        productExt,
    };
};
