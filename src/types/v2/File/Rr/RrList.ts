import ItemList from '@/types/File/ItemList';
import { BaseList } from '@/types/v2/File/Common/BaseList';

interface RrList extends BaseList {
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
    gammeTypeList: ItemList[];
    qualiteIsolationList: ItemList[];
    naturePlafondList: ItemList[];
    EcsDeporteList: ItemList[];
    typeChantierList: ItemList[];
}

export default RrList;
