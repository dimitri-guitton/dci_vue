import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';

export interface CombleWorkSheet extends BaseWorksheet {
    visiteComble: boolean;
    chantierHabite: boolean;
    chantierType: string;
    niveauHabitation: string;
    gdEchelle: boolean;
    partieAisoler: string;
    puissanceCompteur: number;
    accesPl: boolean;
    rueEtroite: boolean;
    accesComble: string;
    couvertureType: string;
    charpenteType: string;
    etatToiture: string;
    volige: boolean;
    nbAccesComble: number;
    nbCompartimentComble: number;
    isolationExistante: boolean;
    isolationExistanteType: string;
    isolationExistanteCouches: number;
    lardagePareVapeur: boolean;
    rehausseTrappeType: string;
    desencombrement: boolean;
}
