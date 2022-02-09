import ItemList from '@/types/File/ItemList';
import { BaseList } from '@/types/v2/File/Common/BaseList';

interface RoList extends BaseList {
    rrTypeList: ItemList[];
    assortmentList: ItemList[];
    ecsDeporteList: ItemList[];
    accesCombleList: ItemList[];
    typeCouvertureList: ItemList[];
    typeCharpenteList: ItemList[];
    etatToitureList: ItemList[];
    puissanceCompteurList: ItemList[];
    natureMurExtList: ItemList[];
    typeRadiateurList: ItemList[];
    tensionDisponibleList: ItemList[];
    positionEauChaudeList: ItemList[];
    typeChaudiereList: ItemList[];
}

export default RoList;
