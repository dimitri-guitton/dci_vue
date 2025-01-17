import { DatatableFileType } from '@/types/v2/DatatableFile/DatatableFileType';
import { DatatableFileStatus } from '@/types/v2/DatatableFile/DatatableFileStatus';

export const FILE_CET    = 'cet';
export const FILE_SOL    = 'sol';
export const FILE_COMBLE = 'comble';
export const FILE_PAC_RR = 'pac_rr';
export const FILE_PAC_RO = 'pac_ro';
export const FILE_PG     = 'pg';
export const FILE_PB     = 'pb';
export const FILE_PV     = 'pv';
export const FILE_CPV  = 'cpv';
export const FILE_BRVE = 'brve';
export const FILE_VE   = 've';

export const FILE_COMBLE_TYPE: DatatableFileType = {
    slug: FILE_COMBLE,
    name: 'Comble',
};

export const FILE_SOL_TYPE: DatatableFileType = {
    slug: FILE_SOL,
    name: 'Sol',
};

export const FILE_PAC_RR_TYPE: DatatableFileType = {
    slug: FILE_PAC_RR,
    name: 'Chauffage RR',
};

export const FILE_PAC_RO_TYPE: DatatableFileType = {
    slug: FILE_PAC_RO,
    name: 'Chauffage RO',
};

export const FILE_CET_TYPE: DatatableFileType = {
    slug: FILE_CET,
    name: 'Chauffe eau',
};

export const FILE_PG_TYPE: DatatableFileType = {
    slug: FILE_PG,
    name: 'Poele à granulés',
};

export const FILE_PB_TYPE: DatatableFileType = {
    slug: FILE_PB,
    name: 'Poele à bois',
};

export const FILE_PV_TYPE: DatatableFileType = {
    slug: FILE_PV,
    name: 'Panneaux photovoltaïques',
};

export const FILE_CPV_TYPE: DatatableFileType = {
    slug: FILE_CPV,
    name: 'Carport photovoltaïques',
};

export const FILE_BRVE_TYPE: DatatableFileType = {
    slug: FILE_BRVE,
    name: 'Borne de recharge VE',
};

export const FILE_VE_TYPE: DatatableFileType = {
    slug: FILE_VE,
    name: 'Ventilation',
};

export const LIST_FILE_TYPE: DatatableFileType[] = [
    FILE_COMBLE_TYPE,
    FILE_SOL_TYPE,
    FILE_PAC_RR_TYPE,
    FILE_PAC_RO_TYPE,
    FILE_CET_TYPE,
    FILE_PG_TYPE,
    FILE_PB_TYPE,
    FILE_PV_TYPE,
    FILE_CPV_TYPE,
    FILE_BRVE_TYPE,
    FILE_VE_TYPE,
];

export const FILE_COMPLETE_STATUS: DatatableFileStatus = {
    code:  1,
    state: 'complete',
    name:  'Complet',
    class: 'success',
};

export const FILE_INCOMPLETE_STATUS: DatatableFileStatus = {
    code:  2,
    state: 'incomplete',
    name:  'Incomplet',
    class: 'warning',
};

export const FILE_TO_CORRECT_STATUS: DatatableFileStatus = {
    code:  3,
    state: 'to_correct',
    name:  'À corriger',
    class: 'danger',
};

export const FILE_CLOSE_STATUS: DatatableFileStatus = {
    code:  4,
    state: 'close',
    name:  'Clos',
    class: 'dark',
};
