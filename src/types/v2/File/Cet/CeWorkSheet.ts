import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface CetWorkSheet extends BaseWorksheet {
    niveauHabitation: string;
    typeChantier: string;
    disjoncteur: boolean;
    tensionDisponible: string;  // NEW
    distanceCompteurCet: number;    // NEW
    natureMurExt: string;
    naturePlafond: string;
    visiteComble: boolean;
    chantierHabite: boolean;
    grandeEchelle: boolean;
    demandeVoirie: boolean;
    puissanceCompteur: number;
    accesComble: string;
    rueEtroite: boolean;
    typeCouverture: string;
    etatToiture: string;
    typeCharpente: string;
    nbCompartimentComble: number;
    presenceVolige: boolean;
    nbAccesComble: number;
    nbrCompartementComble: number;
    nbrAccesComble: number;
    typeRadiateur: string;
    emplacementCetExistante: string;
    emplacementCetNew: string;
    aspirationType: string;
    ballonFixeMur: boolean;
    uniteExtFixeMur: boolean;
    distanceBallonUnitExt: number;
}
