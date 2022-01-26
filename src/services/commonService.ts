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

