import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface SolWorkSheet extends BaseWorksheet {
    epaisseurProduit: string;
    accesCamion: string;
    distCamion: number;
    hautPlafond: number;
    support: string;
    distPointEau: number;
    resistTherm: string;
    dimensionsPieces: number[];
    isolationExistante: boolean;
    niveauHabitation: string;
    habitationSurLocalFroid: boolean;
    videSanitaire: boolean;
    terrePlein: boolean;
    reseauPlafond: boolean;
    luminairesPlafond: boolean;
    distancePortesPalfond: number[];
    porteGarage: string;
    nbrPorteGarage: number;
}
