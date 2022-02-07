import { DataGouv } from '@/types/File/DataGouv';

interface Assent {
    refAvis: string;
    numFiscal: string;
    isBeneficiary: boolean;
    datagouv: DataGouv;
    civility: string;
    nom: string;
    prenom: string;
    adresse: string;
    codepostal: string;
    ville: string;
    revenu: number;
}

export default Assent;
