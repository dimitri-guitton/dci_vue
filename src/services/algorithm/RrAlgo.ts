import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';
import RrMulti from '@/types/v2/File/Rr/RrMulti';
import { calcRequiredPower } from '@/services/file/RrAlgo';


export class RrAlgo extends PacAlgo {
    constructor( housing: PacHousing ) {
        super( housing );
    }

    /**
     * Retourne le model mono selon la puissance requise
     * @param power
     */
    private calcMonoModel = ( power: number ): number => {
        if ( power > 0 && power < 2 ) {
            return 20;
        }
        if ( power >= 2 && power < 2.8 ) {
            return 25;
        }
        if ( power >= 2.8 && power < 3.8 ) {
            return 35;
        }
        if ( power >= 3.8 && power < 5.4 ) {
            return 42;
        }
        if ( power >= 5.4 && power < 5.8 ) {
            return 50;
        }
        if ( power >= 5.8 && power < 7 ) {
            return 60;
        }
        if ( power >= 7 && power < 8.2 ) {
            return 70;
        }
        return -1;
    };

    /**
     * Retourne le model multi selon la puissance requise
     * @param power
     */
    private calcMultiModel = ( power: number ): number => {
        if ( power > 0 && power < 1.5 ) {
            return 15;
        }
        if ( power >= 1.5 && power < 2 ) {
            return 20;
        }
        if ( power >= 2 && power < 2.8 ) {
            return 25;
        }
        if ( power >= 2.8 && power < 3.8 ) {
            return 35;
        }
        if ( power >= 3.8 && power < 5.4 ) {
            return 42;
        }
        if ( power >= 5.4 && power < 5.8 ) {
            return 50;
        }
        if ( power >= 5.8 && power < 7 ) {
            return 60;
        }
        if ( power >= 7 && power < 8.2 ) {
            return 70;
        }
        return -1;
    };

