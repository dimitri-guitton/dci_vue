import { DataGeoportail } from '@/types/v2/File/Common/DataGeoportail';

export interface BaseStep3 {
    housingBuildingNature: string;
    nbOccupant: number;
    housingType: string;
    housingConstructionYear: number | null;
    housingLessThan2Years: boolean;
    housingIsAddressBenef: boolean;
    area: number;
    address: {
        plot: string;
        address: string;
        zipCode: string;
        city: string;
    };
    dataGeoportail: DataGeoportail;
}
