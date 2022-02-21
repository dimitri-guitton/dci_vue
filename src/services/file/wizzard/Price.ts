export interface Price {
    HT: number;
    TTC: number;
    TVA: number;
    CEE?: number;
    maPrimeRenov: number;
    remainderToPay: number;
    discount?: number;
}
