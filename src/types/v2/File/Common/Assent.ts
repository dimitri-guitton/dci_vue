import { DataGouv } from '@/types/File/DataGouv';

/**
 * Interface pour les avis d'imposition
 */
export interface Assent {
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
