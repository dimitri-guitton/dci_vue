import BlankOption from '@/types/File/BlankOption';
import Text from '@/types/File/Text';
import CeOption from '@/types/File/Ce/CeOption';
import CeProduct from '@/types/File/Ce/CeProduct';

interface CeQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: CeOption[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva: number;
    ceeBonus: number;
    selectedProducts: CeProduct[];
    products: CeProduct[];
    maPrimeRenovBonus: number;
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default CeQuotation;
