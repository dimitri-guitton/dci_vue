import FileItemType from '@/types/FileItem/FileItemType';
import FileItemStatus from '@/types/FileItem/FileItemStatus';

export const FILE_COMBLE_TYPE: FileItemType = {
    slug: 'comble',
    name: 'Comble',
};

export const FILE_SOL_TYPE: FileItemType = {
    slug: 'sol',
    name: 'Sol',
};

export const FILE_PAC_RR_TYPE: FileItemType = {
    slug: 'pac_rr',
    name: 'Chauffage RR',
};

export const FILE_PAC_RO_TYPE: FileItemType = {
    slug: 'pac_ro',
    name: 'Chauffage RO',
};

export const FILE_CET_TYPE: FileItemType = {
    slug: 'cet',
    name: 'Chauffe eau',
};

export const FILE_PG_TYPE: FileItemType = {
    slug: 'pg',
    name: 'Poele à granulés',
};

export const LIST_FILE_TYPE: FileItemType[] = [
    FILE_COMBLE_TYPE,
    FILE_SOL_TYPE,
    FILE_PAC_RR_TYPE,
    FILE_PAC_RO_TYPE,
    FILE_CET_TYPE,
    FILE_PG_TYPE,
];

export const FILE_COMPLETE_STATUS: FileItemStatus = {
    code:  1,
    state: 'complete',
    name:  'Complet',
    class: 'success',
};

export const FILE_INCOMPLETE_STATUS: FileItemStatus = {
    code:  2,
    state: 'incomplete',
    name:  'Incomplet',
    class: 'warning',
};

export const FILE_TO_CORRECT_STATUS: FileItemStatus = {
    code:  3,
    state: 'to_correct',
    name:  'À corriger',
    class: 'danger',
};

export const FILE_CLOSE_STATUS: FileItemStatus = {
    code:  4,
    state: 'close',
    name:  'Clos',
    class: 'dark',
};
