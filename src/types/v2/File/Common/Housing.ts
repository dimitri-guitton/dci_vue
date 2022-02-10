/**
 * Interface pour les infos du logement du Devis
 */
import { DataGeoportail } from '@/types/v2/File/Common/DataGeoportail';

export interface Housing {
    nbOccupant: number;
    type: string;
    isAddressBenef: boolean;
    addresse: string;
    zipCode: string;
    city: string;
    plot: string;
    area: string;
    dataGeoportail: DataGeoportail | null;
    location: string;
    constructionYear: string;
    lessThan2Years: boolean;
    insulationQuality?: number;
    availableVoltage?: string;
    heatingType?: string;
}
