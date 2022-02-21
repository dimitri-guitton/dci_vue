import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { CetWorkSheet } from '@/types/v2/File/Cet/CetWorkSheet';
import { CetFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentCetFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { CetFile } from '@/types/v2/File/Cet/CetFile';

/**
 * Création du formualaire pour la fiche d'info
 */
export const cetWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [
            {
                items: [
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'aspirationType',
                        label:      'Type d\'installation',
                        selectList: 'aspirationTypeList',
                        required:   true,
                    },
                ],
            },
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
                        name:  'nbrCompartementComble',
                        label: 'Nombre de compartiment des combles',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbrAccesComble',
                        label: 'Nombre d\'accès aux combles',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceCompteurCet',
                        label: 'Distance entre le compteur électrique et le chauffe-eau',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeCouverture',
                        label:      'Type de couverture',
                        selectList: 'typeCouvertureList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'demandeVoirie',
                        label: 'Demande de voirie / accès PL',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeCharpente',
                        label:      'Type de charpente',
                        selectList: 'typeCharpenteList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'rueEtroite',
                        label: 'Rue étroite / sens unique',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'etatToiture',
                        label:      'État de la toiture',
                        selectList: 'etatToitureList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'presenceVolige',
                        label: 'Présence volige',
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
                        label:      'Nature de plafond',
                        selectList: 'naturePlafondList',
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
                        type:  WorksheetBuilderItemType.Text,
                        name:  'emplacementCetExistante',
                        label: 'Emplacement du chauffe-eau (ou de la chaudière) existante',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'emplacementCetNew',
                        label: 'Emplacement du chauffe-eau thermodynamique',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceBallonUnitExt',
                        label: 'Distance entre le ballon et l’unité exterieur',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'ballonFixeMur',
                        label: 'Ballon fixé au mur (uniquement sur mur solide exemple : parpaing, béton, brique)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'uniteExtFixeMur',
                        label: 'Unité exterieur fixée au mur',
                    },

                ],
            },
        ],
    };
};

export const yupCetConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:                  Yup.string(),
                                                              infosSup:                Yup.string(),
                                                              niveauHabitation:        Yup.string(),
                                                              typeChantier:            Yup.string(),
                                                              disjoncteur:             Yup.boolean(),
                                                              tensionDisponible:       Yup.string(),
                                                              distanceCompteurCet:     Yup.number(),
                                                              natureMurExt:            Yup.string(),
                                                              naturePlafond:           Yup.string(),
                                                              visiteComble:            Yup.boolean(),
                                                              chantierHabite:          Yup.boolean(),
                                                              grandeEchelle:           Yup.boolean(),
                                                              demandeVoirie:           Yup.boolean(),
                                                              puissanceCompteur:       Yup.number(),
                                                              accesComble:             Yup.string(),
                                                              rueEtroite:              Yup.boolean(),
                                                              typeCouverture:          Yup.string(),
                                                              etatToiture:             Yup.string(),
                                                              typeCharpente:           Yup.string(),
                                                              nbCompartimentComble:    Yup.number(),
                                                              presenceVolige:          Yup.boolean(),
                                                              nbAccesComble:           Yup.number(),
                                                              nbrCompartementComble:   Yup.number(),
                                                              nbrAccesComble:          Yup.number(),
                                                              typeRadiateur:           Yup.string(),
                                                              emplacementCetExistante: Yup.string(),
                                                              emplacementCetNew:       Yup.string(),
                                                              aspirationType:          Yup.string(),
                                                              ballonFixeMur:           Yup.boolean(),
                                                              uniteExtFixeMur:         Yup.boolean(),
                                                              distanceBallonUnitExt:   Yup.number(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initCetFormDataStep5 = ( worksheet: CetWorkSheet ) => {
    console.log( 'ww', worksheet );
    const data = {
        worksheet: {
            period:                  worksheet.period,
            infosSup:                worksheet.infosSup,
            niveauHabitation:        worksheet.niveauHabitation,
            typeChantier:            worksheet.typeChantier,
            disjoncteur:             worksheet.disjoncteur,
            tensionDisponible:       worksheet.tensionDisponible,
            distanceCompteurCet:     worksheet.distanceCompteurCet,
            natureMurExt:            worksheet.natureMurExt,
            naturePlafond:           worksheet.naturePlafond,
            visiteComble:            worksheet.visiteComble,
            chantierHabite:          worksheet.chantierHabite,
            grandeEchelle:           worksheet.grandeEchelle,
            demandeVoirie:           worksheet.demandeVoirie,
            puissanceCompteur:       worksheet.puissanceCompteur,
            accesComble:             worksheet.accesComble,
            rueEtroite:              worksheet.rueEtroite,
            typeCouverture:          worksheet.typeCouverture,
            etatToiture:             worksheet.etatToiture,
            typeCharpente:           worksheet.typeCharpente,
            nbCompartimentComble:    worksheet.nbCompartimentComble,
            presenceVolige:          worksheet.presenceVolige,
            nbAccesComble:           worksheet.nbAccesComble,
            emplacementCetExistante: worksheet.emplacementCetExistante,
            emplacementCetNew:       worksheet.emplacementCetNew,
            aspirationType:          worksheet.aspirationType,
            ballonFixeMur:           worksheet.ballonFixeMur,
            uniteExtFixeMur:         worksheet.uniteExtFixeMur,
            distanceBallonUnitExt:   worksheet.distanceBallonUnitExt,
        },
    };

    console.log( '%c DATA', 'background: #fdd835; color: #000000' );
    console.log( data );

    return data;
};

export const saveCetWorksheet = ( data: CetFileStep ): CetFile => {
    let fileData = getCurrentCetFileData();

    let worksheet: CetWorkSheet = fileData.worksheet;

    console.log( '%c WORKSHEET BEFORE', 'background: #7950FF; color: #000000' );
    console.log( worksheet );
    worksheet = {
        ...worksheet,
        ...data.worksheet,
    };
    console.log( '%c WORKSHEET AFTER', 'background: #7950FF; color: #000000' );
    console.log( worksheet );
    fileData = {
        ...fileData,
        worksheet,
    };

    updateJsonData( fileData );

    return fileData;
};
