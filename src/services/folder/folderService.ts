import fs from 'fs';
import Store from 'electron-store';
import * as commonService from '../commonService';
import { toFrenchDate } from '../commonService';
import { convertOldRoFile } from '@/services/file/converter/convertRoData';
import { convertOldRrFile } from '@/services/file/converter/convertRrData';
import { convertOldCetFile } from '@/services/file/converter/convertCetData';
import path from 'path';
import { addFile, deleteFile } from '@/services/sqliteService';
import { FILE_CET, FILE_COMBLE, FILE_PAC_RO, FILE_PAC_RR, FILE_PG, FILE_SOL } from '@/services/constantService';
import { getcurrentFolderName, setCurrentFileData } from '@/services/data/dataService';
import { convertOldPgFile } from '@/services/file/converter/convertPgData';
import { convertOldCombleFile } from '@/services/file/converter/convertCombleData';
import { convertOldSolFile } from '@/services/file/converter/convertSolData';
import { DatatableFile } from '@/types/v2/DatatableFile/DatatableFile';
import { PdfType } from '@/services/pdf/pdfGenerator';
import { shell } from 'electron';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { NewFolderData } from '@/components/DCI/modals/NewFileModal.vue';

const schema = {
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

const store = new Store( { schema } );

/**
 * Créé le dossier DCI si il n'exsite pas
 */
export const createDciFolderIfNotExist = () => {
    const dropboxPath = store.get( 'dropboxPath' );
    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI' ) ) {
        fs.mkdirSync( dropboxPath + '/DCI' );
    }
};

const FoldersNames = {
    AVIS_FOLDER:                        'avis',
    MAP_FOLDER:                         'carte',
    DEVIS_FOLDER:                       'devis',
    DEVIS_SIGNE_FOLDER:                 'devis_signe',
    FICHE_FOLDER:                       'fiche',
    FICHE_SIGNE_FOLDER:                 'fiche_signe',
    ATTEST_ADRESSE_SIGNE_FOLDER:        'attest_adresse_signe',
    PHOTOS_FACADE_FOLDER:               'photos_facade',
    PHOTOS_MAISON_FOLDER:               'photos_maison',
    PHOTOS_CHANTIER_FOLDER:             'photos_chantier',
    ATTESTATION_HONNEUR_FOLDER:         'attestation_sur_honneur',
    MANDAT_MA_PRIME_RENOV:              'mandat_maprimerenov',
    PHOTOS_TABLEAU_ELECTRIQUE:          'photos_tableau_electrique',
    PHOTOS_ANCIENNE_CHAUDIERE:          'photos_ancienne_chaudiere',
    PHOTOS_RADIATEUR:                   'photos_radiateur',
    PHOTOS_EMPLACEMENT_UNITE_EXT:       'photos_emplacement_unite_ext',
    PHOTOS_EMPLACEMENT_SPLITS:          'photos_emplacement_splits',
    ATTEST_TVA_SIMPLIFIEE_FOLDER:       'attest_tva_simp',
    ATTEST_TVA_SIMPLIFIEE_SIGNE_FOLDER: 'attest_tva_simp_signe',
    CADRE_CONTRIBUTION_CEE:             'cadre_contribution_cee',
    PHOTO_EMPLACEMENT_POELE:            'photo_emplacement_poele',
    PHOTO_COMBLE_EMPLACEMENT_TUYAUX:    'photo_comble_emplacement_tuyaux',
    PHOTO_TOITURE:                      'photo_toiture_et_tuile',
};

