import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

interface PvList extends BaseList {
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
    orientationList: ItemList[];
    electricityPriceEvolutionList: ItemList[];
    ratioResaleToEDFList: ItemList[];
    averagePricePerKWhInFranceList: ItemList[];
}

export default PvList;
