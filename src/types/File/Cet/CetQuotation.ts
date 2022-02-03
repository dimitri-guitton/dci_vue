import BlankOption from '@/types/File/BlankOption';
import Text from '@/types/File/Text';
import CetProduct from '@/types/File/Cet/CetProduct';
import CetOption from '@/types/File/Cet/CetOption';

interface CetQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: CetOption[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    tva: number;
    ceeBonus: number;
    selectedProducts: CetProduct[];
    products: CetProduct[];
    maPrimeRenovBonus: number;
    discount: number;
    totalHt: number;
    totalTva: number;
}

export default CetQuotation;
