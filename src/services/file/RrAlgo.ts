// TODO DEPRECATED

/**
 * Retourne la puissance requise selon la surface et l'isolation du local
 * @param area
 * @param insulationQuality
 */
import RrMulti from '@/types/v2/File/Rr/RrMulti';

export const calcRequiredPower = ( area: number, insulationQuality: number ): number => {
    const value = ( area * insulationQuality * 81 ) / 1000;
    return Math.round( value * 1e3 ) / 1e3;
};

/**
 * Retourne le model mono selon la puissance requise
 * @param power
 */
const getMonoModel = ( power ): number => {
    if ( power > 0 && power < 2 ) {
        return 20;
    }
    if ( power >= 2 && power < 2.8 ) {
        return 25;
    }
    if ( power >= 2.8 && power < 3.8 ) {
        return 35;
    }
    if ( power >= 3.8 && power < 5.4 ) {
        return 42;
    }
    if ( power >= 5.4 && power < 5.8 ) {
        return 50;
    }
    if ( power >= 5.8 && power < 7 ) {
        return 60;
    }
    if ( power >= 7 && power < 8.2 ) {
        return 70;
    }
    return -1;
};

/**
 *  Retourne le code produit intérieur selon le model et la gamme sélectionnée
 * @param model
 * @param assortment
 */
const getMonoCodeInt = ( model: number, assortment ): string => {

    assortment = assortment.toUpperCase();
    if ( model === 20 && assortment === 'PERFERA' ) {
        return 'DAIFTXM20R';
    }
    if ( model === 25 && assortment === 'PERFERA' ) {
        return 'DAIFTXM25R';
    }
    if ( model === 35 && assortment === 'PERFERA' ) {
        return 'DAIFTXM35R';
    }
    if ( model === 42 && assortment === 'PERFERA' ) {
        return 'DAIFTXM42R';
    }
    if ( model === 50 && assortment === 'PERFERA' ) {
        return 'DAIFTXM50R';
    }
    if ( model === 60 && assortment === 'PERFERA' ) {
        return 'DAIFTXM60R';
    }
    if ( model === 70 && assortment === 'PERFERA' ) {
        return 'DAIFTXM71R';
    }
    if ( model === 20 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF20C';
    }
    if ( model === 25 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF25C';
    }
    if ( model === 35 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF35C';
    }
    if ( model === 42 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF50A';
    }
    if ( model === 50 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF50A';
    }
    if ( model === 60 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF60A';
    }
    if ( model === 70 && assortment === 'SENSIRA' ) {
        return 'DAIFTXF71A';
    }
    if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA20BB';
    }
    if ( model === 25 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA25BB';
    }
    if ( model === 35 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA35BB';
    }
    if ( model === 42 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA42BB';
    }
    if ( model === 50 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA50BB';
    }
    if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA20AW';
    }
    if ( model === 25 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA25AW';
    }
    if ( model === 35 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA35AW';
    }
    if ( model === 42 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA42AW';
    }
    if ( model === 50 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA50AW';
    }
    if ( model === 20 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA20BS';
    }
    if ( model === 25 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA25BS';
    }
    if ( model === 35 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA35BS';
    }
    if ( model === 42 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA42BS';
    }
    if ( model === 50 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA50BS';
    }
    if ( model === 20 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA20BT';
    }
    if ( model === 25 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA25BT';
    }
    if ( model === 35 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA35BT';
    }
    if ( model === 42 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA42BT';
    }
    if ( model === 50 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA50BT';
    }
    if ( model === 20 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ20MW';
    }
    if ( model === 25 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ25MW';
    }
    if ( model === 35 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ35MW';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
        return 'FTXJ50MW';
    }
    if ( model === 20 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ20MS';
    }
    if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ25MS';
    }
    if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ35MS';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ50MS';
    }
    return 'empty';
};

/**
 * Retourne le code produit extérieur selon le model et la gamme sélectionnée
 * @param model
 * @param assortment
 */
