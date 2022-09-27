import { PacAlgo } from '@/services/algorithm/PacAlgo';
import { PacHousing } from '@/types/v2/File/Pac/PacHousing';


export class RrAlgo extends PacAlgo {
    /**
     * Calcul la puissance (KW) minimal requise de la PAC pour le dimensionnement froid
     * @param housing
     * @param overrideArea
     */
    public calcRequiredPowerCold = ( housing: PacHousing, overrideArea?: number ): number => {

        // Volume à refroidir
        let volume: number = housing.area * housing.ceilingHeight;
        if ( overrideArea !== undefined ) {
            volume = overrideArea * housing.ceilingHeight;
        }


        let coef = 25;

        switch ( housing.buildingCoefficient ) {
            case 0.6:
                coef = 25;
                break;
            case 0.75:
                coef = 30;
                break;
            case 0.8:
                coef = 35;
                break;
            case 0.95:
                coef = 40;
                break;
            case 1.15:
                coef = 45;
                break;
            case 1.4:
                coef = 50;
                break;
            case 1.7:
                coef = 50;
                break;
        }

        // Puissance en W
        const power: number = +( volume * coef ).toFixed( 4 );

        // Retourne la puissance en KW
        return power / 1000;
    };

}
