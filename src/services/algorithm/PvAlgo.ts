import { PvQuotation } from '@/types/v2/File/Pv/PvQuotation';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';
import axios from 'axios';
import { Housing } from '@/types/v2/File/Common/Housing';

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
     * Production par panneau en kWh
     */
    public productionPerPanelInKWh( year = 1 ): number {
        // Watt crête
        let wc = 0;

        if ( this.energyZone === 'H1' ) {
            if ( this.worksheet.orientation === 'sud' ) {
                wc = 1190;
            } else if ( this.worksheet.orientation === 'sud_ouest' ) {
                wc = 1126;
            } else if ( this.worksheet.orientation === 'sud_est' ) {
                wc = 1127;
            } else if ( this.worksheet.orientation === 'ouest' ) {
                wc = 964;
            } else if ( this.worksheet.orientation === 'est' ) {
                wc = 964;
            }
        } else {
            if ( this.worksheet.orientation === 'sud' ) {
                wc = 1250;
            } else if ( this.worksheet.orientation === 'sud_ouest' ) {
                wc = 1188;
            } else if ( this.worksheet.orientation === 'sud_est' ) {
                wc = 1177;
            } else if ( this.worksheet.orientation === 'ouest' ) {
                wc = 1016;
            } else if ( this.worksheet.orientation === 'est' ) {
                wc = 1002;
            }
        }

        // Le ratio est en kWc
        const ratio = wc / 1000;
        let calculatedPower = 0;

        if ( this.quotation.selectedProducts.length > 0 ) {
            const product = this.quotation.selectedProducts[ 0 ];
            if ( year === 1 ) {
                if ( product.ext1 !== undefined ) {
                    const percentage = 1 - ( parseFloat( product.ext1 ) / 100 );
                    if ( product.power !== undefined ) {
                        const power     = product.power * ratio;
                        calculatedPower = power * percentage;
                    }
                }
            } else {
                if ( product.ext1 !== undefined && product.ext2 !== undefined ) {
                    const coefYear1     = parseFloat( product.ext1 );
                    const coefOtherYear = ( parseFloat( product.ext2 ) - coefYear1 ) / 24;
                    if ( product.power !== undefined ) {
                        const power     = product.power * ratio;
                        calculatedPower = power * ( 1 - ( coefYear1 / 100 ) );
                        calculatedPower = calculatedPower * ( 1 - ( ( year * coefOtherYear ) / 100 ) );
                    }

                }
            }
        }

        // console.log( calculatedPower + ' kWh' );
        return calculatedPower;
    }

    public static async calcInstallationProductionV2( housing: Housing, quotation: PvQuotation, orientation = 'sud' ): Promise<number> {
        // console.log( '%c calcInstallationProductionV2', 'background: #fdd835; color: #000000' );
        const aspect = {
            'sud':       0,
            'sud_ouest': 45,
            'sud_est':   90,
            'ouest':     315,
            'est':       -90,
        };

        // Peakpower - puissance crête - 10 panneaux de 300 watt = 3000W donc 3kWc = peakpower = 3
        const quantity = quotation.selectedProducts[ 0 ].quantity;
        // console.log( 'quantity', quantity );
        const power = quotation.selectedProducts[ 0 ].power ?? 0;
        // console.log( 'power', power );
        const peakPower = quantity * power / 1000;
        // console.log( 'peakPower', peakPower );

        let result: any;
        try {
            const params = {
                lat:          housing.position.y,
                lon:          housing.position.x,
                aspect:       aspect[ orientation ],
                peakpower:    peakPower,
                loss:         15,
                angle:        30,
                outputformat: 'json',
            };
            // console.log( 'params', params );
            result = await axios.get( 'https://re.jrc.ec.europa.eu/api/v5_2/PVcalc', {
                params: params,
            } );
        } catch ( e ) {
            console.log( '%c IN CATCH', 'background: #fdd835; color: #000000' );
            return -1;
        }

        // console.log( result );

        const data = result.data;

        // console.log( data.outputs.totals.fixed.E_y );
        return data.outputs.totals.fixed.E_y;
    }

    public getInstallationProductionV2( year: number ): number {
        // Si pas de données c'est que pas connecté à Internet
        if ( !this.worksheet.installationPower ) {
            // console.log( '%c IN IF', 'background: #fdd835; color: #000000' );
            // console.log( '%c IN IF', 'background: #fdd835; color: #000000' );
            // console.log( '%c IN IF', 'background: #fdd835; color: #000000' );
            return this.calcInstallationProduction( year );
        }

        const installationPower = this.worksheet.installationPower;

        let calculatedPower = installationPower;

        if ( this.quotation.selectedProducts.length > 0 ) {
            const product = this.quotation.selectedProducts[ 0 ];
            if ( year === 1 ) {
                if ( product.ext1 !== undefined ) {
                    const percentage = 1 - ( parseFloat( product.ext1 ) / 100 );
                    if ( product.power !== undefined ) {
                        calculatedPower = installationPower * percentage;
                    }
                }
            } else {
                if ( product.ext1 !== undefined && product.ext2 !== undefined ) {
                    const coefYear1     = parseFloat( product.ext1 );
                    const coefOtherYear = ( parseFloat( product.ext2 ) - coefYear1 ) / 24;
                    if ( product.power !== undefined ) {
                        calculatedPower = installationPower * ( 1 - ( coefYear1 / 100 ) );
                        calculatedPower = calculatedPower * ( 1 - ( ( year * coefOtherYear ) / 100 ) );
                    }

                }
            }
        }

        // console.log( `Power (${ year })`, calculatedPower );

        return calculatedPower;
    }


    /**
     * Calcul le total TTC avec les montants des primes déduites
     */
    public calcTotalTtcWithBonusDeducted() {
        return this.quotation.totalTtc - this.quotation.selfConsumptionBonus;
    }

    /**
     * Production de l'installation en kWh
     */
    public calcInstallationProduction( year = 1 ): number {
        if ( this.quotation.selectedProducts.length > 0 ) {
            return this.quotation.selectedProducts[ 0 ].quantity * this.productionPerPanelInKWh( year );
        }

        return 0;
    }

    /**
     * Prix de vente moyen du KWh phtovoltaîque en €
     */
    public calcPhotovoltaicAverageSellingPrice( year = 1 ): number {
        return this.calcTotalTtcWithBonusDeducted() / ( this.getInstallationProductionV2( year ) * 25 );
    }

    /**
     * Prix de revente auprès d'EDF en €
     */
    public calcResalePriceToEdf( year = 1 ): number {


        // On augmente de 1.5% les (0.1) tous les ans à partir de l'année,
        // Année 1 10 centimes * 1.5%
        // Année 2 10.15 centimes * 1.5%
        // Année 3 10.30225 centimes * 1.5%
        let price = 0.1339; // 13.39 centimes
        for ( let i = 1; i < year; i++ ) {
            price *= 1.015;
        }

        let bonus = 0;
        if ( year === 1 ) {
            bonus = this.quotation.selfConsumptionBonus;
        }
        // console.log( 'bonus', bonus );

        return this.getInstallationProductionV2( year ) * this.worksheet.ratioResaleToEDF * price + bonus;
    }

    /**
     * Economie sur la facture en €
     */
    public savingsOnBill( year = 1 ): number {
        const ratio = 1 - this.worksheet.ratioResaleToEDF;
        return this.getInstallationProductionV2( year ) * this.worksheet.averagePricePerKWhInFrance * ratio;
    }

    /**
     * Gains phtovoltaîques sur 25 ans
     */
    public benefitsOver25Years(): PhotovoltaicBenefits[] {
        const currentYear: number            = new Date().getFullYear();
        const result: PhotovoltaicBenefits[] = [];

        let index = 1;
        for ( let year = currentYear; year < currentYear + 25; year++ ) {
            if ( year === currentYear ) {
                const savingsOnInvoice = this.savingsOnBill( index ) * 1.15;
                result.push( {
                                 year,
                                 resaleToEdf:      this.calcResalePriceToEdf( index ),
                                 savingsOnInvoice: savingsOnInvoice,
                                 totalGains:       this.calcResalePriceToEdf( index ) + savingsOnInvoice,
                             } );
            } else {
                let resaleToEdf: number = this.calcResalePriceToEdf( index ) * ( 1 + ( 0.015 * index ) );


                // La revente avec EDF est sur 20 ans et non 25 ans
                if ( year > currentYear + 19 ) {
                    resaleToEdf = 0;
                }

                // const percentage: number = 1 + ( ( this.worksheet.electricityPriceEvolution / 100 ) * index );
                const percentage: number = 1 + ( ( this.worksheet.electricityPriceEvolution / 100 ) );


                // Année 1 = 15%
                // Année 2 = 15% * pourcentage_augmentation
                // Année 3 = Année * pourcentage_augmentation
                let ratioSavingOnBill = 1.15;
                for ( let i = 1; i < index; i++ ) {
                    ratioSavingOnBill *= percentage;
                }
                let savingsOnInvoice: number = this.savingsOnBill( index ) * ratioSavingOnBill;

                resaleToEdf      = Number( resaleToEdf.toFixed( 2 ) );
                savingsOnInvoice = Number( savingsOnInvoice.toFixed( 2 ) );

                result.push( {
                                 year,
                                 resaleToEdf,
                                 savingsOnInvoice,
                                 totalGains: resaleToEdf + savingsOnInvoice,
                             } );
            }

            index++;
        }

        return result;
    }

    /**
     * Evolution du prix de kWh sur 25 ans
     */
    public priceEvolutionOver25Years(): PriceEvolution[] {
        const currentYear: number      = new Date().getFullYear();
        const result: PriceEvolution[] = [];

        let index = 1;
        for ( let year = currentYear; year < currentYear + 25; year++ ) {
            if ( year === currentYear ) {
                result.push( {
                                 year,
                                 kwhEdf:          this.worksheet.averagePricePerKWhInFrance,
                                 kwhPhotovoltaic: this.calcPhotovoltaicAverageSellingPrice( index ),
                             } );
            } else {
                const percentage = 1 + ( this.worksheet.electricityPriceEvolution / 100 );
                const kwhEdf     = result[ result.length - 1 ].kwhEdf * percentage;
                result.push( {
                                 year,
                                 kwhEdf,
                                 kwhPhotovoltaic: this.calcPhotovoltaicAverageSellingPrice( index ),
                             } );
            }
            index++;
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
