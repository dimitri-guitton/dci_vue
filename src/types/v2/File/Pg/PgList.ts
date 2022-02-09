import ItemList from '@/types/File/ItemList';
import { BaseList } from '@/types/v2/File/Common/BaseList';

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
    couleurFacadeList: ItemList[];
    puissancePoeleList: ItemList[];
    zoneInstallationList: ItemList[];
}

export default PgList;
