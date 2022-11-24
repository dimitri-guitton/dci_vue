import * as Yup from 'yup';
import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import { CombleWorkSheet } from '@/types/v2/File/Comble/CombleWorkSheet';
import { CombleFileStep } from '@/types/v2/Wizzard/FileStep';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { getCurrentCombleFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';


/**
 * Création du formualaire pour la fiche d'info
 */
export const combleWorksheetBuilder = (): WorksheetBuilder => {
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
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'chantierHabite',
                        label: 'Chantier habité',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeChantier',
                        label:      'Type de chantier',
                        selectList: 'chantierTypeList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'niveauHabitation',
                        label:      'Niveau habitation',
                        selectList: 'niveauHabitationList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'grandeEchelle',
                        label: 'Grande échelle nécessaire',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'partieAisoler',
                        label:      'Partie à isoler',
                        selectList: 'partieAIsolerList',

                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'puissanceCompteur',
                        label:      'Puissance du compteur',
                        selectList: 'puissanceCompteurList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'accesPl',
                        label: 'Demande de voirie / accès PL',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'rueEtroite',
                        label: 'Rue étroite / sens unique',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'accesComble',
                        label:      'Accès des combles',
                        selectList: 'accesCombleList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'couvertureType',
                        label:      'Type de couverture',
                        selectList: 'couvertureTypeList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'charpenteType',
                        label:      'Type de charpente',
                        selectList: 'charpenteTypeList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbAccesComble',
                        label: 'Nombre accès aux comble',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbCompartimentComble',
                        label: 'Nombre de compartiments',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'volige',
                        label: 'Présence de volige',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'isolationExistante',
                        label: 'Ancienne isolation',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'isolationExistanteType',
                        label:      'Type d\'isolant',
                        selectList: 'isolationExistanteTypeList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'isolationExistanteCouches',
                        label: 'Si enlèvement de l\'ancinne isolation,\nNombre de couches',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'lardagePareVapeur',
                        label: 'Lardage para vapeur',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'rehausseTrappeType',
                        label:      'Type réhausse trappe',
                        selectList: 'rehausseTrappeTypeList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'desencombrement',
                        label: 'Désencombrement des combles',
                    },
                ],
            },
        ],
    };
};

export const yupCombleConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:                    Yup.string(),
                                                              infosSup:                  Yup.string(),
                                                              visiteComble:              Yup.boolean(),
                                                              chantierHabite:            Yup.boolean(),
                                                              typeChantier:              Yup.string(),
                                                              niveauHabitation:          Yup.string(),
                                                              gdEchelle:                 Yup.boolean(),
                                                              partieAisoler:             Yup.string(),
                                                              puissanceCompteur:         Yup.number(),
                                                              accesPl:                   Yup.boolean(),
                                                              rueEtroite:                Yup.boolean(),
                                                              accesComble:               Yup.string(),
                                                              couvertureType:            Yup.string(),
                                                              charpenteType:             Yup.string(),
                                                              etatToiture:               Yup.string(),
                                                              volige:                    Yup.boolean(),
                                                              nbAccesComble:             Yup.number(),
                                                              nbCompartimentComble:      Yup.number(),
                                                              isolationExistante:        Yup.boolean(),
                                                              isolationExistanteType:    Yup.string(),
                                                              isolationExistanteCouches: Yup.number(),
                                                              lardagePareVapeur:         Yup.boolean(),
                                                              rehausseTrappeType:        Yup.string(),
                                                              desencombrement:           Yup.boolean(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initCombleFormDataStep5 = ( worksheet: CombleWorkSheet ) => {
    const data = {
        worksheet: {
            period:                    worksheet.period,
            infosSup:                  worksheet.infosSup,
            visiteComble:              worksheet.visiteComble,
            chantierHabite:            worksheet.chantierHabite,
            typeChantier:              worksheet.typeChantier,
            niveauHabitation:          worksheet.niveauHabitation,
            gdEchelle:                 worksheet.gdEchelle,
            partieAisoler:             worksheet.partieAisoler,
            puissanceCompteur:         worksheet.puissanceCompteur,
            accesPl:                   worksheet.accesPl,
            rueEtroite:                worksheet.rueEtroite,
            accesComble:               worksheet.accesComble,
            couvertureType:            worksheet.couvertureType,
            charpenteType:             worksheet.charpenteType,
            etatToiture:               worksheet.etatToiture,
            volige:                    worksheet.volige,
            nbAccesComble:             worksheet.nbAccesComble,
            nbCompartimentComble:      worksheet.nbCompartimentComble,
            isolationExistante:        worksheet.isolationExistante,
            isolationExistanteType:    worksheet.isolationExistanteType,
            isolationExistanteCouches: worksheet.isolationExistanteCouches,
            lardagePareVapeur:         worksheet.lardagePareVapeur,
            rehausseTrappeType:        worksheet.rehausseTrappeType,
            desencombrement:           worksheet.desencombrement,
        },
    };

    return data;
};

export const saveCombleWorksheet = ( data: CombleFileStep ): CombleFile => {
    let fileData = getCurrentCombleFileData();

    let worksheet: CombleWorkSheet = fileData.worksheet;

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
