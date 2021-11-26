import BlankOption from '@/types/BlankOption';
import RoOption from '@/types/Ro/RoOption';
import RoProduct from '@/types/Ro/RoProduct';
import EcsDeporte from '@/types/Ro/EcsDeporte';
import KitBiZone from '@/types/Ro/KitBiZone';
import Text from '@/types/Text';

interface Quotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: RoOption[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva10: number;
    tva20: number;
    ceeBonus: number;
    maPrimeRenovBonus: number;
    selectedProducts: RoProduct[];
    assortment: string; // Anciennement gamme
    volumeECS: number;
    volumeECSDeporte: number;
    isEcsDeporte: boolean;
    selectedEcsDeporte?: EcsDeporte;
    isKitBiZone: boolean;
    selectedKitBiZone?: KitBiZone;
    ceilingHeight: number;  // Hauteur sous plafond
    quantity: number;
    deviceToReplace: {
        type?: string;
        brand?: string;
        model?: string;
    };
    products: RoProduct[];
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default Quotation;
