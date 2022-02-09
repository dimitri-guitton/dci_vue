/**
 * Interface pour le beneficiaire du Devis
 */
export interface Beneficiary {
    civility: string;
    lastName: string;
    firstName: string;
    address: string;
    zipCode: string;
    city: string;
    email: string;
    phone: string;
    mobile: string;
    income: number;
}
