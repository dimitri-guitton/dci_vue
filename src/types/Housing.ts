import DataGeoportail from '@/types/DataGeoportail';

interface Housing {
    nbOccupant: number;
    type: string;
    isAddressBenef: boolean;
    addresse: string;
    zipCode: string;
    city: string;
    plot: string;
    area: string;
    dataGeoportail?: DataGeoportail;
    location: string;
    insulationQuality: string;
    constructionYear: number;
    lessThan2Years: boolean;
    availableVoltage: string;
}

export default Housing;
