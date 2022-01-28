interface SvairAvisImpot {
    anneeImpots: string;
    anneeRevenus: string;
    dateEtablissement: string;
    dateRecouvrement: string;
    declarant1: {
        dateNaissance: string;
        nom: string;
        nomNaissance: string;
        prenoms: string;
    };
    declarant2: {
        dateNaissance: string;
        nom: string;
        nomNaissance: string;
        prenoms: string;
    };
    foyerFiscal: {
        adresse: string;
        annee: number;
        complement: string;
        ville: string;
    };
    impotRevenuNetAvantCorrections: number;
    montantImpot: number;
    nombreParts: number;
    nombrePersonnesCharge: number;
    revenuBrutGlobal: number;
    revenuFiscalReference: number;
    revenuImposable: number;
    situationFamille: string;
}

export default SvairAvisImpot;
