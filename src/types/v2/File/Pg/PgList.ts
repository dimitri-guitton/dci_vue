import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

interface PgList extends BaseList {
    qualiteIsolationList: ItemList[];
    statutMenageTypeList: ItemList[];
    typeChantierList: ItemList[];
    puissanceCompteurList: ItemList[];
    generateurList: ItemList[];
    conduitList: ItemList[];
    resistanceList: ItemList[];
    toitureList: ItemList[];
    couleurProfileList: ItemList[];
    puissancePoeleList: ItemList[];
    zoneInstallationList: ItemList[];
}

export default PgList;
