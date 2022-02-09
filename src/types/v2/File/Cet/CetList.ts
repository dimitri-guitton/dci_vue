import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

export interface CetList extends BaseList {
    qualiteIsolationList: ItemList[];
    statutMenageTypeList: ItemList[];
    naturePlafondList: ItemList[];
    typeChantierList: ItemList[];
    accesCombleList: ItemList[];
    typeCouvertureList: ItemList[];
    typeCharpenteList: ItemList[];
    etatToitureList: ItemList[];
    puissanceCompteurList: ItemList[];
    natureMurExtList: ItemList[];
    chauffageTypeList: ItemList[];
    tensionDisponibleList: ItemList[];
    aspirationTypeList: ItemList[];
}