    /**
     *  Retourne le code produit intérieur selon le model et la gamme sélectionnée
     * @param model
     * @param assortment
     */
    private getMonoCodeInt = ( model: number, assortment: string ): string => {
        assortment = assortment.toUpperCase();

        if ( model === 20 && assortment === 'PERFERA' ) {
            return 'DAIFTXM20R';
        }
        if ( model === 25 && assortment === 'PERFERA' ) {
            return 'DAIFTXM25R';
        }
        if ( model === 35 && assortment === 'PERFERA' ) {
            return 'DAIFTXM35R';
        }
        if ( model === 42 && assortment === 'PERFERA' ) {
            return 'DAIFTXM42R';
        }
        if ( model === 50 && assortment === 'PERFERA' ) {
            return 'DAIFTXM50R';
        }
        if ( model === 60 && assortment === 'PERFERA' ) {
            return 'DAIFTXM60R';
        }
        if ( model === 70 && assortment === 'PERFERA' ) {
            return 'DAIFTXM71R';
        }
        if ( model === 20 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF20C';
        }
        if ( model === 25 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF25C';
        }
        if ( model === 35 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF35C';
        }
        if ( model === 42 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF50A';
        }
        if ( model === 50 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF50A';
        }
        if ( model === 60 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF60A';
        }
        if ( model === 70 && assortment === 'SENSIRA' ) {
            return 'DAIFTXF71A';
        }
        if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA20BB';
        }
        if ( model === 25 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA25BB';
        }
        if ( model === 35 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA35BB';
        }
        if ( model === 42 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA42BB';
        }
        if ( model === 50 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA50BB';
        }
        if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA20AW';
        }
        if ( model === 25 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA25AW';
        }
        if ( model === 35 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA35AW';
        }
        if ( model === 42 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA42AW';
        }
        if ( model === 50 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA50AW';
        }
        if ( model === 20 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA20BS';
        }
        if ( model === 25 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA25BS';
        }
        if ( model === 35 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA35BS';
        }
        if ( model === 42 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA42BS';
        }
        if ( model === 50 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA50BS';
        }
        if ( model === 20 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA20BT';
        }
        if ( model === 25 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA25BT';
        }
        if ( model === 35 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA35BT';
        }
        if ( model === 42 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA42BT';
        }
        if ( model === 50 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA50BT';
        }
        if ( model === 20 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ20MW';
        }
        if ( model === 25 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ25MW';
        }
        if ( model === 35 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ35MW';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
            return 'FTXJ50MW';
        }
        if ( model === 20 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ20MS';
        }
        if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ25MS';
        }
        if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ35MS';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ50MS';
        }
        return 'empty';
    };

    /**
     * Retourne le code produit extérieur selon le model et la gamme sélectionnée
     * @param model
     * @param assortment
     */
    private getMonoCodeExt = ( model: number, assortment: string ): string => {
        assortment = assortment.toUpperCase();

        if ( model === 20 && assortment === 'PERFERA' ) {
            return 'DAIRXM20R';
        }
        if ( model === 25 && assortment === 'PERFERA' ) {
            return 'DAIRXM25R';
        }
        if ( model === 35 && assortment === 'PERFERA' ) {
            return 'DAIRXM35R';
        }
        if ( model === 42 && assortment === 'PERFERA' ) {
            return 'DAIRXM42R';
        }
        if ( model === 50 && assortment === 'PERFERA' ) {
            return 'DAIRXM50R';
        }
        if ( model === 60 && assortment === 'PERFERA' ) {
            return 'DAIRXM60R';
        }
        if ( model === 70 && assortment === 'PERFERA' ) {
            return 'DAIRXM71R';
        }
        if ( model === 20 && assortment === 'SENSIRA' ) {
            return 'DAIRXF20A';
        }
        if ( model === 25 && assortment === 'SENSIRA' ) {
            return 'DAIRXF25A';
        }
        if ( model === 35 && assortment === 'SENSIRA' ) {
            return 'DAIRXF35A';
        }
        if ( model === 42 && assortment === 'SENSIRA' ) {
            return 'DAIRXF50A';
        }
        if ( model === 50 && assortment === 'SENSIRA' ) {
            return 'DAIRXF50A';
        }
        if ( model === 60 && assortment === 'SENSIRA' ) {
            return 'DAIRXF60A';
        }
        if ( model === 70 && assortment === 'SENSIRA' ) {
            return 'DAIRXF71A';
        }
        if ( model === 20 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
            return 'DAIRXA20A';
        }
        if ( model === 25 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
            return 'DAIRXA25A';
        }
        if ( model === 35 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
            return 'DAIRXA35A';
        }
        if ( model === 42 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
            return 'DAIRXA42B';
        }
        if ( model === 50 && ( assortment === 'STYLISH_BLANC' || assortment === 'STYLISH_NOIR' || assortment === 'STYLISH_ARGENT' || assortment === 'STYLISH_BOIS' ) ) {
            return 'DAIRXA50B';
        }
        if ( model === 20 && assortment === 'EMURA_BLANC' ) {
            return 'DAIRXJ20M';
        }
        if ( model === 25 && assortment === 'EMURA_BLANC' ) {
            return 'DAIRXJ25M';
        }
        if ( model === 35 && assortment === 'EMURA_BLANC' ) {
            return 'DAIRXJ35M';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
            return 'DAIRXJ50M';
        }
        if ( model === 20 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIRXJ20M';
        }
        if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIRXJ25M';
        }
        if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIRXJ35M';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIRXJ50M';
        }

        return 'empty';
    };

    /**
     * Retourne le code produit intérieur par pièce
     * @param model
     * @param assortment
     */
    private getMultiCodeInt = ( model: number, assortment: string ): string => {
        assortment = assortment.toUpperCase();

        if ( model === 15 && assortment === 'PERFERA' ) {
            return 'DAICTXM15R';
        }
        if ( model === 20 && assortment === 'PERFERA' ) {
            return 'DAIFTXM20R';
        }
        if ( model === 25 && assortment === 'PERFERA' ) {
            return 'DAIFTXM25R';
        }
        if ( model === 35 && assortment === 'PERFERA' ) {
            return 'DAIFTXM35R';
        }
        if ( model === 42 && assortment === 'PERFERA' ) {
            return 'DAIFTXM42R';
        }
        if ( model === 50 && assortment === 'PERFERA' ) {
            return 'DAIFTXM50R';
        }
        if ( model === 60 && assortment === 'PERFERA' ) {
            return 'DAIFTXM60R';
        }
        if ( model === 70 && assortment === 'PERFERA' ) {
            return 'DAIFTXM71R';
        }
        if ( model === 15 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA15BB';
        }
        if ( model === 20 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA20BB';
        }
        if ( model === 25 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA25BB';
        }
        if ( model === 35 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA35BB';
        }
        if ( model === 42 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA42BB';
        }
        if ( model === 50 && assortment === 'STYLISH_NOIR' ) {
            return 'DAIFTXA50BB';
        }
        if ( model === 15 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA15AW';
        }
        if ( model === 20 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA20AW';
        }
        if ( model === 25 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA25AW';
        }
        if ( model === 35 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA35AW';
        }
        if ( model === 42 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA42AW';
        }
        if ( model === 50 && assortment === 'STYLISH_BLANC' ) {
            return 'DAIFTXA50AW';
        }
        if ( model === 15 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA15BS';
        }
        if ( model === 20 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA20BS';
        }
        if ( model === 25 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA25BS';
        }
        if ( model === 35 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA35BS';
        }
        if ( model === 42 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA42BS';
        }
        if ( model === 50 && assortment === 'STYLISH_ARGENT' ) {
            return 'DAIFTXA50BS';
        }
        if ( model === 15 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA15BT';
        }
        if ( model === 20 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA20BT';
        }
        if ( model === 25 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA25BT';
        }
        if ( model === 35 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA35BT';
        }
        if ( model === 42 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA42BT';
        }
        if ( model === 50 && assortment === 'STYLISH_BOIS' ) {
            return 'DAIFTXA50BT';
        }
        if ( model > 0 && model <= 20 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ20MW';
        }
        if ( model === 25 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ25MW';
        }
        if ( model === 35 && assortment === 'EMURA_BLANC' ) {
            return 'DAIFTXJ35MW';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_BLANC' ) {
            return 'FTXJ50MW';
        }
        if ( model > 0 && model <= 20 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ20MS';
        }
        if ( model === 25 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ25MS';
        }
        if ( model === 35 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ35MS';
        }
        if ( model >= 41 && model <= 50 && assortment === 'EMURA_ARGENT' ) {
            return 'DAIFTXJ50MS';
        }
        return 'empty';
    };

    /**
     *  Retourne le code produit du groupes
     * @param groupPower
     * @param nbRoom
     */
    private getMultiCodeGroup = ( groupPower, nbRoom ): string => {
        if ( nbRoom <= 2 && groupPower <= 4.2 ) {
            return 'DAI2MXM40N';
        }
        if ( nbRoom <= 2 && groupPower > 4.2 && groupPower <= 5.7 ) {
            return 'DAI2MXM50N';
        }
        if ( nbRoom <= 3 && groupPower <= 4.6 ) {
            return 'DAI3MXM40N8';
        }
        if ( nbRoom <= 3 && groupPower > 4.6 && groupPower <= 6.8 ) {
            return 'DAI3MXM52N8';
        }
        if ( nbRoom <= 3 && groupPower > 6.8 && groupPower <= 7.9 ) {
            return 'DAI3MXM68N';
        }
        if ( nbRoom <= 4 && groupPower <= 8.6 ) {
            return 'DAI4MXM68N9';
        }
        if ( nbRoom <= 4 && groupPower > 8.6 && groupPower <= 9.65 ) {
            return 'DAI4MXM80N9';
        }
        if ( nbRoom <= 5 && groupPower <= 10.5 ) {
            return 'DAI5MXM90N9';
        }

        return 'empty';
    };

    public getUnitsMono = ( assortment: string ): { unitExt: string; unitInt: string } | null => {
        console.log( '%c GET UNITS RR MONO', 'background: #FF54AB; color: #000000' );
        const requiredPower: number = this.calcRequiredPower( this.housing );
        const model                 = this.calcMonoModel( requiredPower );

        const selectedUnitExt = this.getMonoCodeExt( model, assortment ).toUpperCase();
        const selectedUnitInt = this.getMonoCodeInt( model, assortment ).toUpperCase();

        console.log( {
                         'required_power': requiredPower,
                         'model':          model,
                         'unit_int':       selectedUnitInt,
                         'unit_ext':       selectedUnitExt,
                     } );

        if ( selectedUnitExt === 'EMPTY' || selectedUnitInt === 'EMPTY' ) {
            return null;
        }

        return {
            unitExt: selectedUnitExt,
            unitInt: selectedUnitInt,
        };
    };

    public getPacRrMulti = ( rrMulti: RrMulti, assortment: string ): { unitExt: string; unitsInt: string[] } | null => {
        console.log( '%c GET UNITS RR MULTI', 'background: #D45480; color: #000000' );
        let totalRequiredPower          = 0;
        const productsPerRoom: string[] = [];
        let anItemWasNotFound           = false;

        // Calcul l'unité intérieur par pièces
        for ( let i = 1; i <= rrMulti.roomNumber; i++ ) {
            let power = 0;
            switch ( i ) {
                case 1:
                    power = calcRequiredPower( rrMulti.areaP1, this.housing.buildingCoefficient );
                    break;
                case 2:
                    power = calcRequiredPower( rrMulti.areaP2, this.housing.buildingCoefficient );
                    break;
                case 3:
                    power = calcRequiredPower( rrMulti.areaP3, this.housing.buildingCoefficient );
                    break;
                case 4:
                    power = calcRequiredPower( rrMulti.areaP4, this.housing.buildingCoefficient );
                    break;
                case 5:
                    power = calcRequiredPower( rrMulti.areaP5, this.housing.buildingCoefficient );
                    break;
                default:
                    break;
            }

            const model = this.calcMultiModel( power );
            const code  = this.getMultiCodeInt( model, assortment );

            if ( code === 'EMPTY' ) {
                anItemWasNotFound = true;
            }
            productsPerRoom.push( code );

            totalRequiredPower += power;
        }

        const productGroup = this.getMultiCodeGroup( totalRequiredPower, rrMulti.roomNumber );

        if ( productGroup === 'EMPTY' || anItemWasNotFound ) {
            return null;
        }
        return {
            unitExt:  productGroup,
            unitsInt: productsPerRoom,
        };
    };
}
