import { DataGouv } from '@/types/File/DataGouv';

interface Assent {
    // uid: string;
    refAvis: string;
    numFiscal: string;
    isbeneficiaire: boolean;
    datagouv: DataGouv;
    nom: string;
    prenom: string;
    adresse: string;
    codepostal: string;
    ville: string;
    revenu: number;
}

export default Assent;
