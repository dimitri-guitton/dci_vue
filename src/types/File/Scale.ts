interface Scale {
    stages: {
        nbr: number;
        min: number;
        max: number;
    }[];
    code: string;
    ceeBonus: {
        h1: number;
        h2: number;
        h3: number;
    };
}

export default Scale;