const getMonoCodeExt = ( model, assortment ): string => {
    assortment = assortment.toUpperCase();
    if ( model === 20 && assortment === 'PERFERA' ) {
        return 'DAIRXM20R';
    }
    if ( model === 25 && assortment === 'PERFERA' ) {
        return 'DAIRXM25R';
    }
    if ( model === 35 && assortment === 'PERFERA' ) {
        return 'DAIRXM35R';
    }
    if ( model === 42 && assortment === 'PERFERA' ) {
        return 'DAIRXM42R';
    }
    if ( model === 50 && assortment === 'PERFERA' ) {
        return 'DAIRXM50R';
    }
    if ( model === 60 && assortment === 'PERFERA' ) {
        return 'DAIRXM60R';
    }
    if ( model === 70 && assortment === 'PERFERA' ) {
        return 'DAIRXM71R';
    }
    if ( model === 20 && assortment === 'SENSIRA' ) {
        return 'DAIRXF20A';
    }
    if ( model === 25 && assortment === 'SENSIRA' ) {
        return 'DAIRXF25A';
    }
    if ( model === 35 && assortment === 'SENSIRA' ) {
        return 'DAIRXF35A';
    }
    if ( model === 42 && assortment === 'SENSIRA' ) {
        return 'DAIRXF50A';
    }
    if ( model === 50 && assortment === 'SENSIRA' ) {
        return 'DAIRXF50A';
    }
    if ( model === 60 && assortment === 'SENSIRA' ) {
        return 'DAIRXF60A';
    }
    if ( model === 70 && assortment === 'SENSIRA' ) {
        return 'DAIRXF71A';
    }
    if ( model === 20 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
        return 'DAIRXA20A';
    }
    if ( model === 25 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
        return 'DAIRXA25A';
    }
    if ( model === 35 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
        return 'DAIRXA35A';
    }
    if ( model === 42 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
        return 'DAIRXA42B';
    }
    if ( model === 50 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
        return 'DAIRXA50B';
    }
    if ( model === 20 && assortment === 'EMURA_BLANC' ) {
        return 'DAIRXJ20M';
    }
    if ( model === 25 && assortment === 'EMURA_BLANC' ) {
        return 'DAIRXJ25M';
    }
    if ( model === 35 && assortment === 'EMURA_BLANC' ) {
        return 'DAIRXJ35M';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
        return 'DAIRXJ50M';
    }
    if ( model === 20 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIRXJ20M';
    }
    if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIRXJ25M';
    }
    if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIRXJ35M';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIRXJ50M';
    }

    return 'empty';
};

/**
 * Retourne le model mono selon la puissance requise
 * @param power
 */
const getMultiModel = ( power ): number => {
    if ( power > 0 && power < 1.5 ) {
        return 15;
    }
    if ( power >= 1.5 && power < 2 ) {
        return 20;
    }
    if ( power >= 2 && power < 2.8 ) {
        return 25;
    }
    if ( power >= 2.8 && power < 3.8 ) {
        return 35;
    }
    if ( power >= 3.8 && power < 5.4 ) {
        return 42;
    }
    if ( power >= 5.4 && power < 5.8 ) {
        return 50;
    }
    if ( power >= 5.8 && power < 7 ) {
        return 60;
    }
    if ( power >= 7 && power < 8.2 ) {
        return 70;
    }
    return -1;
};

/**
 * Retourne le code produit intérieur par pièce
 * @param model
 * @param assortment
 */
