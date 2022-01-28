import FolderItemType from '@/types/Folder/FolderItemType';
import FolderItemStatus from '@/types/Folder/FolderItemStatus';

export const FOLDER_COMBLE_TYPE: FolderItemType = {
    slug: 'comble',
    name: 'Comble',
};

export const FOLDER_SOL_TYPE: FolderItemType = {
    slug: 'sol',
    name: 'Sol',
};

export const FOLDER_PAC_RR_TYPE: FolderItemType = {
    slug: 'pac_rr',
    name: 'Chauffage RR',
};

export const FOLDER_PAC_RO_TYPE: FolderItemType = {
    slug: 'pac_ro',
    name: 'Chauffage RO',
};

export const FOLDER_CET_TYPE: FolderItemType = {
    slug: 'cet',
    name: 'Chauffe eau',
};

export const FOLDER_PG_TYPE: FolderItemType = {
    slug: 'pg',
    name: 'Poele à granulés',
};

export const LIST_FOLDER_TYPE: FolderItemType[] = [
    FOLDER_COMBLE_TYPE,
    FOLDER_SOL_TYPE,
    FOLDER_PAC_RR_TYPE,
    FOLDER_PAC_RO_TYPE,
    FOLDER_CET_TYPE,
    FOLDER_PG_TYPE,
];

export const FOLDER_COMPLETE_STATUS: FolderItemStatus = {
    code:  1,
    state: 'complete',
    name:  'Complet',
    class: 'success',
};

export const FOLDER_INCOMPLETE_STATUS: FolderItemStatus = {
    code:  2,
    state: 'incomplete',
    name:  'Incomplet',
    class: 'warning',
};

export const FOLDER_TO_CORRECT_STATUS: FolderItemStatus = {
    code:  3,
    state: 'to_correct',
    name:  'À corriger',
    class: 'danger',
};

export const FOLDER_CLOSE_STATUS: FolderItemStatus = {
    code:  4,
    state: 'close',
    name:  'Clos',
    class: 'dark',
};
