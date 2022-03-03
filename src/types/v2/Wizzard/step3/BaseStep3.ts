export interface BaseStep3 {
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
}
