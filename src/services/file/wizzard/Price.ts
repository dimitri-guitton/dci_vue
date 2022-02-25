export interface Price {
    HT: number;
    TTC: number;
    TVA: number;
    CEE?: number;
    maPrimeRenov?: number;
    housingAction?: number;
    remainderToPay: number;
    discount?: number;
}
