import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { RoWorkSheet } from '@/types/v2/File/Ro/RoWorkSheet';
import { PacRoFileStep } from '@/types/v2/Wizzard/FileStep';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { getCurrentRoFileData } from '@/services/data/dataService';

/**
 * Création du formualaire pour la fiche d'info
 */
export const pacRoWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [
            {
                items: [
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
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'espaceSolRequisUnitInt',
                        label: 'Espace au sol requis pour unité intérieur 700*700mm (595*600mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'hauteurRequiseUnitInt',
                        label: 'Hauteur requise pour l’unité intérieur 2200 mm (1850mm)',
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
                        name:  'distanceGpExtUnitInt',
                        label: 'Distance du groupe extérieur / unité intérieur',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbTotalRadiateur',
                        label: 'Nombre total de radiateur',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbRadiateurThermostatique',
                        label: 'Nombre de radiateur équipés de poignées thermostatique',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeRadiateur',
                        label:      'Type de radiateur',
                        selectList: 'typeRadiateurList',
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
                        label: 'À quelle hauteur du sol',
                    },
                ],
            },
        ],
    };
};

export const yupPacRoConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:                    Yup.string(),
                                                              infosSup:                  Yup.string(),
                                                              niveauHabitation:          Yup.string(),
                                                              typeChantier:              Yup.string(),
                                                              disjoncteur:               Yup.boolean(),
                                                              natureMurExt:              Yup.string(),
                                                              naturePlafond:             Yup.string(),
                                                              visiteComble:              Yup.boolean(),
                                                              chantierHabite:            Yup.boolean(),
                                                              grandeEchelle:             Yup.boolean(),
                                                              demandeVoirie:             Yup.boolean(),
                                                              puissanceCompteur:         Yup.number(),
                                                              distanceCompteurPac:       Yup.number(),
                                                              accesComble:               Yup.string(),
                                                              rueEtroite:                Yup.boolean(),
                                                              typeCouverture:            Yup.string(),
                                                              etatToiture:               Yup.string(),
                                                              typeCharpente:             Yup.string(),
                                                              nbCompartimentComble:      Yup.number(),
                                                              presenceVolige:            Yup.boolean(),
                                                              nbAccesComble:             Yup.number(),
                                                              distanceGpExtUnitInt:      Yup.number(),
                                                              nbTotalRadiateur:          Yup.number(),
                                                              nbRadiateurThermostatique: Yup.number(),
                                                              typeRadiateur:             Yup.string(),
                                                              espaceSolRequisUnitInt:    Yup.boolean(),
                                                              hauteurRequiseUnitInt:     Yup.boolean(),
                                                              positionEauChaude:         Yup.string(),
                                                              hauteurDuSol:              Yup.number(),
                                                              tensionDisponible:         Yup.string(),  // NEW
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initPacRoFormDataStep5 = ( worksheet: RoWorkSheet ) => {
    const data = {
        worksheet: {
            period:                    worksheet.period,
            infosSup:                  worksheet.infosSup,
            niveauHabitation:          worksheet.niveauHabitation,
            typeChantier:              worksheet.typeChantier,
            disjoncteur:               worksheet.disjoncteur,
            natureMurExt:              worksheet.natureMurExt,
            naturePlafond:             worksheet.naturePlafond,
            visiteComble:              worksheet.visiteComble,
            chantierHabite:            worksheet.chantierHabite,
            grandeEchelle:             worksheet.grandeEchelle,
            demandeVoirie:             worksheet.demandeVoirie,
            puissanceCompteur:         worksheet.puissanceCompteur,
            distanceCompteurPac:       worksheet.distanceCompteurPac,
            accesComble:               worksheet.accesComble,
            rueEtroite:                worksheet.rueEtroite,
            typeCouverture:            worksheet.typeCouverture,
            etatToiture:               worksheet.etatToiture,
            typeCharpente:             worksheet.typeCharpente,
            nbCompartimentComble:      worksheet.nbCompartimentComble,
            presenceVolige:            worksheet.presenceVolige,
            nbAccesComble:             worksheet.nbAccesComble,
            distanceGpExtUnitInt:      worksheet.distanceGpExtUnitInt,
            nbTotalRadiateur:          worksheet.nbTotalRadiateur,
            nbRadiateurThermostatique: worksheet.nbRadiateurThermostatique,
            typeRadiateur:             worksheet.typeRadiateur,
            espaceSolRequisUnitInt:    worksheet.espaceSolRequisUnitInt,
            hauteurRequiseUnitInt:     worksheet.hauteurRequiseUnitInt,
            positionEauChaude:         worksheet.positionEauChaude,
            hauteurDuSol:              worksheet.hauteurDuSol,
            tensionDisponible:         worksheet.tensionDisponible,
        },
    };

    return data;
};

export const savePacRoWorksheet = ( data: PacRoFileStep ): RoFile => {
    let fileData = getCurrentRoFileData();

    let worksheet: RoWorkSheet = fileData.worksheet;


    // let updateFileReference = false;
    // if ( worksheet.technicalVisit !== data.worksheet.technicalVisit ) {
    //     updateFileReference = true;
    // }

    worksheet = {
        ...worksheet,
        ...data.worksheet,
    };

    fileData = {
        ...fileData,
        worksheet,
    };

    // if ( updateFileReference ) {
    //     updateFileReferenceTechnicalVisit( fileData, data.worksheet.technicalVisit === true );
    // }

    updateJsonData( fileData );

    return fileData;
};
