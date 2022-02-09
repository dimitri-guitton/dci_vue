import ItemList from '@/types/File/ItemList';
import { BaseList } from '@/types/v2/File/Common/BaseList';

interface SolList extends BaseList {
    chauffageTypeList: ItemList[];
    porteGarageList: ItemList[];
    accesCamionList: ItemList[];
    supportList: ItemList[];
}

export default SolList;
