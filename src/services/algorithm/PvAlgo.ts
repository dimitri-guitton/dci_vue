import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';

interface PhotovoltaicBenefits {
    year: number;
    resaleToEdf: number;
    savingsOnInvoice: number;
    totalGains: number;
}

interface PriceEvolution {
    year: number;
    kwhEdf: number;
    kwhPhotovoltaic: number;
}

export class PvAlgo {
    private quotation: PvQuotation;
    private worksheet: PvWorkSheet;


    constructor( quotation: PvQuotation, worksheet: PvWorkSheet ) {
        this.quotation = quotation;
        this.worksheet = worksheet;
    }

    /**
     * Prix moyen du KWh sur la facture électrique
     */
    public calcAveragePricePerKWhOnElectricBill(): number {
        return this.worksheet.montantFactureElectrique / this.worksheet.totalKwhFactureElectrique;
    }

    /**
     * Production par panneau en KWh
     */
    public productionPerPanelInKWh(): number {
        if ( this.worksheet.orientation === 'sud' ) {
            return 456.25;
        } else if ( this.worksheet.orientation === 'est_ouest' ) {
            return 406.25;
        } else if ( this.worksheet.orientation === 'sud_est_sud_ouest' ) {
            return 431.25;
        }

        return 0;
    }

    /**
     * Prix TTC posé des panneaux
     */
    public calclTotalTtcPerPanel(): number {
        if ( this.quotation.selectedProducts.length > 0 ) {
            const selectedProduct    = this.quotation.selectedProducts[ 0 ];
            const power: number      = selectedProduct.power !== undefined ? selectedProduct.power : 0;
            const laying: number     = selectedProduct.laying !== undefined ? selectedProduct.laying : 0;
            const totalPower: number = power * selectedProduct.quantity;
            let tva                  = 10;

            if ( totalPower > 3000 ) {
                tva = 20;
            }

            const priceHt = selectedProduct.quantity * selectedProduct.pu + laying;

            return priceHt * ( tva / 100 + 1 );
        }

        return 0;
    }

    /**
     * Calcul le total TTC avec les montant des primes déduites
     */
    public calcTotalTtcWithBonusDeducted() {
        return this.calclTotalTtcPerPanel() - this.quotation.selfConsumptionBonus;
    }

    /**
     * Production de l'installation en KWh
     */
    public calcInstallationProduction(): number {
        if ( this.quotation.selectedProducts.length > 0 ) {
            return this.quotation.selectedProducts[ 0 ].quantity * this.productionPerPanelInKWh();
        }

        return 0;
    }

    /**
     * Prix de vente moyen du KWh phtovoltaîque en €
     */
    public calcPhotovoltaicAverageSellingPrice(): number {
        return this.calcTotalTtcWithBonusDeducted() / ( this.calcInstallationProduction() * 25 );
    }

    /**
     * Prix de revente auprès d'EDF en €
     */
    public calcResalePriceToEdf(): number {
        return this.calcInstallationProduction() * 0.5 * 0.1;
    }

    /**
     * Economie sur la facture en €
     */
    public savingsOnBill(): number {
        return this.calcInstallationProduction() * this.calcAveragePricePerKWhOnElectricBill() * 0.5;
    }

    /**
     * Gains phtovoltaîques sur 25 ans
     */
    public benefitsOver25Years(): PhotovoltaicBenefits[] {
        const currentYear: number            = new Date().getFullYear();
        const result: PhotovoltaicBenefits[] = [];

        for ( let year = currentYear; year < currentYear + 25; year++ ) {
            if ( year === currentYear ) {
                result.push( {
                                 year,
                                 resaleToEdf:      this.calcResalePriceToEdf(),
                                 savingsOnInvoice: this.savingsOnBill(),
                                 totalGains:       this.calcResalePriceToEdf() + this.savingsOnBill(),
                             } );
            } else {
                const resaleToEdf      = result[ result.length - 1 ].resaleToEdf * 1.02;
                const savingsOnInvoice = result[ result.length - 1 ].savingsOnInvoice * 1.030925266;
                result.push( {
                                 year,
                                 resaleToEdf,
                                 savingsOnInvoice,
                                 totalGains: resaleToEdf + savingsOnInvoice,
                             } );
            }
        }

        return result;
    }

    /**
     * Evolution du prix de KWh sur 25 ans
     */
    public priceEvolutionOver25Years(): PriceEvolution[] {
        const currentYear: number      = new Date().getFullYear();
        const result: PriceEvolution[] = [];

        for ( let year = currentYear; year < currentYear + 25; year++ ) {
            if ( year === currentYear ) {
                result.push( {
                                 year,
                                 kwhEdf:          this.calcAveragePricePerKWhOnElectricBill(),
                                 kwhPhotovoltaic: this.calcPhotovoltaicAverageSellingPrice(),
                             } );
            } else {
                const kwhEdf = result[ result.length - 1 ].kwhEdf * 1.030925266;
                result.push( {
                                 year,
                                 kwhEdf,
                                 kwhPhotovoltaic: this.calcPhotovoltaicAverageSellingPrice(),
                             } );
            }
        }

        return result;
    }

    /**
     * Gain mensuel (moyenne sur 25 ans)
     */
    public monthlyBenefitsAverage25Year(): number {
        return this.sumBenefits25Years() / 25 / 12;
    }

    /**
     * Rendement financier (moyenne sur 25 ans)
     */
    public financialReturnAverage25Years(): number {
        return ( this.sumBenefits25Years() / 25 / this.calcTotalTtcWithBonusDeducted() ) * 100;
    }

    /**
     * Sommes des bénéfices sur 25 ans
     */
    public sumBenefits25Years(): number {
        const benefits = this.benefitsOver25Years();

        let sum = 0;
        for ( const benefit of benefits ) {
            sum += benefit.totalGains;
        }

        return sum;
    }
}
