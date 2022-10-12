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
    private energyZone: string;


    constructor( quotation: PvQuotation, worksheet: PvWorkSheet, energyZone: string ) {
        this.quotation  = quotation;
        this.worksheet  = worksheet;
        this.energyZone = energyZone;
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
        if ( this.energyZone === 'H1' ) {
            if ( this.worksheet.orientation === 'sud' ) {
                console.log( 'IN SUD' );
                return 448;
            } else if ( this.worksheet.orientation === 'sud_ouest' ) {
                console.log( 'IN SUD OUEST' );
                return 425;
            } else if ( this.worksheet.orientation === 'sud_est' ) {
                console.log( 'IN SUD EST' );
                return 429;
            } else if ( this.worksheet.orientation === 'ouest' ) {
                console.log( 'IN OUEST' );
                return 371;
            } else if ( this.worksheet.orientation === 'est' ) {
                console.log( 'IN EST' );
                return 387;
            }
        } else {
            if ( this.worksheet.orientation === 'sud' ) {
                console.log( 'IN SUD' );
                return 458;
            } else if ( this.worksheet.orientation === 'sud_ouest' ) {
                console.log( 'IN SUD OUEST' );
                return 457;
            } else if ( this.worksheet.orientation === 'sud_est' ) {
                console.log( 'IN SUD EST' );
                return 458;
            } else if ( this.worksheet.orientation === 'ouest' ) {
                console.log( 'IN OUEST' );
                return 395;
            } else if ( this.worksheet.orientation === 'est' ) {
                console.log( 'IN EST' );
                return 397;
            }
        }

        return 0;
    }

    /**
     * Prix TTC posé des panneaux
     */
    public calclTotalTtcPerPanel(): number {
        let totalHt    = 0;
        let totalPower = 0;
        let nbPanel    = 3;
        let laying     = 0;
        let tva        = 10;
        console.log( this.quotation );
        for ( const selectedProduct of this.quotation.selectedProducts ) {
            if ( selectedProduct.productType === 'pv' ) {
                const power = selectedProduct.power !== undefined
                              ? selectedProduct.power
                              : 0;
                totalPower  = selectedProduct.quantity * power;
                nbPanel     = selectedProduct.quantity;
            }
            totalHt += selectedProduct.pu * selectedProduct.quantity;
        }
        console.log( 'Total HT --> ', totalHt );
        console.log( 'nbPanel --> ', nbPanel );
        console.log( 'totalPower --> ', totalPower );

        for ( const option of this.quotation.options ) {
            if ( option.id === 38 ) {
                if ( nbPanel <= 4 ) {
                    laying = 800;
                } else if ( nbPanel === 5 ) {
                    laying = 1000;
                } else if ( nbPanel <= 7 ) {
                    laying = 1100;
                } else if ( nbPanel <= 10 ) {
                    laying = 1500;
                } else if ( nbPanel <= 15 ) {
                    laying = 2150;
                } else {
                    laying = 2500;
                }
            } else {
                if ( option.number > 0 ) {
                    totalHt += option.pu * option.number;
                }
            }
        }
        console.log( 'Laying --> ', laying );

        if ( totalPower >= 3000 ) {
            tva = 20;
        }

        return ( totalHt + laying ) * ( tva / 100 + 1 );
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
                let resaleToEdf = result[ result.length - 1 ].resaleToEdf * 1.015;

                // La revente avec EDF est sur 20 ans et non 25 ans
                if ( year > currentYear + 19 ) {
                    resaleToEdf = -1;
                }

                const percentage       = 1 + ( this.worksheet.electricityPriceEvolution / 100 );
                const savingsOnInvoice = result[ result.length - 1 ].savingsOnInvoice * percentage;
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
                const percentage = 1 + ( this.worksheet.electricityPriceEvolution / 100 );
                const kwhEdf     = result[ result.length - 1 ].kwhEdf * percentage;
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
