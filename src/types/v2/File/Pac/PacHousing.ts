/**
 * Interface pour les infos du logement du Devis
 */
import { Housing } from '@/types/v2/File/Common/Housing';

export interface PacHousing extends Housing {
    availableVoltage: string;
    buildingCoefficient: number;   // Anciennment Isolation
    climaticZone: string;          // Zone climatique
    altitude: number;
    heaters: string;               // Radiateurs
    ceilingHeight: number;         // Hauteur sous plafond
    setPointTemperature: number;    // Température de consigne
}
