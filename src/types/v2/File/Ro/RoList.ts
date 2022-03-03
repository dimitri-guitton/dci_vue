import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

interface RoList extends BaseList {
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
    qualiteIsolationList: ItemList[];
    buildingCoefficientList: ItemList[];
    climaticZoneList: ItemList[];
    altitudeList: ItemList[];
    heatersList: ItemList[];
    setPointTemperatureList: ItemList[];
}

export default RoList;
