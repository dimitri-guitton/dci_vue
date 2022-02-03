import BlankOption from '@/types/File/BlankOption';
import Text from '@/types/File/Text';
import RrMulti from '@/types/File/Rr/RrMulti';
import Product from '@/types/File/Product';
import Option from '@/types/File/Option';

interface RrQuotation {
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
    rrType: string;
    rrMulti: RrMulti;
    assortment: string; // Anciennement gamme
    products: Product[];
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default RrQuotation;
