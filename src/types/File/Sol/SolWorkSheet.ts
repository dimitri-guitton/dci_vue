interface SolWorkSheet {
    epaisseurProduit: string;
    accesCamion: string;
    distCamion: number;
    hautPlafond: string;
    support: string;
    distPointEau: string;
    resistTherm: string;
    dimensionsPieces: string[];
    isolationExistante: boolean;
    niveauHabitation: string;
    habitationSurLocalFroid: boolean;
    videSanitaire: boolean;
    terrePlein: boolean;
    reseauPlafond: boolean;
    luminairesPlafond: boolean;
    distancePortesPalfond: string[];
    porteGarage: string;
    nbrPorteGarage: string;
    infosSup: string;
    periodePose: string;
}

export default SolWorkSheet;
