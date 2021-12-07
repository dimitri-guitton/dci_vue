import BlankOption from '@/types/File/BlankOption';
import RoOption from '@/types/File/Ro/RoOption';
import RoProduct from '@/types/File/Ro/RoProduct';
import RoEcsDeporte from '@/types/File/Ro/RoEcsDeporte';
import RoKitBiZone from '@/types/File/Ro/RoKitBiZone';
import Text from '@/types/File/Text';

interface RoQuotation {
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
    selectedEcsDeporte?: RoEcsDeporte;
    isKitBiZone: boolean;
    selectedKitBiZone?: RoKitBiZone;
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

export default RoQuotation;
