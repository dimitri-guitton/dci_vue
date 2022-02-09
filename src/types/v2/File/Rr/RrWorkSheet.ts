import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface RrWorkSheet extends BaseWorksheet {
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
    emplacementSplit1: string;
    emplacementSplit2: string;
    emplacementSplit3: string;
    emplacementSplit4: string;
    emplacementSplit5: string;
    emplacementGrpExt: string;
    emplacementSplitMono: string;
    distanceGpExtSplit1: number;
    distanceGpExtSplit2: number;
    distanceGpExtSplit3: number;
    distanceGpExtSplit4: number;
    distanceGpExtSplit5: number;
    nbPompeRelevage: number;
    positionEauChaude: string;
    hauteurDuSol: number;
}

