/**
 * Ajouter un zero devant un nombre inférieur à 10
 * @param n
 */
export const minTwoDigits = ( n: number ) => {
    return ( n < 10 ? '0' : '' ) + n;
};
