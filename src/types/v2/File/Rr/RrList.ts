import { BaseList } from '@/types/v2/File/Common/BaseList';
import { ItemList } from '@/types/v2/File/Common/ItemList';

interface RrList extends BaseList {
    rrTypeList: ItemList[];
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
    buildingCoefficientList: ItemList[];
    climaticZoneList: ItemList[];
    altitudeList: ItemList[];
    heatersList: ItemList[];
    setPointTemperatureList: ItemList[];
}

export default RrList;