const getMultiCodePerRoom = ( model, assortment ): string => {
    console.log( 'Model -->', model );
    assortment = assortment.toUpperCase();
    console.log( 'Game -->', assortment );

    if ( model === 15 && assortment === 'PERFERA' ) {
        return 'DAICTXM15R';
    }
    if ( model === 20 && assortment === 'PERFERA' ) {
        return 'DAIFTXM20R';
    }
    if ( model === 25 && assortment === 'PERFERA' ) {
        return 'DAIFTXM25R';
    }
    if ( model === 35 && assortment === 'PERFERA' ) {
        return 'DAIFTXM35R';
    }
    if ( model === 42 && assortment === 'PERFERA' ) {
        return 'DAIFTXM42R';
    }
    if ( model === 50 && assortment === 'PERFERA' ) {
        return 'DAIFTXM50R';
    }
    if ( model === 60 && assortment === 'PERFERA' ) {
        return 'DAIFTXM60R';
    }
    if ( model === 70 && assortment === 'PERFERA' ) {
        return 'DAIFTXM71R';
    }
    if ( model === 15 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA15BB';
    }
    if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA20BB';
    }
    if ( model === 25 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA25BB';
    }
    if ( model === 35 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA35BB';
    }
    if ( model === 42 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA42BB';
    }
    if ( model === 50 && assortment === 'STYLISH_NOIR' ) {
        return 'DAIFTXA50BB';
    }
    if ( model === 15 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA15AW';
    }
    if ( model === 20 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA20AW';
    }
    if ( model === 25 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA25AW';
    }
    if ( model === 35 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA35AW';
    }
    if ( model === 42 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA42AW';
    }
    if ( model === 50 && assortment === 'STYLISH_BLANC' ) {
        return 'DAIFTXA50AW';
    }
    if ( model === 15 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA15BS';
    }
    if ( model === 20 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA20BS';
    }
    if ( model === 25 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA25BS';
    }
    if ( model === 35 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA35BS';
    }
    if ( model === 42 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA42BS';
    }
    if ( model === 50 && assortment === 'STYLISH_ARGENT' ) {
        return 'DAIFTXA50BS';
    }
    if ( model === 15 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA15BT';
    }
    if ( model === 20 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA20BT';
    }
    if ( model === 25 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA25BT';
    }
    if ( model === 35 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA35BT';
    }
    if ( model === 42 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA42BT';
    }
    if ( model === 50 && assortment === 'STYLISH_BOIS' ) {
        return 'DAIFTXA50BT';
    }
    if ( model > 0 && model <= 20 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ20MW';
    }
    if ( model === 25 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ25MW';
    }
    if ( model === 35 && assortment === 'EMURA_BLANC' ) {
        return 'DAIFTXJ35MW';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
        return 'FTXJ50MW';
    }
    if ( model > 0 && model <= 20 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ20MS';
    }
    if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ25MS';
    }
    if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ35MS';
    }
    if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
        return 'DAIFTXJ50MS';
    }
    return 'empty';
};

/**
 *  Retourne le code produit du groupes
 * @param groupPower
 * @param nbRoom
 */
const getMultiCodeGroup = ( groupPower, nbRoom ): string => {
    console.log( 'Goupe power -->', groupPower );
    console.log( 'NbRoom -->', nbRoom );

    if ( nbRoom <= 2 && groupPower <= 4.2 ) {
        return 'DAI2MXM40N';
    }
    if ( nbRoom <= 2 && groupPower > 4.2 && groupPower <= 5.7 ) {
        return 'DAI2MXM50N';
    }
    if ( nbRoom <= 3 && groupPower <= 4.6 ) {
        return 'DAI3MXM40N8';
    }
    if ( nbRoom <= 3 && groupPower > 4.6 && groupPower <= 6.8 ) {
        return 'DAI3MXM52N8';
    }
    if ( nbRoom <= 3 && groupPower > 6.8 && groupPower <= 7.9 ) {
        return 'DAI3MXM68N';
    }
    if ( nbRoom <= 4 && groupPower <= 8.6 ) {
        return 'DAI4MXM68N9';
    }
    if ( nbRoom <= 4 && groupPower > 8.6 && groupPower <= 9.65 ) {
        return 'DAI4MXM80N9';
    }
    if ( nbRoom <= 5 && groupPower <= 10.5 ) {
        return 'DAI5MXM90N9';
    }

    return 'empty';
};

