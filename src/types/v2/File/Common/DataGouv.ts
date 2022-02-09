/**
 * Interface pour les données récupérées depuis le service du Gouvernement pour les avis d'impots
 */
export interface DataGouv {
    refAvis: string;
    numFiscal: string;
    loaded: boolean;
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    revenu: number;
    error: boolean;
}
