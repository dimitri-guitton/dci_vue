import { ElMessage } from 'element-plus';

/**
 * Ajouter un zero devant un nombre inférieur à 10
 * @param n
 */
export const minTwoDigits = ( n: number ): string => {
    return ( n < 10 ? '0' : '' ) + n;
};

/**
 * Retourne la date au format français
 * @param stringDate
 */
export const toFrenchDate = ( stringDate: string | number ): string => {

    if ( stringDate === null ) {
        return '';
    }

    const date = new Date( stringDate );

    return `${ minTwoDigits( date.getDate() ) }/${ minTwoDigits( date.getMonth() + 1 ) }/${ date.getFullYear() }`;
};

/**
 * Check si on est connecté à internet
 */
export const checkInternet = (): boolean => {
    if ( navigator.onLine ) {
        return true;
    }

    ElMessage( {
                   message: 'Vous n\'êtes pas connecté à Internet',
                   type:    'warning',
               } );

    return false;
};

export const numberToPrice = ( number: number | string ): string => {

    let convertedNumber: number;
    if ( typeof number === 'string' ) {
        convertedNumber = +number;
    } else if ( isNaN( number ) ) {
        return 'Erreur de calcul';
    } else {
        convertedNumber = number;
    }

    if ( convertedNumber === 0 ) {
        return 'Inclus';
    }

    return `${ convertedNumber.toFixed( 2 ) } €`;
};

