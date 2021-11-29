import BlankOption from '@/types/BlankOption';
import RoOption from '@/types/Ro/RoOption';
import Text from '@/types/Text';
import RrProduct from '@/types/Rr/RrProduct';
import RrMulti from '@/types/Rr/RrMulti';

interface RrQuotation {
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
    selectedProducts: RrProduct[];
    rrType: string;
    rrMulti: RrMulti;
    assortment: string; // Anciennement gamme
    products: RrProduct[];
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default RrQuotation;
