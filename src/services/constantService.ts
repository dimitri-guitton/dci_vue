import FolderItemType from '@/types/FolderItemType';
import FolderItemStatus from '@/types/FolderItemStatus';

export const FOLDER_COMBLE_TYPE: FolderItemType = {
    slug: 'co',
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

export const FOLDER_CE_TYPE: FolderItemType = {
    slug: 'ce',
    name: 'Chauffe eau',
};

export const FOLDER_PO_G_TYPE: FolderItemType = {
    slug: 'po_g',
    name: 'Poele à granulés',
};

export const LIST_FOLDER_TYPE: FolderItemType[] = [
    FOLDER_COMBLE_TYPE,
    FOLDER_SOL_TYPE,
    FOLDER_PAC_RR_TYPE,
    FOLDER_PAC_RO_TYPE,
    FOLDER_CE_TYPE,
    FOLDER_PO_G_TYPE,
];

export const FOLDER_COMPLETE_STATUS: FolderItemStatus = {
    state: 'complete',
    name:  'Complet',
    class: 'success',
};

export const FOLDER_INCOMPLETE_STATUS: FolderItemStatus = {
    state: 'incomplete',
    name:  'Incomplet',
    class: 'warning',
};

export const FOLDER_TO_CORRECT_STATUS: FolderItemStatus = {
    state: 'to_correct',
    name:  'À corriger',
    class: 'danger',
};

export const FOLDER_CLOSE_STATUS: FolderItemStatus = {
    state: 'close',
    name:  'Clos',
    class: 'dark',
};
