import { ElMessage } from 'element-plus';

/**
 * Ajouter un zero devant un nombre inférieur à 10
 * @param n
 */
export const minTwoDigits = ( n: number ): string => {
    return ( n < 10 ? '0' : '' ) + n;
};

/**
 * Retourne la date au format Français
 * @param stringDate
 */
export const toFrenchDate = ( stringDate: string | number ): string => {
    if ( stringDate === '' || stringDate === null || stringDate === undefined ) {
        return '';
    }

    const date = new Date( stringDate );

    return `${ minTwoDigits( date.getDate() ) }/${ minTwoDigits( date.getMonth() + 1 ) }/${ date.getFullYear() }`;
};

/**
 * Retourne la date au format Anglais
 * @param stringDate
 */
export const toEnglishDate = ( stringDate: string | number ): string => {
    if ( stringDate === '' || stringDate === null || stringDate === undefined ) {
        return '';
    }

    const date = new Date( stringDate );

    return `${ date.getFullYear() }-${ minTwoDigits( date.getMonth() + 1 ) }-${ minTwoDigits( date.getDate() ) }`;
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

/**
 * Retourne un nombre en prix
 * @param number
 * @param quantity
 * @param canBeFree
 */
export const numberToPrice = ( number: number | string, quantity = 1, canBeFree = true ): string => {

    let convertedNumber: number;
    if ( typeof number === 'string' ) {
        convertedNumber = +number;
    } else if ( isNaN( number ) ) {
        return 'Erreur de calcul';
    } else {
        convertedNumber = number;
    }

    if ( quantity > 0 && convertedNumber === 0 && canBeFree ) {
        return 'Inclus';
    }

    convertedNumber = convertedNumber * quantity;

    return `${ convertedNumber.toFixed( 2 ) } €`;
};

