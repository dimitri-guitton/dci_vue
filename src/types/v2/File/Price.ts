export interface Price {
    laying?: number;
    HT: number;
    TTC: number;
    TVA: number;
    TVA10?: number;
    TVA20?: number;
    CEE?: number;
    maPrimeRenov?: number;
    remainderToPay: number;
    discount?: number;
    selfConsumptionBonus?: number;
}