const Folders = [
    { name: FoldersNames.AVIS_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.MAP_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.ATTEST_ADRESSE_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.PHOTOS_FACADE_FOLDER, dossierType: [ FILE_SOL, FILE_COMBLE, FILE_PG ] },
    { name: FoldersNames.PHOTOS_MAISON_FOLDER, dossierType: [ FILE_SOL, FILE_COMBLE ] },
    { name: FoldersNames.PHOTOS_CHANTIER_FOLDER, dossierType: [ FILE_SOL ] },
    { name: FoldersNames.ATTESTATION_HONNEUR_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.PHOTOS_TABLEAU_ELECTRIQUE, dossierType: [ FILE_PAC_RR, FILE_PAC_RO, FILE_PG ] },
    { name: FoldersNames.MANDAT_MA_PRIME_RENOV, dossierType: [ FILE_PAC_RO, FILE_CET, FILE_PG ] },
    { name: FoldersNames.PHOTOS_ANCIENNE_CHAUDIERE, dossierType: [ FILE_PAC_RO ] },
    { name: FoldersNames.PHOTOS_RADIATEUR, dossierType: [ FILE_PAC_RO ] },
    { name: FoldersNames.PHOTOS_EMPLACEMENT_UNITE_EXT, dossierType: [ FILE_PAC_RR, FILE_PAC_RO ] },
    { name: FoldersNames.PHOTOS_EMPLACEMENT_SPLITS, dossierType: [ FILE_PAC_RR ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE_FOLDER, dossierType: [ FILE_PAC_RR, FILE_PAC_RO, FILE_CET, FILE_PG ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE_SIGNE_FOLDER, dossierType: [ FILE_PAC_RR, FILE_PAC_RO, FILE_CET, FILE_PG ] },
    { name: FoldersNames.CADRE_CONTRIBUTION_CEE, dossierType: [ FILE_PAC_RR, FILE_PAC_RO ] },
    { name: FoldersNames.PHOTO_EMPLACEMENT_POELE, dossierType: [ FILE_PG ] },
    { name: FoldersNames.PHOTO_COMBLE_EMPLACEMENT_TUYAUX, dossierType: [ FILE_PG ] },
    { name: FoldersNames.PHOTO_TOITURE, dossierType: [ FILE_PG ] },
];

/**
 * Créer les sous dossier dans un dossier principale
 * @param type
 * @param parent
 */
const createSubFolders   = ( type: string, parent: string ) => {
    const subFolders = Folders.filter( folder => {
        if ( folder.dossierType !== undefined ) {
            return folder.dossierType.filter( t => t === 'all' || t === type ).length > 0;
        }
        return false;
    } );

    subFolders.forEach( subFolder => {
        const newFolder = path.resolve( parent, subFolder.name );
        if ( !fs.existsSync( newFolder ) ) {
            fs.mkdirSync( newFolder );
        }
    } );
};
// TODO argument inutile comme type qui est déja dans NewFolderData
export const addJsonData = ( type: string, parent: string, reference: string, folderName: string, newFolder: NewFolderData ) => {

    console.log( '%c ', 'background: #fdd835; color: #000000' );
    console.log( '%c ', 'background: #fdd835; color: #000000' );
    console.log( '%c ', 'background: #fdd835; color: #000000' );
    console.log( '%c ', 'background: #fdd835; color: #000000' );
    console.log( newFolder );

    // TEMP
    let rawdata = '';
    if ( type === FILE_CET ) {
        rawdata = '{"version":"1","type":"cet","ref":"","folderName":"","createdAt":"","updatedAt":"","settings":{"ceeCoef":"5.5"},"disabledBonus":false,"disabledCeeBonus":false,"enabledHousingAction":false,"disabledMaPrimeRenovBonus":false,"assents":[],"beneficiary":{"civility":"m","lastName":"","firstName":"","address":"","zipCode":"","city":"","email":"","phone":"","mobile":"","income":0},"codeBonus":null,"energyZone":null,"housing":{"nbOccupant":1,"type":"maison_individuelle","buildingNature":"","heatingType":"electrique","isRentedHouse":false,"isAddressBenef":true,"address":"","zipCode":"","city":"","plot":"","area":0,"dataGeoportail":{},"location":"","insulationQuality":"","constructionYear":"","lessThan2Years":false,"availableVoltage":""},"worksheet":{"period":"","niveauHabitation":"pp","typeChantier":"neuf","disjoncteur":false,"tensionDisponible":"monophase","distanceCompteurCet":0,"natureMurExt":"parpaing","naturePlafond":"brique","visiteComble":false,"chantierHabite":false,"grandeEchelle":false,"demandeVoirie":false,"puissanceCompteur":6,"accesComble":"trappe","rueEtroite":false,"typeCouverture":"mecanique","etatToiture":"propre","typeCharpente":"traditionnelle","nbCompartimentComble":1,"presenceVolige":false,"nbAccesComble":1,"emplacementCetExistante":"","emplacementCetNew":"","aspirationType":"none","ballonFixeMur":false,"uniteExtFixeMur":false,"distanceBallonUnitExt":0,"infosSup":"RAS"},"quotation":{"origin":"","dateTechnicalVisit":"","executionDelay":"","options":[{"id":1,"fileType":"cet","label":"Forfait accessoire nécessaire à la pose, au raccordement de l’installation","unit":"u","defaultPu":100,"pu":100,"defaultNumber":1,"number":1},{"id":2,"fileType":"cet","label":"Forfait pose ( Pose nouvel appareil, mise en service)","unit":"u","defaultPu":350,"pu":350,"defaultNumber":1,"number":1},{"id":3,"fileType":"cet","label":"Raccordement extérieur par chapeau de toiture","unit":"u","defaultPu":100,"pu":100,"defaultNumber":0,"number":0},{"id":4,"fileType":"cet","label":"Raccordement extérieur mural","unit":"u","defaultPu":100,"pu":100,"defaultNumber":0,"number":0}],"blankOptions":[{"id":"sup1","label":"","unit":"u","pu":0,"number":0},{"id":"sup2","label":"","unit":"u","pu":0,"number":0}],"commentary":"","partner":"VTE","texts":[{"title":"Modalité de paiement : Prime CEE  versée directement à Eco Atlantique par Vos Travaux Eco","text":"Les travaux prévus dans ce devis peuvent être conditionnels à un dépôt de déclaration préalable de travaux. Il revient au maître d\'ouvrage (le client) d\'en faire lui-même la demande.\\r\\nLa TVA à taux réduit de 5,5% ne s\'applique qu\'à des commandes passées par des particuliers et relative à des locaux à usage d\'habitation dont la construction est achevée depuis plus de deux ans.\\r\\n\\r\\nLes travaux relatifs à ce document sont éligibles au dispositif des certificats d\'économies d\'énergie. Dans ce cadre, l\'obligé \\"Vos Travaux Eco\\", grâce à son partenaire Eco Atlantique, me fait bénéficier d\'une Prime énergie, dont le montant sera avancé par Eco Atlantique et remboursé par Vos Travaux Eco à Eco Atlantique.\\r\\n\\r\\n* « Dans le cas où l\'aide notifiée au client est inférieure au montant de l\'aide prévisionnelle, l\'usager n\'est pas lié par le devis et l\'entreprise s\'engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d\'une durée de quatorze jours à partir de la date de présentation du devis rectificatif.L\'aide MaPrimeRénov\' est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire. En cas de fausse déclaration, de manœuvre frauduleuse ou de changement du projet de travaux subventionnés, le bénéficiaire s\'expose au retrait et reversement de tout ou partie de l\'aide. Les services de l\'Anah pourront faire procéder à tout contrôle des engagements et sanctionner le bénéficiaire et son mandataire éventuel des manquements constatés »."},{"title":"AIDE A LA RENOVATION ÉNERGÉTIQUE VERSÉE DIRECTEMENT À ECO ATLANTIQUE PAR ACTION LOGEMENT","text":"*«Dans le cas où l’aide notifiée au client est inférieure au montant de l’aide prévisionnelle, l’usager n’est pas lié par le devis et l’entreprise s’engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d’une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L’aide « Action Logement » est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire."}],"tva":5.5,"ceeBonus":0,"selectedProducts":[{"id":1,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 200L","reference":"CETACMO200","pu":2578,"defaultPu":2578,"description":"Capacité: 200L MONOBLOC\\r\\nDimensions HxLxP: 1689*602*691\\r\\nPuissance acoustique: 50 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c\\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\n\\r\\nFonctionne sur air ambiant si volume de la pièce> 20M3","size":"HxLxP: 1689*602*691","type":"mono"}],"products":[{"id":1,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 200L","reference":"CETACMO200","pu":2578,"defaultPu":2578,"description":"Capacité: 200L MONOBLOC\\r\\nDimensions HxLxP: 1689*602*691\\r\\nPuissance acoustique: 50 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c\\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\n\\r\\nFonctionne sur air ambiant si volume de la pièce> 20M3","size":"HxLxP: 1689*602*691","type":"mono"},{"id":2,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 250L","reference":"CETACMO250","pu":2675,"defaultPu":2675,"description":"Capacité: 250L MONOBLOC\\r\\nDimensions HxLxP: 1929*602*691\\r\\nPuissance acoustique: 50 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,12 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\n\\r\\nFonctionne sur air ambiant si volume de la pièce> 20M3","size":"HxLxP: 1929*602*691","type":"mono"},{"id":3,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 200L","reference":"CETACSP200","pu":2456,"defaultPu":2456,"description":"Capacité: 200L SPLIT\\r\\nDimensions HxLxP: 1267*588*603mm poids 55kg\\r\\nPuissance acoustique du groupe: 55 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L\\r\\nClasse energetique: A+\\r\\nDimesion groupe exterieur HxLxP: 535*743*293 poids 26kg","size":"HxLxP: 1267*588*60","type":"split"},{"id":4,"productType":"cet","label":"CHAUFFE EAU THERMODYNAMIQUE ATLANTIC CALYPSO 270L","reference":"CETACSP270","pu":2666,"defaultPu":2666,"description":"Capacité: 270L SPLIT\\r\\nDimensions HxLxP: 1600*588*652mm poids 55kg\\r\\nPuissance acoustique du groupe: 55 dBa\\r\\nFluide: R513a\\r\\nPuissance max absorbée en PAC: 650W\\r\\nPlage de fonctionnement: -5/+43°c  \\r\\nAppoint électrique: 1800W\\r\\nCOP: 3,18 – Profil de soutirage : L pour une efficacité énergétique de 124%\\r\\nClasse energetique: A+\\r\\nDimesion groupe exterieur HxLxP: 535*743*293 poids 26kg","size":"HxLxP: 1600*588*652","type":"split"}],"maPrimeRenovBonus":0,"discount":0,"totalHt":0,"totalTva":0,"totalTtc":0,"remainderToPay":0},"scales":[{"stages":[{"nbr":1,"min":0,"max":15262},{"nbr":2,"min":0,"max":22320},{"nbr":3,"min":0,"max":26844},{"nbr":4,"min":0,"max":31359},{"nbr":5,"min":0,"max":35894},{"nbr":6,"min":0,"max":40420},{"nbr":7,"min":0,"max":44946},{"nbr":8,"min":0,"max":49472},{"nbr":9,"min":0,"max":53998},{"nbr":10,"min":0,"max":58524},{"nbr":11,"min":0,"max":63050},{"nbr":12,"min":0,"max":67576},{"nbr":13,"min":0,"max":72102}],"code":"GP","ceeBonus":{"h1":{"appartement":130.9,"maison_individuelle":171.6},"h2":{"appartement":130.9,"maison_individuelle":171.6},"h3":{"appartement":130.9,"maison_individuelle":171.6}}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000},{"nbr":11,"min":0,"max":80797},{"nbr":12,"min":0,"max":86594},{"nbr":13,"min":0,"max":92391}],"code":"P","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"IT","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"CL","ceeBonus":{"h1":{"appartement":65.45,"maison_individuelle":85.8},"h2":{"appartement":65.45,"maison_individuelle":85.8},"h3":{"appartement":65.45,"maison_individuelle":85.8}}}],"statusInDci":1,"errorsStatusInDci":[],"technician":{"id":{},"lastName":{},"firstName":{},"phone":{}},"lists":{"localTypeList":[{"slug":"maison_individuelle","value":"Maison individuelle"},{"slug":"appartement","value":"Appartement"}],"qualiteIsolationList":[{"slug":"0.6","value":"0.6"},{"slug":"0.65","value":"0.65"},{"slug":"0.8","value":"0.8"},{"slug":"0.9","value":"0.9"},{"slug":"1","value":"1"},{"slug":"1.1","value":"1.1"},{"slug":"1.3","value":"1.3"},{"slug":"1.5","value":"1.5"}],"statutMenageTypeList":[{"slug":"tres_bonifie","value":"Très bonfié"},{"slug":"bonifie","value":"Bonfié"},{"slug":"classique","value":"Classique"},{"slug":"intermediaire","value":"Intermédiaire"}],"batimentNatureList":[{"slug":"","value":"-"},{"slug":"nouvelle_residence","value":"Nouvelle résidence principale"},{"slug":"location","value":"Location"},{"slug":"residence_secondaire","value":"Résidence secondaire"}],"naturePlafondList":[{"slug":"brique","value":"Brique"},{"slug":"placo","value":"Placo"},{"slug":"bois","value":"Bois"},{"slug":"beton","value":"Béton"}],"niveauHabitationList":[{"slug":"pp","value":"Plein Pied"},{"slug":"r1","value":"R+1"},{"slug":"r2","value":"R+2"},{"slug":"r3","value":"R+3"},{"slug":"r4","value":"R+4"},{"slug":"autre","value":"AUTRE"}],"typeChantierList":[{"slug":"neuf","value":"Neuf"},{"slug":"reno","value":"Reno"}],"accesCombleList":[{"slug":"trappe","value":"TRAPPE"},{"slug":"toit","value":"TOITURE"},{"slug":"trappe_et_toit","value":"TRAPPE et TOITURE"}],"typeCouvertureList":[{"slug":"meca","value":"Mecanique"},{"slug":"tige_bottes","value":"Tiges de bottes"},{"slug":"ardoise","value":"Ardoise"},{"slug":"tuiles_plates","value":"Tuiles plates"},{"slug":"tuiles_courbes","value":"Tuiles courbes"}],"typeCharpenteList":[{"slug":"trad","value":"Traditionnelle"},{"slug":"ferm","value":"Fermettes"},{"slug":"metal","value":"Metallique"},{"slug":"autre","value":"Autre"}],"etatToitureList":[{"slug":"propre","value":"Propre"},{"slug":"mousse_faible","value":"Mousse en petite quantité"},{"slug":"mousse_important","value":"Mousse importante"}],"puissanceCompteurList":[{"slug":3,"value":3},{"slug":6,"value":6},{"slug":9,"value":9},{"slug":12,"value":12},{"slug":18,"value":18}],"natureMurExtList":[{"slug":"parpaing","value":"Parpaing"},{"slug":"brique","value":"Brique"},{"slug":"beton","value":"Béton"},{"slug":"pierre","value":"Pierre"},{"slug":"bois","value":"Bois"}],"chauffageTypeList":[{"slug":"electrique","value":"Electrique"},{"slug":"combustible","value":"Combustible"}],"tensionDisponibleList":[{"slug":"monophase","value":"Monophasé"},{"slug":"triphase","value":"Triphasé"}],"aspirationTypeList":[{"slug":"none","value":"Sélectionnez un type d\'installation"},{"slug":"aspiration_extraction_gainee","value":"Aspiration et extraction gainées jusqu\'au toit (tuiles à douilles)"},{"slug":"aspiration_piece","value":"Aspiration dans la pièce (au moins 20m3) et extraction par le toit (tuile à douille)"},{"slug":"aspiration_extraction_piece","value":"Aspiration et extraction dans la pièce (au moins 20m3)"}],"typeOrigineList":[{"slug":"telephone","value":"Téléphone"},{"slug":"internet","value":"Internet"},{"slug":"presse","value":"Presse"},{"slug":"campagne-google","value":"Campagne Google"},{"slug":"autre","value":"Autre"},{"slug":"hello-watt","value":"hello watt"},{"slug":"angelique","value":"Angélique"}]}}';
    } else if ( type === FILE_COMBLE ) {
        rawdata = '{"version":"1","type":"comble","ref":"","folderName":"","createdAt":"","updatedAt":"","settings":{"ceeCoef":"5.5"},"disabledBonus":false,"disabledCeeBonus":false,"enabledHousingAction":false,"disabledMaPrimeRenovBonus":false,"assents":[],"beneficiary":{"civility":"m","lastName":"","firstName":"","address":"","zipCode":"","city":"","email":"","phone":"","mobile":"","income":0},"codeBonus":null,"energyZone":null,"bonusRate":0,"housing":{"nbOccupant":1,"type":"residentiel","heatingType":"electrique","buildingNature":"","isRentedHouse":false,"isAddressBenef":true,"address":"","zipCode":"","city":"","plot":"","area":0,"dataGeoportail":{},"location":"","insulationQuality":"","constructionYear":"","lessThan2Years":false,"availableVoltage":""},"worksheet":{"visiteComble":true,"chantierHabite":true,"chantierType":"reno","niveauHabitation":"rdc","gdEchelle":false,"partieAisoler":"hab_ss_gge","puissanceCompteur":0,"accesPl":false,"period":"","rueEtroite":false,"accesComble":"trappe","couvertureType":"meca","charpenteType":"ferm","etatToiture":"propre","volige":false,"nbAccesComble":0,"nbCompartimentComble":0,"isolationExistante":true,"isolationExistanteType":"vrac","isolationExistanteCouches":0,"lardagePareVapeur":false,"rehausseTrappeType":"polypro","desencombrement":false,"infosSup":"RAS"},"quotation":{"laying":2.5,"overrideLaying":2.5,"origin":"","dateTechnicalVisit":"","executionDelay":"","options":[{"id":1,"fileType":"comble","label":"Enlèvement de la laine existante en rouleau","unit":"m2","defaultPu":8,"pu":8,"defaultNumber":0,"number":0},{"id":2,"fileType":"comble","label":"Remise en place de la laine existante ou lardage du pare vapeur","unit":"m2","defaultPu":4,"pu":4,"defaultNumber":0,"number":0},{"id":3,"fileType":"comble","label":"Création d\'un trou d\'homme","unit":"u","defaultPu":50,"pu":50,"defaultNumber":0,"number":0},{"id":10,"fileType":"comble","label":"Nbre de coffrage volets roulant < 1.5m","unit":"u","defaultPu":15,"pu":15,"defaultNumber":0,"number":0},{"id":11,"fileType":"comble","label":"Nbre de coffrage volets roulant > 1.5m","unit":"u","defaultPu":15,"pu":15,"defaultNumber":0,"number":0},{"id":12,"fileType":"comble","label":"Coffrage bloc moteur VMC ou Moteur Cheminée","unit":"u","defaultPu":10,"pu":10,"defaultNumber":0,"number":0},{"id":4,"fileType":"comble","label":"Coffrage de la trappe","unit":"u","defaultPu":10,"pu":10,"defaultNumber":0,"number":0},{"id":5,"fileType":"comble","label":"Isolation de la trappe","unit":"u","defaultPu":10,"pu":10,"defaultNumber":0,"number":0},{"id":6,"fileType":"comble","label":"Entourage de la cheminée","unit":"u","defaultPu":20,"pu":20,"defaultNumber":0,"number":0},{"id":13,"fileType":"comble","label":"Arrêtoires en Polypro","unit":"u","defaultPu":15,"pu":15,"defaultNumber":0,"number":0}],"blankOptions":[{"id":"sup1","label":"","unit":"u","pu":0,"number":0},{"id":"sup2","label":"","unit":"u","pu":0,"number":0}],"commentary":"","partner":"VTE","texts":[{"title":null,"text":"La TVA à taux réduit de 5,5% ne s\'applique qu\'à des commandes passées par des particuliers et relative à des locaux à usage d\'habitation dont la construction est achevée depuis plus de deux ans. Réalisation du chantier : France Menuisiers 43346499700157 RGE qualibat N°E-E93378"},{"title":"Modalité de paiement : Prime CEE  versée directement à Eco Atlantique par Vos Travaux Eco","text":"Les travaux relatifs à ce document sont éligibles au dispositif des certificats d\'économies d\'énergie. Dans ce cadre, l\'obligé \\"Vos Travaux Eco\\", grâce à son partenaire Eco Atlantique, me fait bénéficier d\'une Prime énergie, dont le montant sera avancé par Eco Atlantique et remboursé par Vos Travaux Eco à Eco Atlantique."},{"title":"AIDE A LA RENOVATION ÉNERGÉTIQUE VERSÉE DIRECTEMENT À ECO ATLANTIQUE PAR ACTION LOGEMENT","text":"*«Dans le cas où l’aide notifiée au client est inférieure au montant de l’aide prévisionnelle, l’usager n’est pas lié par le devis et l’entreprise s’engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d’une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L’aide « Action Logement » est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire."}],"tva":5.5,"selectedProducts":[{"id":1,"productType":"pg","label":"Isolation par soufflage d\'un matelas de laine minérale de marque KNAUF INSULATION – SUPAFIL LOFT 045","reference":"Laine minérale de Verre SUPAFIL Thermo Loft. R = 7m².K/W, ép.320mm","pu":12.2,"defaultPu":12.2,"description":"- Certification ACERMI : 04/D/16/378 \\r\\n- Résistance thermique : 7 m².k/w   Épaisseur mini (mm) : 320 mm\\r\\n- Pouvoir couvrant (kg/m²) : 3,8 - Classement au feu : A1 (incombustible)"}],"products":[{"id":1,"productType":"iso_comble","label":"Isolation par soufflage d\'un matelas de laine minérale de marque KNAUF INSULATION – SUPAFIL LOFT 045","reference":"Laine minérale de Verre SUPAFIL Thermo Loft. R = 7m².K/W, ép.320mm","pu":12.2,"defaultPu":12.2,"description":"- Certification ACERMI : 04/D/16/378 \\r\\n- Résistance thermique : 7 m².k/w   Épaisseur mini (mm) : 320 mm\\r\\n- Pouvoir couvrant (kg/m²) : 3,8 - Classement au feu : A1 (incombustible)"},{"id":4,"productType":"iso_comble","label":"Isolation en R8 par soufflage d\'un matelas de laine minérale de marque KNAUF INSULATION – SUPAFIL LOFT 045","reference":"Laine minérale de Verre SUPAFIL Thermo Loft. R = 8m².K/W, ép.365mm","pu":13.7,"defaultPu":13.7,"description":"- Certification ACERMI : 04/D/16/378 \\r\\n- Résistance thermique : 8 m².k/w   Épaisseur mini (mm) : 365 mm\\r\\n- Pouvoir couvrant (kg/m²) : 4.4 - Classement au feu : A1 (incombustible)"},{"id":5,"productType":"iso_comble","label":"Isolation en R9 par soufflage d\'un matelas de laine minérale de marque KNAUF INSULATION – SUPAFIL LOFT 045","reference":"Laine minérale de Verre SUPAFIL Thermo Loft. R = 9m².K/W, ép.410mm","pu":15.2,"defaultPu":15.2,"description":"- Certification ACERMI : 04/D/16/378 \\r\\n- Résistance thermique : 9 m².k/w    Épaisseur mini (mm) : 410 mm\\r\\n- Pouvoir couvrant (kg/m²) : 4.9 - Classement au feu : A1 (incombustible)"}],"discount":0,"totalHt":0,"totalTva":0,"totalTtc":0,"remainderToPay":0,"ceeBonus":0},"scales":[{"stages":[{"nbr":1,"min":19565},{"nbr":2,"min":28614},{"nbr":3,"min":34411},{"nbr":4,"min":40201},{"nbr":5,"min":46015},{"nbr":6,"min":51812},{"nbr":7,"min":57609},{"nbr":8,"min":63406},{"nbr":9,"min":69203},{"nbr":10,"min":75000}],"code":"CL","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000}],"code":"GP","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"PACCL","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}},{"stages":[{"nbr":1,"min":0,"max":15262},{"nbr":2,"min":0,"max":22320},{"nbr":3,"min":0,"max":26844},{"nbr":4,"min":0,"max":31359},{"nbr":5,"min":0,"max":35894},{"nbr":6,"min":0,"max":40420},{"nbr":7,"min":0,"max":44946},{"nbr":8,"min":0,"max":49472},{"nbr":9,"min":0,"max":53998},{"nbr":10,"min":0,"max":58524},{"nbr":11,"min":0,"max":63050},{"nbr":12,"min":0,"max":67576},{"nbr":13,"min":0,"max":72102}],"code":"PACGP","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"PACIT","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000},{"nbr":11,"min":0,"max":80797},{"nbr":12,"min":0,"max":86594},{"nbr":13,"min":0,"max":92391}],"code":"PACP","ceeBonus":{"h1":9.35,"h2":7.7,"h3":9.35}}],"statusInDci":1,"errorsStatusInDci":[],"technician":{"id":{},"lastName":{},"firstName":{},"phone":{}},"lists":{"localTypeList":[{"slug":"residentiel","value":"Résidentiel"},{"slug":"tertiaire","value":"Tertiaire"},{"slug":"sante","value":"Santé"}],"chauffageTypeList":[{"slug":"electrique","value":"Electrique"},{"slug":"combustible","value":"Combustible"}],"batimentNatureList":[{"slug":"","value":"-"},{"slug":"nouvelle_residence","value":"Nouvelle résidence principale"},{"slug":"location","value":"Location"},{"slug":"residence_secondaire","value":"Résidence secondaire"}],"chantierTypeList":[{"slug":"reno","value":"RENO"},{"slug":"neuf","value":"NEUF"}],"niveauHabitationList":[{"slug":"rdc","value":"RDC"},{"slug":"r1","value":"R+1"},{"slug":"r2","value":"R+2"},{"slug":"r3","value":"R+3"},{"slug":"r4","value":"R+4"},{"slug":"autre","value":"AUTRE"}],"partieAIsolerList":[{"slug":"hab_av_gge","value":"HABITATION (av garage)"},{"slug":"hab_ss_gge","value":"HABITATION (ss garage)"},{"slug":"autre","value":"AUTRE"}],"puissanceCompteurList":[{"slug":3,"value":3},{"slug":6,"value":6},{"slug":9,"value":9},{"slug":12,"value":12},{"slug":18,"value":18}],"accesCombleList":[{"slug":"trappe","value":"TRAPPE"},{"slug":"toit","value":"TOITURE"},{"slug":"trappe_et_toit","value":"TRAPPE et TOITURE"}],"couvertureTypeList":[{"slug":"meca","value":"Mecanique"},{"slug":"tige_bottes","value":"Tiges de bottes"},{"slug":"ardoise","value":"Ardoise"},{"slug":"tuiles_plates","value":"Tuiles plates"},{"slug":"tuiles_courbes","value":"Tuiles courbes"}],"charpenteTypeList":[{"slug":"trad","value":"Traditionnelle"},{"slug":"ferm","value":"Fermettes"},{"slug":"metal","value":"Metallique"},{"slug":"autre","value":"Autre"}],"etatToitureList":[{"slug":"propre","value":"Propre"},{"slug":"mousse_faible","value":"Mousse en petite quantité"},{"slug":"mousse_important","value":"Mousse importante"}],"isolationExistanteTypeList":[{"slug":"rouleau","value":"ROULEAU"},{"slug":"vrac","value":"VRAC"},{"slug":"vrac_rouleau","value":"Vrac et rouleau"},{"slug":"","value":"pas d’isolant"}],"rehausseTrappeTypeList":[{"slug":"polypro","value":"POLYPRO"},{"slug":"bois","value":"BOIS"}],"nbrAccesCombleList":[{"slug":0,"value":0},{"slug":1,"value":1},{"slug":2,"value":2},{"slug":3,"value":3},{"slug":4,"value":4}],"nbrCompartimentsList":[{"slug":0,"value":0},{"slug":1,"value":1},{"slug":2,"value":2},{"slug":3,"value":3},{"slug":4,"value":4}],"typeOrigineList":[]}}';
    } else if ( type === FILE_SOL ) {
        rawdata = '{"version":"1","type":"sol","ref":"","folderName":"","createdAt":"","updatedAt":"","settings":{"ceeCoef":"5.5"},"disabledBonus":false,"disabledCeeBonus":false,"enabledHousingAction":false,"disabledMaPrimeRenovBonus":false,"assents":[],"beneficiary":{"civility":"m","lastName":"","firstName":"","address":"","zipCode":"","city":"","email":"","phone":"","mobile":"","income":0},"codeBonus":null,"energyZone":null,"bonusRate":0,"housing":{"nbOccupant":1,"type":"residentiel","heatingType":"electrique","buildingNature":"","isRentedHouse":false,"isAddressBenef":true,"address":"","zipCode":"","city":"","plot":"","area":0,"dataGeoportail":{},"location":"","insulationQuality":"","constructionYear":"","lessThan2Years":false,"availableVoltage":""},"worksheet":{"epaisseurProduit":"115 mm","accesCamion":"facile","distCamion":0,"hautPlafond":"","support":"bois","distPointEau":"","resistTherm":"","dimensionsPieces":["","","","","",""],"isolationExistante":false,"niveauHabitation":"r1","habitationSurLocalFroid":false,"videSanitaire":false,"terrePlein":false,"reseauPlafond":false,"luminairesPlafond":false,"distancePortesPalfond":["","","","","",""],"porteGarage":"","nbrPorteGarage":"","infosSup":"RAS","period":""},"quotation":{"laying":2.5,"overrideLaying":2.5,"origin":"","dateTechnicalVisit":"","executionDelay":"","options":[{"id":51,"fileType":"sol","label":"Préparation chantier (protection si nécessaire)","unit":"u","defaultPu":0,"pu":0,"defaultNumber":0,"number":0},{"id":52,"fileType":"sol","label":"Si Jetspray : Mise en place d\'un nergalto (uniquement si support bois)","unit":"u","defaultPu":15,"pu":15,"defaultNumber":0,"number":0},{"id":53,"fileType":"sol","label":"Si Jetspray : Passage du primaire d\'accroche Jetspray primer","unit":"u","defaultPu":0,"pu":0,"defaultNumber":0,"number":0}],"blankOptions":[{"id":"sup1","label":"","unit":"u","pu":0,"number":0},{"id":"sup2","label":"","unit":"u","pu":0,"number":0}],"commentary":"","partner":"VTE","texts":[{"title":"Les travaux prévus dans ce devis concernent l\'isolation d\'un plancher bas","text":"La TVA à taux réduit de 5,5% ne s\'applique qu\'à des commandes passées par des particuliers et relative à des locaux à usage d\'habitation dont la construction est achevée depuis plus de deux ans. Réalisation du chantier : France Menuisiers 43346499700157 RGE qualibat N°E-E93378"},{"title":"Modalité de paiement : Prime CEE  versée directement à Eco Atlantique par Vos Travaux Eco","text":"Les travaux relatifs à ce document sont éligibles au dispositif des certificats d\'économies d\'énergie. Dans ce cadre, l\'obligé \\"Vos Travaux Eco\\", grâce à son partenaire Eco Atlantique, me fait bénéficier d\'une Prime énergie, dont le montant sera avancé par Eco Atlantique et remboursé par Vos Travaux Eco à Eco Atlantique."},{"title":"AIDE A LA RENOVATION ÉNERGÉTIQUE VERSÉE DIRECTEMENT À ECO ATLANTIQUE PAR ACTION LOGEMENT","text":"*«Dans le cas où l’aide notifiée au client est inférieure au montant de l’aide prévisionnelle, l’usager n’est pas lié par le devis et l’entreprise s’engage à proposer un devis rectificatif. Le client conserve alors un droit de rétractation d’une durée de quatorze jours à partir de la date de présentation du devis rectificatif. L’aide « Action Logement » est conditionnelle et soumise à la conformité des pièces justificatives et informations déclarées par le bénéficiaire."}],"tva":5.5,"selectedProducts":[{"id":2,"productType":"sol","label":"Isolation par projection pneumatique de laine minérale de marque KNAUF INSULATION – JETSPRAY THERMAL","reference":"Laine minérale de verre Jet Spray R = 3m².K/W","pu":32.5,"defaultPu":32.5,"description":"- Certification ACERMI : 15/016/1050/1\\r\\n\\r\\n            - Résistance thermique : 3,05 m².k/w\\r\\n\\r\\n            - Épaisseur mini (mm) : 110\\r\\n\\r\\n            - Masse volumique : 52 kg / m3\\r\\n\\r\\n            - Classement au feu : A1 Euroclasse\\r\\n\\r\\n            - Qualité de l\'air intérieur : A+ Médaille d\'or eurofins\\r\\n\\r\\n\\r\\n            - Nivellement de la surface"}],"products":[{"id":2,"productType":"iso_sol","label":"Isolation par projection pneumatique de laine minérale de marque KNAUF INSULATION – JETSPRAY THERMAL","reference":"Laine minérale de verre Jet Spray R = 3m².K/W","pu":32.5,"defaultPu":32.5,"description":"- Certification ACERMI : 15/016/1050/1\\r\\n\\r\\n            - Résistance thermique : 3,05 m².k/w\\r\\n\\r\\n            - Épaisseur mini (mm) : 110\\r\\n\\r\\n            - Masse volumique : 52 kg / m3\\r\\n\\r\\n            - Classement au feu : A1 Euroclasse\\r\\n\\r\\n            - Qualité de l\'air intérieur : A+ Médaille d\'or eurofins\\r\\n\\r\\n\\r\\n            - Nivellement de la surface"},{"id":6,"productType":"iso_sol","label":"Isolation thermique du plancher bas par Panneaux isolants de marque ST GOBAIN PLACO Terradall Portée","reference":"Panneau polystyrène TERRADALL PORTE IGNI R=3m².K/W","pu":32.5,"defaultPu":32.5,"description":"- Panneaux polystyrène expansé 1\\r\\n            - conductivité thermique 0,038 mW/m.k\\r\\n            - Certifié ACERMI 10/081/617\\r\\n            - Produit 100% Recyclable\\r\\n            - Resistance thermique :3 m².k/w\\r\\n            - Epaisseur mini \'mm) : 115\\r\\n            Pose collée ou chevillée"}],"discount":0,"totalHt":0,"totalTva":0,"totalTtc":0,"remainderToPay":0,"ceeBonus":0},"scales":[{"stages":[{"nbr":1,"min":19565},{"nbr":2,"min":28614},{"nbr":3,"min":34411},{"nbr":4,"min":40201},{"nbr":5,"min":46015},{"nbr":6,"min":51812},{"nbr":7,"min":57609},{"nbr":8,"min":63406},{"nbr":9,"min":69203},{"nbr":10,"min":75000}],"code":"CL","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000}],"code":"GP","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"PACCL","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}},{"stages":[{"nbr":1,"min":0,"max":15262},{"nbr":2,"min":0,"max":22320},{"nbr":3,"min":0,"max":26844},{"nbr":4,"min":0,"max":31359},{"nbr":5,"min":0,"max":35894},{"nbr":6,"min":0,"max":40420},{"nbr":7,"min":0,"max":44946},{"nbr":8,"min":0,"max":49472},{"nbr":9,"min":0,"max":53998},{"nbr":10,"min":0,"max":58524},{"nbr":11,"min":0,"max":63050},{"nbr":12,"min":0,"max":67576},{"nbr":13,"min":0,"max":72102}],"code":"PACGP","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}},{"stages":[{"nbr":1,"min":0,"max":29148},{"nbr":2,"min":0,"max":42848},{"nbr":3,"min":0,"max":51592},{"nbr":4,"min":0,"max":60336},{"nbr":5,"min":0,"max":69081},{"nbr":6,"min":0,"max":77825},{"nbr":7,"min":0,"max":86569},{"nbr":8,"min":0,"max":95313},{"nbr":9,"min":0,"max":104057},{"nbr":10,"min":0,"max":112801},{"nbr":11,"min":0,"max":121545},{"nbr":12,"min":0,"max":130289},{"nbr":13,"min":0,"max":139033}],"code":"PACIT","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}},{"stages":[{"nbr":1,"min":0,"max":19565},{"nbr":2,"min":0,"max":28614},{"nbr":3,"min":0,"max":34411},{"nbr":4,"min":0,"max":40201},{"nbr":5,"min":0,"max":46015},{"nbr":6,"min":0,"max":51812},{"nbr":7,"min":0,"max":57609},{"nbr":8,"min":0,"max":63406},{"nbr":9,"min":0,"max":69203},{"nbr":10,"min":0,"max":75000},{"nbr":11,"min":0,"max":80797},{"nbr":12,"min":0,"max":86594},{"nbr":13,"min":0,"max":92391}],"code":"PACP","ceeBonus":{"h1":{"electrique":8.8,"combustible":8.8},"h2":{"electrique":7.15,"combustible":7.15},"h3":{"electrique":8.8,"combustible":8.8}}}],"statusInDci":1,"errorsStatusInDci":[],"technician":{"id":{},"lastName":{},"firstName":{},"phone":{}},"lists":{"localTypeList":[{"slug":"residentiel","value":"Résidentiel"},{"slug":"tertiaire","value":"Tertiaire"},{"slug":"sante","value":"Santé"}],"chauffageTypeList":[{"slug":"electrique","value":"Electrique"},{"slug":"combustible","value":"Combustible"}],"batimentNatureList":[{"slug":"","value":"-"},{"slug":"nouvelle_residence","value":"Nouvelle résidence principale"},{"slug":"location","value":"Location"},{"slug":"residence_secondaire","value":"Résidence secondaire"}],"niveauHabitationList":[{"slug":"pp","value":"Plein pied"},{"slug":"r1","value":"R+1"},{"slug":"r2","value":"R+2"}],"porteGarageList":[{"slug":"","value":"non"},{"slug":"sectionnelle","value":"sectionnelle"},{"slug":"coulissante","value":"coulissante"}],"accesCamionList":[{"slug":"facile","value":"Facile"},{"slug":"difficile","value":"Difficile"}],"supportList":[{"slug":"bois","value":"Bois"},{"slug":"brique","value":"Brique"},{"slug":"beton","value":"Béton"},{"slug":"hourdis","value":"Hourdis"}],"typeOrigineList":[]}}';
    }


    // const jsonPath = `examples/empty_new_data_${ type }.json`;
    //
    // const rawdata            = fs.readFileSync( jsonPath ).toString( 'utf8' );


    let fileData: CombleFile = JSON.parse( rawdata );
    fileData                 = {
        ...fileData,
        ref:                       reference,
        folderName:                folderName,
        createdAt:                 toFrenchDate( new Date().toString() ),
        updatedAt:                 toFrenchDate( new Date().toString() ),
        disabledBonus:             newFolder.disabledBonus,
        disabledCeeBonus:          newFolder.disabledCeeBonus,
        enabledHousingAction:      newFolder.enabledHousingAction,
        disabledMaPrimeRenovBonus: newFolder.disabledMaPrimeRenovBonus,
        statusInDci:               2,
        errorsStatusInDci:         [],
    };

    console.log( `${ parent }/data.json` );
    console.log( fileData );
    fs.writeFileSync( `${ parent }/data.json`, JSON.stringify( fileData ) );
    setCurrentFileData( JSON.stringify( fileData ) );

};

export const createFolderRef = ( type: string ): string => {
    const today      = new Date();
    const stringDate = `${ today.getFullYear() }${ commonService.minTwoDigits( today.getMonth() + 1 ) }${ commonService.minTwoDigits(
        today.getDate() ) }${ commonService.minTwoDigits( today.getHours() ) }${ commonService.minTwoDigits( today.getMinutes() ) }${ commonService.minTwoDigits(
        today.getSeconds() ) }`;
    return `ID_COM-${ stringDate }-${ type.toUpperCase() }`;
};

/**
 * Créer un dossier de devis avec le type et le nom du client
 * @param newFolder
 */
export const createAFolder = async ( newFolder: NewFolderData ): Promise<{ reference: string; folderName: string }> => {
    const dropboxPath = store.get( 'dropboxPath' );
    const today       = new Date();


    const type     = newFolder.type;
    const customer = newFolder.customer;

    const reference  = createFolderRef( type );
    const folderName = `${ reference } (${ customer.toUpperCase() })`;

    const path = `${ dropboxPath }/DCI/${ folderName }`;
    if ( !fs.existsSync( path ) ) {
        fs.mkdirSync( path );

        createSubFolders( type, path );
        addJsonData( type, path, reference, folderName, newFolder );
        await addFile( reference, folderName, type, customer, 0, false, false, '2', null, today, today, null );
    }

    return {
        reference,
        folderName,
    };
};

/**
 * Convertie les anciens JSON
 */
export const convertAllOldJsonToNewJson = () => {
    console.log( '%c CONVERT', 'background: #fdd835; color: #000000' );
    // const dropboxPath        = store.get( 'dropboxPath' );
    const oldDatas: object[] = [];

    if ( fs.existsSync( 'examples/old_data_cet.json' ) ) {
        console.log( '%c CONVERT OLD CET', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_cet.json', 'utf8' ) ) );
    }
    if ( fs.existsSync( 'examples/old_data_pg.json' ) ) {
        console.log( '%c CONVERT OLD PG', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_pg.json', 'utf8' ) ) );
    }
    if ( fs.existsSync( 'examples/old_data_sol.json' ) ) {
        console.log( '%c CONVERT OLD SOL', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_sol.json', 'utf8' ) ) );
    }
    if ( fs.existsSync( 'examples/old_data_comble.json' ) ) {
        console.log( '%c CONVERT OLD COMBLE', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_comble.json', 'utf8' ) ) );
    }
    if ( fs.existsSync( 'examples/old_data_pac_ro.json' ) ) {
        console.log( '%c CONVERT OLD PAC RO', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_pac_ro.json', 'utf8' ) ) );
    }
    if ( fs.existsSync( 'examples/old_data_pac_rr.json' ) ) {
        console.log( '%c CONVERT OLD PAC RR', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( 'examples/old_data_pac_rr.json', 'utf8' ) ) );
    }

    for ( const oldData of oldDatas ) {
        let data = '';

        let type = oldData[ 'type' ].toLowerCase();

        if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
            data = JSON.stringify( convertOldRoFile( oldData ), null, 2 );
            type += '_ro';
        } else if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
            data = JSON.stringify( convertOldRrFile( oldData ), null, 2 );
            type += '_rr';
        } else if ( type === 'cet' ) {
            data = JSON.stringify( convertOldCetFile( oldData ), null, 2 );
        } else if ( type === 'poele' ) {
            data = JSON.stringify( convertOldPgFile( oldData ), null, 2 );
            type = 'pg';
        } else if ( type === 'comble' ) {
            data = JSON.stringify( convertOldCombleFile( oldData ), null, 2 );
        } else if ( type === 'sol' ) {
            data = JSON.stringify( convertOldSolFile( oldData ), null, 2 );
        } else {
            console.log( '%c RETURN FALSE', 'background: #fdd835; color: #000000' );
            return false;
        }

        // console.log( '%c NEW DATA', 'background: #fdd835; color: #000000' );
        // console.log( data );

        // const path = `${ dropboxPath }/DCI/empty_new_data_${ type }.json`;
        const path = `examples/empty_new_data_${ type }.json`;
        console.log( path );
        // if ( dropboxPath !== '' && !fs.existsSync( path ) ) {
        fs.writeFileSync( path, data );
        // }
    }

    return true;
};

export const getFolderPath = ( folderName: string ): string => {
    const dropboxPath = store.get( 'dropboxPath' );

    const path = `${ dropboxPath }/DCI/${ folderName }`;

    if ( fs.existsSync( path ) ) {
        return path;
    }

    return '';
};

/**
 * Supprime un dossiser dans Drpbox et dans la DB
 * @param folder
 */
export const removeFolder = async ( folder: DatatableFile ): Promise<boolean> => {
    const folderPath = getFolderPath( folder.folderName );

    if ( fs.existsSync( folderPath ) ) {
        try {
            fs.rmSync( folderPath, { recursive: true, force: true } );
            await deleteFile( folder.id );
            return true;
        } catch ( e ) {
            return false;
        }
    }

    return false;

};

export const updateJsonData = ( fileData ) => {
    console.log( '%c UPDATE JSON DATA', 'background: #35D452; color: #000000' );
    const name = getcurrentFolderName() as string;
    const path = `${ getFolderPath( name ) }/data.json`;
    console.log( path );
    if ( fs.existsSync( path ) ) {
        console.log( 'File data -->', fileData );
        fs.writeFileSync( path, JSON.stringify( fileData, null, 2 ) );
        setCurrentFileData( JSON.stringify( fileData ) );
    } else {
        console.log( `'%c LE FICHIER (${ path }) n'existe pas'`, 'background: #FF0017; color: #000000' );
    }
};

/**
 * TODO A FAIRE
 */
export const checkFolder = () => {
    return true;
};


export const openPdf = ( filePath: string ) => {
    shell.openPath( filePath );
};

export const savePdf = ( buffer: Buffer, type: PdfType, openAfterSave = true ) => {
    console.log( '%c ON SAVE PDF', 'background: #fdd835; color: #000000' );
    const folderName = getcurrentFolderName() as string;
    const folderPath = getFolderPath( folderName );

    let folder = '';
    let name   = '';
    switch ( type ) {
        case PdfType.Address:
            folder = FoldersNames.ATTEST_ADRESSE_SIGNE_FOLDER;
            name   = 'attestation_adresse.pdf';
            break;
        case PdfType.Quotation:
            folder = FoldersNames.DEVIS_FOLDER;
            name   = 'devis.pdf';
            break;
        case PdfType.Worksheet:
            folder = FoldersNames.FICHE_FOLDER;
            name   = 'fiche.pdf';
            break;
        case PdfType.Tva:
            folder = FoldersNames.ATTEST_TVA_SIMPLIFIEE_FOLDER;
            name   = 'attestation_tva_simplifiee.pdf';
            break;
        case PdfType.ContributionFramework:
            folder = FoldersNames.CADRE_CONTRIBUTION_CEE;
            name   = 'cadre_contribution.pdf';
            break;
        case PdfType.MaPrimeRenov:
            folder = FoldersNames.MANDAT_MA_PRIME_RENOV;
            name   = 'mandat_ma_prime_renov.pdf';
            break;
        default:
            console.log( '%c ERROR', 'background: #fdd835; color: #000000' );
    }

    const filePath = `${ folderPath }/${ folder }/${ name }`;
    fs.createWriteStream( filePath ).write( buffer );

    if ( openAfterSave ) {
        setTimeout( () => {
            openPdf( filePath );
        }, 500 );
    }
};
