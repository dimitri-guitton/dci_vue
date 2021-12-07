import BlankOption from '@/types/File/BlankOption';
import RoOption from '@/types/File/Ro/RoOption';
import Text from '@/types/File/Text';
import RrProduct from '@/types/File/Rr/RrProduct';
import RrMulti from '@/types/File/Rr/RrMulti';

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
