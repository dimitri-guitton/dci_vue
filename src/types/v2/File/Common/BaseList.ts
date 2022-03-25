import { ItemList } from '@/types/v2/File/Common/ItemList';

export interface BaseList {
    localTypeList: ItemList[];
    batimentNatureList: ItemList[];
    niveauHabitationList: ItemList[];
    typeOrigineList: ItemList[];
    deadlineReportList: ItemList[];
}
