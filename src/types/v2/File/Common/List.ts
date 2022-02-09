/**
 * Interface des listes pour les options des formualires
 */
import { ItemList } from '@/types/v2/File/Common/ItemList';

export interface List {
    slug: string;
    items: ItemList[];
}
