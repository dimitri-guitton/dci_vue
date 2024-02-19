/**
 * Interface pour les données du Géoportail
 */
export interface DataGeoportail {
    position: {
        x: number;
        y: number;
    };
    zipCode: string;
    city: string;
    address: string;
    plot: string;
}
