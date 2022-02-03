import BlankOption from '@/types/File/BlankOption';
import RoEcsDeporte from '@/types/File/Ro/RoEcsDeporte';
import RoKitBiZone from '@/types/File/Ro/RoKitBiZone';
import Text from '@/types/File/Text';
import Product from '@/types/File/Product';
import Option from '@/types/File/Option';

interface RoQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: Option[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva10: number;
    tva20: number;
    ceeBonus: number;
    maPrimeRenovBonus: number;
    selectedProducts: Product[];
    assortment: string; // Anciennement gamme
    volumeECS: number;
    volumeECSDeporte: number;
    isEcsDeporte: boolean;
    selectedEcsDeporte?: RoEcsDeporte;
    isKitBiZone: boolean;
    selectedKitBiZone?: RoKitBiZone;
    ceilingHeight: number;  // Hauteur sous plafond
    deviceToReplace: {
        type?: string;
        brand?: string;
        model?: string;
    };
    products: Product[];
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default RoQuotation;
