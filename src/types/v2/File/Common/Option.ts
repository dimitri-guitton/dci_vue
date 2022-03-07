/**
 * Interface pour les options dans le devis
 */
export interface Option {
    id: number;
    fileType: string;
    label: string;
    unit: string;
    defaultPu: number;
    pu: number;
    defaultNumber: number;
    number: number;
    calcTva10?: boolean;
}
