import * as Yup from 'yup';
import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import { updateJsonData } from '@/services/folder/folderService';
import { SolWorkSheet } from '@/types/v2/File/Sol/SolWorkSheet';
import { SolFileStep } from '@/types/v2/Wizzard/FileStep';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { getCurrentSolFileData } from '@/services/data/dataService';
import { SolStep5 } from '@/types/v2/Wizzard/step5/SolStep5';


/**
 * Création du formualaire pour la fiche d'info
 */
export const solWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [
            {
                items: [
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'epaisseurProduit',
                        label: 'Epaisseur de l\'isolant',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'accesCamion',
                        label:      'Accessibilité camion',
                        selectList: 'accesCamionList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distCamion',
                        label: 'Distance camion <-> chantier',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distPointEau',
                        label: 'Distance camion <-> Point d\'eau',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hautPlafond',
                        label: 'Hauteur sous plafond ',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'support',
                        label:      'Support',
                        selectList: 'supportList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'resistTherm',
                        label: 'Resistance thermique',
                    },
                    // TODO DIMENSION PIECES
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'niveauHabitation',
                        label:      'Niveau habitation',
                        selectList: 'niveauHabitationList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'isolationExistante',
                        label: 'Isolation existante',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'habitationSurLocalFroid',
                        label: 'Habitation sur local non chauffé (garage/cave)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'videSanitaire',
                        label: 'Vide sanitaire',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'terrePlein',
                        label: 'Terre plein',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'reseauPlafond',
                        label: 'Réseaux au plafond ?',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'luminairesPlafond',
                        label: 'Luminaires au plafond ?',
                    },
                    // TODO DISTANCE PORTE PALFOND
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'porteGarage',
                        label:      'Porte de garage',
                        selectList: 'porteGarageList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbrPorteGarage',
                        label: 'Combien de porte(s) de Garage',
                    },
                ],
            },
        ],
    };
};

export const yupSolConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:           Yup.string(),
                                                              infosSup:         Yup.string(),
                                                              epaisseurProduit: Yup.string(),
                                                              accesCamion:      Yup.string(),
                                                              distCamion:       Yup.number(),
                                                              hautPlafond:      Yup.number(),
                                                              support:          Yup.string(),
                                                              distPointEau:     Yup.number(),
                                                              resistTherm:      Yup.string(),
                                                              // dimensionsPieces: Yup.number(,
                                                              isolationExistante:      Yup.boolean(),
                                                              niveauHabitation:        Yup.string(),
                                                              habitationSurLocalFroid: Yup.boolean(),
                                                              videSanitaire:           Yup.boolean(),
                                                              terrePlein:              Yup.boolean(),
                                                              reseauPlafond:           Yup.boolean(),
                                                              luminairesPlafond:       Yup.boolean(),
                                                              // distancePortesPalfond: Yup.number(,
                                                              porteGarage:    Yup.string(),
                                                              nbrPorteGarage: Yup.number(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initSolFormDataStep5 = ( worksheet: SolWorkSheet ) => {
    const data: SolStep5 = {
        worksheet: {
            period:           worksheet.period,
            infosSup:         worksheet.infosSup,
            epaisseurProduit: worksheet.epaisseurProduit,
            accesCamion:      worksheet.accesCamion,
            distCamion:       worksheet.distCamion,
            hautPlafond:      worksheet.hautPlafond,
            support:          worksheet.support,
            distPointEau:     worksheet.distPointEau,
            resistTherm:      worksheet.resistTherm,
            // dimensionsPieces:        worksheet.dimensionsPieces,
            dimensionsPieces:        [],
            isolationExistante:      worksheet.isolationExistante,
            niveauHabitation:        worksheet.niveauHabitation,
            habitationSurLocalFroid: worksheet.habitationSurLocalFroid,
            videSanitaire:           worksheet.videSanitaire,
            terrePlein:              worksheet.terrePlein,
            reseauPlafond:           worksheet.reseauPlafond,
            luminairesPlafond:       worksheet.luminairesPlafond,
            // distancePortesPalfond:   worksheet.distancePortesPalfond,
            distancePortesPalfond: [],
            porteGarage:           worksheet.porteGarage,
            nbrPorteGarage:        worksheet.nbrPorteGarage,
        },
    };

    return data;
};

export const saveSolWorksheet = ( data: SolFileStep ): SolFile => {
    let fileData = getCurrentSolFileData();

    let worksheet: SolWorkSheet = fileData.worksheet;

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
