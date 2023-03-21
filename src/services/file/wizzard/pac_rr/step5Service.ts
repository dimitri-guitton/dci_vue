import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PacRrFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentRrFileData } from '@/services/data/dataService';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { RrWorkSheet } from '@/types/v2/File/Rr/RrWorkSheet';

/**
 * Création du formualaire pour la fiche d'info
 */
export const pacRrWorksheetBuilder = ( fileData: RrFile ): WorksheetBuilder => {

    const pacMono  = [
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtUnitInt',
            label: 'Distance entre le split et groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplitMono',
            label: 'Emplacement du split',
        },
    ];
    const pacMulti = [
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtSplit1',
            label: ' Distance entre le split 1 et le groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtSplit2',
            label: ' Distance entre le split 2 et le groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtSplit3',
            label: ' Distance entre le split 3 et le groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtSplit4',
            label: ' Distance entre le split 4 et le groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'distanceGpExtSplit5',
            label: ' Distance entre le split 5 et le groupe extérieur',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplit1',
            label: 'Emplacement du split 1',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplit2',
            label: 'Emplacement du split 2',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplit3',
            label: 'Emplacement du split 3',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplit4',
            label: 'Emplacement du split 4',
        },
        {
            type:  WorksheetBuilderItemType.Text,
            name:  'emplacementSplit5',
            label: 'Emplacement du split 5',
        },
    ];

    const pacOtherInfo = fileData.quotation.rrType === 'multi' ? pacMulti : pacMono;

    return {
        steps: [
            {
                items: [
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'visiteComble',
                        label: 'Visite des combles',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'niveauHabitation',
                        label:      'Niveau habitation',
                        selectList: 'niveauHabitationList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'chantierHabite',
                        label: 'Chantier habité',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeChantier',
                        label:      'Type de chantier',
                        selectList: 'typeChantierList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'grandeEchelle',
                        label: 'Grande échelle nécessaire',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'accesComble',
                        label:      'Accès des combles',
                        selectList: 'accesCombleList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbCompartimentComble',
                        label: 'Nombre de compartement des combles',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbAccesComble',
                        label: 'Nombre d\'accès aux combles',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceCompteurPac',
                        label: 'Distance entre le compteur électrique et la PAC',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeCouverture',
                        label:      'Type de couverture',
                        selectList: 'typeCouvertureList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeCharpente',
                        label:      'Type de charpente',
                        selectList: 'typeCharpenteList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'natureMurExt',
                        label:      'Nature des murs extérieurs',
                        selectList: 'natureMurExtList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'naturePlafond',
                        label:      'Nature du plafond',
                        selectList: 'naturePlafondList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'demandeVoirie',
                        label: 'Demande de voirie / accès PL',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'rueEtroite',
                        label: 'Rue étroite / sens unique',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'presenceVolige',
                        label: 'Présence volige',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'disjoncteur',
                        label: 'Disjoncteur 30 mA',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'tensionDisponible',
                        label:      'Tension disponible',
                        selectList: 'tensionDisponibleList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'puissanceCompteur',
                        label:      'Puissance du compteur',
                        selectList: 'puissanceCompteurList',
                    },

                ],
            },
            {
                items: [
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbrPompeRelevage',
                        label: 'Nombre de pompe de relevage/ unité intérieur',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'emplacementGrpExt',
                        label: 'Emplacement du groupe extérieur',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'positionEauChaude',
                        label:      'Position groupe exterieur',
                        selectList: 'positionEauChaudeList',
                    },

                    // TODO LOGIQUE SI "positionEauChaude" est checké
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hauteurDuSol',
                        label: ' À quelle hauteur du sol',
                    },
                    ...pacOtherInfo,
                ],
            },
        ],
    };
};

