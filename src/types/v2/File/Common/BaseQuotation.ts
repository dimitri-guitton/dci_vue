import { Option } from '@/types/v2/File/Common/Option';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { Product } from '@/types/v2/File/Common/Product';

export interface BaseQuotation {
    origin: string;
    dateTechnicalVisit: string;
    executionDelay: string;
    options: Option[];
    blankOptions: BlankOption[];
    commentary: string;
    partner: string;
    texts: Text[];
    selectedProducts: Product[];
    products: Product[];
    discount: number;
    totalHt: number;
    totalTva: number;
}
