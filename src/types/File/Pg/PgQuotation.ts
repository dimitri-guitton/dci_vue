import BlankOption from '@/types/File/BlankOption';
import Text from '@/types/File/Text';
import Product from '@/types/File/Product';
import Option from '@/types/File/Option';

interface PgQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: Option[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva: number;
    ceeBonus: number;
    selectedProducts: Product[];
    products: Product[];
    maPrimeRenovBonus: number;
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default PgQuotation;