export const yupPacRrConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:               Yup.string(),
                                                              infosSup:             Yup.string(),
                                                              technicalVisit:       Yup.boolean(),
                                                              technicalVisitReason: Yup.string(),
                                                              niveauHabitation:     Yup.string(),
                                                              typeChantier:         Yup.string(),
                                                              disjoncteur:          Yup.boolean(),
                                                              natureMurExt:         Yup.string(),
                                                              naturePlafond:        Yup.string(),
                                                              visiteComble:         Yup.boolean(),
                                                              chantierHabite:       Yup.boolean(),
                                                              grandeEchelle:        Yup.boolean(),
                                                              demandeVoirie:        Yup.boolean(),
                                                              puissanceCompteur:    Yup.number(),
                                                              distanceCompteurPac:  Yup.number(),
                                                              accesComble:          Yup.string(),
                                                              rueEtroite:           Yup.boolean(),
                                                              typeCouverture:       Yup.string(),
                                                              etatToiture:          Yup.string(),
                                                              typeCharpente:        Yup.string(),
                                                              nbCompartimentComble: Yup.number(),
                                                              presenceVolige:       Yup.boolean(),
                                                              nbAccesComble:        Yup.number(),
                                                              distanceGpExtUnitInt: Yup.number(),
                                                              emplacementSplit1:    Yup.string(),
                                                              emplacementSplit2:    Yup.string(),
                                                              emplacementSplit3:    Yup.string(),
                                                              emplacementSplit4:    Yup.string(),
                                                              emplacementSplit5:    Yup.string(),
                                                              emplacementGrpExt:    Yup.string(),
                                                              emplacementSplitMono: Yup.string(),
                                                              distanceGpExtSplit1:  Yup.number(),
                                                              distanceGpExtSplit2:  Yup.number(),
                                                              distanceGpExtSplit3:  Yup.number(),
                                                              distanceGpExtSplit4:  Yup.number(),
                                                              distanceGpExtSplit5:  Yup.number(),
                                                              nbPompeRelevage:      Yup.number(),
                                                              positionEauChaude:    Yup.string(),
                                                              hauteurDuSol:         Yup.number(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initPacRrFormDataStep5 = ( worksheet: RrWorkSheet ) => {
    return {
        worksheet: {
            period:               worksheet.period,
            infosSup:             worksheet.infosSup,
            niveauHabitation:     worksheet.niveauHabitation,
            typeChantier:         worksheet.typeChantier,
            disjoncteur:          worksheet.disjoncteur,
            natureMurExt:         worksheet.natureMurExt,
            naturePlafond:        worksheet.naturePlafond,
            visiteComble:         worksheet.visiteComble,
            chantierHabite:       worksheet.chantierHabite,
            grandeEchelle:        worksheet.grandeEchelle,
            demandeVoirie:        worksheet.demandeVoirie,
            puissanceCompteur:    worksheet.puissanceCompteur,
            distanceCompteurPac:  worksheet.distanceCompteurPac,
            accesComble:          worksheet.accesComble,
            rueEtroite:           worksheet.rueEtroite,
            typeCouverture:       worksheet.typeCouverture,
            etatToiture:          worksheet.etatToiture,
            typeCharpente:        worksheet.typeCharpente,
            nbCompartimentComble: worksheet.nbCompartimentComble,
            presenceVolige:       worksheet.presenceVolige,
            nbAccesComble:        worksheet.nbAccesComble,
            distanceGpExtUnitInt: worksheet.distanceGpExtUnitInt,
            emplacementSplit1:    worksheet.emplacementSplit1,
            emplacementSplit2:    worksheet.emplacementSplit2,
            emplacementSplit3:    worksheet.emplacementSplit3,
            emplacementSplit4:    worksheet.emplacementSplit4,
            emplacementSplit5:    worksheet.emplacementSplit5,
            emplacementGrpExt:    worksheet.emplacementGrpExt,
            emplacementSplitMono: worksheet.emplacementSplitMono,
            distanceGpExtSplit1:  worksheet.distanceGpExtSplit1,
            distanceGpExtSplit2:  worksheet.distanceGpExtSplit2,
            distanceGpExtSplit3:  worksheet.distanceGpExtSplit3,
            distanceGpExtSplit4:  worksheet.distanceGpExtSplit4,
            distanceGpExtSplit5:  worksheet.distanceGpExtSplit5,
            nbPompeRelevage:      worksheet.nbPompeRelevage,
            positionEauChaude:    worksheet.positionEauChaude,
            hauteurDuSol:         worksheet.hauteurDuSol,
        },
    };
};

export const savePacRrWorksheet = ( data: PacRrFileStep ): RrFile => {
    let fileData = getCurrentRrFileData();

    let worksheet: RrWorkSheet = fileData.worksheet;

    worksheet = {
        ...worksheet,
        ...data.worksheet,
    };

    fileData = {
        ...fileData,
        worksheet,
    };

    updateJsonData( fileData );

    return fileData;
};
