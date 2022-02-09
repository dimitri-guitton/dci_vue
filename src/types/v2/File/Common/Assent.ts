/**
 * Interface pour les avis d'imposition
 */
import { DataGouv } from '@/types/v2/File/Common/DataGouv';

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
