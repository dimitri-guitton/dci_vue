import BlankOption from '@/types/File/BlankOption';
import Text from '@/types/File/Text';
import PgOption from '@/types/File/Pg/PgOption';
import PgProduct from '@/types/File/Pg/PgProduct';

interface PgQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: PgOption[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva: number;
    ceeBonus: number;
    selectedProducts: PgProduct[];
    products: PgProduct[];
    maPrimeRenovBonus: number;
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default PgQuotation;
