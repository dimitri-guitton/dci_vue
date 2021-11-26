interface Assent {
    uid: string;
    refAvis: string;
    numFiscal: string;
    isbeneficiaire: boolean;
    datagouv: {
        refAvis: string;
        numFiscal: string;
        loaded: boolean;
        nom: string;
        prenom: string;
        adresse: string;
        ville: string;
        revenu: number;
        error: boolean;
    };
    nom: string;
    prenom: string;
    adresse: string;
    codepostal: string;
    ville: string;
    revenu: number;
    civilite: string;
}

export default Assent;
