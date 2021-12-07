interface RoWorkSheet {
    period: string;
    niveauHabitation: string;
    typeChantier: string;
    disjoncteur: boolean;
    natureMurExt: string;
    naturePlafond: string;
    visiteComble: boolean;
    chantierHabite: boolean;
    grandeEchelle: boolean;
    demandeVoirie: boolean;
    puissanceCompteur: number;
    distanceCompteurPac: number;
    accesComble: string;
    rueEtroite: boolean;
    typeCouverture: string;
    etatToiture: string;
    typeCharpente: string;
    nbCompartimentComble: number;
    presenceVolige: boolean;
    nbAccesComble: number;
    distanceGpExtUnitInt: number;
    nbTotalRadiateur: number;
    nbRadiateurThermostatique: number;
    typeRadiateur: string;
    espaceSolRequisUnitInt: boolean;
    hauteurRequiseUnitInt: boolean;
    positionEauChaude: string;
    hauteurDuSol: number;
    infosSup: string;
}

export default RoWorkSheet;
