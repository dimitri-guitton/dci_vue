import ItemList from '@/types/File/ItemList';
import { BaseList } from '@/types/v2/File/Common/BaseList';

interface CombleList extends BaseList {
    chauffageTypeList: ItemList[];
    chantierTypeList: ItemList[];
    partieAIsolerList: ItemList[];
    puissanceCompteurList: ItemList[];
    accesCombleList: ItemList[];
    couvertureTypeList: ItemList[];
    charpenteTypeList: ItemList[];
    etatToitureList: ItemList[];
    isolationExistanteTypeList: ItemList[];
    rehausseTrappeTypeList: ItemList[];
    nbrAccesCombleList: ItemList[];
    nbrCompartimentsList: ItemList[];
}

export default CombleList;