const rrCalcCEEFacteurCorrectif = ( localType, area ) => {
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
    if ( area > 0 && area <= 34 ) {
        return 0.3;
    }
    if ( area > 34 && area <= 59 ) {
        return 0.5;
    }
    if ( area > 59 && area <= 69 ) {
        return 0.6;
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

const rrCalcCEEKWHCumac = ( localType, zone, scop ) => {
    localType = localType.toUpperCase();
    if ( localType === 'APPARTEMENT' ) {
        if ( zone === 'H1' ) {
            return 21.3;
        }
        if ( zone === 'H2' ) {
            return 17.4;
        }
        if ( zone === 'H3' ) {
            return 11.6;
        }
    } else {
        if ( scop >= 3.9 && scop < 4.3 ) {
            if ( zone === 'H1' ) {
                return 77.9;
            }
            if ( zone === 'H2' ) {
                return 63.7;
            }
            if ( zone === 'H3' ) {
                return 42.5;
            }
        }
        if ( scop >= 4.3 ) {
            if ( zone === 'H1' ) {
                return 80.2;
            }
            if ( zone === 'H2' ) {
                return 65.6;
            }
            if ( zone === 'H3' ) {
                return 47.7;
            }
        }
    }
    return 0;
};

const rrCalcCEEStatut = ( codePrime, ceeCoef, createdAtString ) => {
    if ( codePrime === 'P' ) {
        return ceeCoef;
    }
    if ( codePrime === 'GP' ) {
        const createdAt = new Date( createdAtString );
        const oldPrime  = new Date( '2022/01/01 00:00:00' );

        if ( createdAt > oldPrime ) {
            console.log( '%c COEF HORS COUP DE POUCE SANS LE *2', 'background: #ff195b; color: #000000' );
            return ceeCoef;
        }
        return ceeCoef * 2;
    }
    if ( codePrime === 'CL' || codePrime === 'IT' ) {
        return ceeCoef;
    }
    return 0;
};

const rrCalCEEPrime = ( localType, produit, surface, zone, codePrime, scop, ceeCoef, createdAtString ) => {
    localType = localType.toUpperCase();
    if ( localType === 'MAISON_INDIVIDUELLE' ) {
        console.log( '__multi rrCalcCEEFacteurCorrectif ---> ', rrCalcCEEFacteurCorrectif( localType, surface ) );
        console.log( '__multi rrCalcCEEKWHCumac --> ', rrCalcCEEKWHCumac( localType, zone, scop ) );

        return rrCalcCEEFacteurCorrectif( localType, surface ) * ( rrCalcCEEKWHCumac( localType, zone, scop ) * rrCalcCEEStatut( codePrime,
                                                                                                                                 ceeCoef,
                                                                                                                                 createdAtString ) );
    }
    return rrCalcCEEFacteurCorrectif( localType, surface ) * ( rrCalcCEEKWHCumac( localType, zone, scop ) * rrCalcCEEStatut( codePrime,
                                                                                                                             ceeCoef,
                                                                                                                             createdAtString ) );
};

/**
 * Retourne les codes des produits des PAC RR en mono
 * @param area
 * @param insulationQuality
 * @param assortment
 */
export const getPacRrMono = ( area: number, insulationQuality: number, assortment: string ): { productInt: string; productExt: string } => {
    const power      = calcRequiredPower( area, insulationQuality );
    const model      = getMonoModel( power );
    const productInt = getMonoCodeInt( model, assortment ).toUpperCase();
    const productExt = getMonoCodeExt( model, assortment ).toUpperCase();

    return {
        productInt,
        productExt,
    };
};

/**
 *  Retourne les codes des produits des PAC RR en multi
 */
export const getPacRrMulti = ( rrMulti: RrMulti,
                               insulationQuality: number,
                               assortment: string ): { productGroup: string; productsPerRoom: string[] } => {
    let totalPower                  = 0;
    const productsPerRoom: string[] = [];

    for ( let i = 1; i <= rrMulti.roomNumber; i++ ) {
        let power = 0;
        switch ( i ) {
            case 1:
                power = calcRequiredPower( rrMulti.areaP1, insulationQuality );
                break;
            case 2:
                power = calcRequiredPower( rrMulti.areaP2, insulationQuality );
                break;
            case 3:
                power = calcRequiredPower( rrMulti.areaP3, insulationQuality );
                break;
            case 4:
                power = calcRequiredPower( rrMulti.areaP4, insulationQuality );
                break;
            case 5:
                power = calcRequiredPower( rrMulti.areaP5, insulationQuality );
                break;
            default:
                break;
        }

        const model = getMultiModel( power );
        const code  = getMultiCodePerRoom( model, assortment );
        productsPerRoom.push( code );

        totalPower += power;
    }

    const productGroup = getMultiCodeGroup( totalPower, rrMulti.roomNumber );


    return {
        productGroup,
        productsPerRoom,
    };
};
