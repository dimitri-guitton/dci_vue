import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

interface SolList extends BaseList {
    chauffageTypeList: ItemList[];
    porteGarageList: ItemList[];
    accesCamionList: ItemList[];
    supportList: ItemList[];
}

export default SolList;
