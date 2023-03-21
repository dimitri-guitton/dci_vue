import { WorksheetBuilder, WorksheetBuilderItemType } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PbWorkSheet } from '@/types/v2/File/Pb/PbWorkSheet';
import { PbFileStep } from '@/types/v2/Wizzard/FileStep';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { getCurrentPbFileData } from '@/services/data/dataService';

/**
 * Création du formualaire pour la fiche d'info
 */
export const pbWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [
            {
                items: [
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'zoneInstallation',
                        label:      'Zone d\'instalation',
                        selectList: 'zoneInstallationList',
                    },

                    // TODO Logique quand ou ou non checké
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'creation',
                        label: 'Le chantier est une création complète',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'typeChantier',
                        label:      'Type de chantier',
                        selectList: 'typeChantierList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'niveauHabitation',
                        label:      'Niveau habitation',
                        selectList: 'niveauHabitationList',
                    },
                ],
            },
            {
                items: [
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'generateur',
                        label:      'Générateur',
                        selectList: 'generateurList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'puissance',
                        label: 'Puissance',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'marque',
                        label: 'Marque',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'modele',
                        label: 'Modèle',
                    },

                    // TODO SI CRÉATION
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'conduiteMateriau',
                        label: 'Materiau',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'conduiteDiametre',
                        label: 'Diamètre (mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'longueurTotal',
                        label: 'Longueur total (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'longeurProjection',
                        label: 'Longueur projection horizontal',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbCoude90',
                        label: 'Nombre de coude à 90°',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'nbCoude45',
                        label: 'Nombre de coude à 45°',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'reductionSection',
                        label: 'Réduction de section',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'etat',
                        label: 'Le conduit est-il en bon état et bien fixé',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'demontable',
                        label: 'Le conduit est-il démontable',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceSecurite',
                        label: 'Distance de sécurité par rapport à des matériaux combustibles (mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'conduitMateriauConstitutif',
                        label: 'Matériaux constitutifs',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'demplaqueSignaletiqueontable',
                        label: 'Présence d\'une plaque signalétique de conduit',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'classeTemperature',
                        label: 'Classe température (ex T 450°)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'classePression',
                        label: 'Classe de pression (N)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'resistanceCorrosion',
                        label: 'Résistance à la corrosion',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'resistanceCondansat',
                        label:      'Résistance aux condensats',
                        selectList: 'resistanceList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'presenceTrappe',
                        label: 'Présence d\'un trappe de ramonage',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'resistanceFeu',
                        label: ' Résistance aux feu de cheminée (G)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceSecuriteCombustible',
                        label: 'Distance de sécurité par rapport aux matériaux combustibles (mm)',
                    },

                    // FIN DE CRÉATION

                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hauteurTotal',
                        label: 'Hauteur total (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hauteurLocauxChauffe',
                        label: 'Hauteur dans locaux chauffés (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hauteurLocauxNonChauffe',
                        label: 'Hauteur dans locaux non chauffés (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'hauteurExterieur',
                        label: 'Hauteur extérieure (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'sectionConduitLargeur',
                        label: 'Section conduit largeur (mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'sectionConduitLongeur',
                        label: 'Section conduit longeur (mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'sectionConduitDiametre',
                        label: 'Section conduit diametre (mm)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'devoiement',
                        label: 'Y\'a-t-il des dévoiements',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'distanceDevoiement',
                        label: 'Distance entre les 2 dévoiement (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'conduitIsole',
                        label: 'Le conduit est-il isolé',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'deboucheSup40',
                        label: 'Le débouché dépasse t\'il d\'au moins 40cm au dessus du fraîtage',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'obstacleInf8',
                        label: 'Présende d\'un obstacle à moins de 8m',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'deboucheAccessible',
                        label: 'Le débouché est-il accessible',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'resistanceCondansat',
                        label:      'Type de débouché',
                        selectList: 'resistanceList',
                    },
                    {
                        type:       WorksheetBuilderItemType.Select,
                        name:       'toiture',
                        label:      'Toiture',
                        selectList: 'resistanceList',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'pieceLogement',
                        label: 'Dans quel pièce du logement',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'pieceLongueur',
                        label: 'Longeur (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'pieceLargeur',
                        label: 'Largeur (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'pieceHauteur',
                        label: 'Hauteur (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'pieceSurface',
                        label: 'Surface (m2)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'accesPorteLargeur',
                        label: 'Accès (portes) largeur (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'accesPorteHauteur',
                        label: 'Accès (portes) hauteur (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'escalier',
                        label: 'Y\'a t-il un escalier',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'escalierLargeur',
                        label: 'Largeur de l\'escalier (m)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'natureMur',
                        label: ' Nature des murs',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'natureSol',
                        label: 'Nature des sols',
                    },
                    {
                        type:  WorksheetBuilderItemType.Text,
                        name:  'naturePlafond',
                        label: 'Nature du plafond',
                    },
                    {
                        type:  WorksheetBuilderItemType.Number,
                        name:  'priseElec',
                        label: 'Prise électrique (ml)',
                    },
                    {
                        type:  WorksheetBuilderItemType.Checkbox,
                        name:  'ameneeAir',
                        label: 'Y\'a-t-il une amenée d\'air dans la piece de l\'appereil',
                    },
                ],
            },
        ],
    };
};

export const yupPbConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:                      Yup.string(),
                                                              infosSup:                    Yup.string(),
                                                              generateur:                  Yup.string(),
                                                              marque:                      Yup.string(),
                                                              modele:                      Yup.string(),
                                                              puissance:                   Yup.string(),
                                                              conduiteMateriau:            Yup.string(),
                                                              conduiteDiametre:            Yup.string(),
                                                              longueurTotal:               Yup.string(),
                                                              longeurProjection:           Yup.string(),
                                                              nbCoude90:                   Yup.string(),
                                                              nbCoude45:                   Yup.string(),
                                                              reductionSection:            Yup.boolean(),
                                                              etat:                        Yup.boolean(),
                                                              demontable:                  Yup.boolean(),
                                                              distanceSecurite:            Yup.string(),
                                                              conduitType:                 Yup.string(),
                                                              conduitMateriauConstitutif:  Yup.string(),
                                                              plaqueSignaletique:          Yup.boolean(),
                                                              classeTemperature:           Yup.string(),
                                                              classePression:              Yup.string(),
                                                              resistanceCondansat:         Yup.string(),
                                                              resistanceCorrosion:         Yup.boolean(),
                                                              resistanceFeu:               Yup.string(),
                                                              distanceSecuriteCombustible: Yup.string(),
                                                              presenceTrappe:              Yup.boolean(),
                                                              hauteurTotal:                Yup.string(),
                                                              hauteurLocauxChauffe:        Yup.string(),
                                                              hauteurLocauxNonChauffe:     Yup.string(),
                                                              hauteurExterieur:            Yup.string(),
                                                              devoiement:                  Yup.boolean(),
                                                              distanceDevoiement:          Yup.string(),
                                                              conduitIsole:                Yup.boolean(),
                                                              sectionConduitLargeur:       Yup.string(),
                                                              sectionConduitLongeur:       Yup.string(),
                                                              sectionConduitDiametre:      Yup.string(),
                                                              deboucheSup40:               Yup.string(),
                                                              obstacleInf8:                Yup.boolean(),
                                                              deboucheAccessible:          Yup.boolean(),
                                                              typeDebouche:                Yup.string(),
                                                              toiture:                     Yup.string(),
                                                              pieceLogement:               Yup.string(),
                                                              pieceLongueur:               Yup.string(),
                                                              pieceLargeur:                Yup.string(),
                                                              pieceHauteur:                Yup.string(),
                                                              pieceSurface:                Yup.string(),
                                                              accesPorteLargeur:           Yup.string(),
                                                              accesPorteHauteur:           Yup.string(),
                                                              natureMur:                   Yup.string(),
                                                              natureSol:                   Yup.string(),
                                                              naturePlafond:               Yup.string(),
                                                              ameneeAir:                   Yup.boolean(),
                                                              priseElec:                   Yup.string(),
                                                              niveauHabitation:            Yup.string(),
                                                              typeChantier:                Yup.string(),
                                                              escalier:                    Yup.boolean(),
                                                              escalierLargeur:             Yup.string(),
                                                              zoneInstallation:            Yup.string(),
                                                              creation:                    Yup.boolean(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initPbFormDataStep5 = ( worksheet: PbWorkSheet ) => {
    return {
        worksheet: {
            period:                      worksheet.period,
            infosSup:                    worksheet.infosSup,
            generateur:                  worksheet.generateur,
            marque:                      worksheet.marque,
            modele:                      worksheet.modele,
            puissance:                   worksheet.puissance,
            conduiteMateriau:            worksheet.conduiteMateriau,
            conduiteDiametre:            worksheet.conduiteDiametre,
            longueurTotal:               worksheet.longueurTotal,
            longeurProjection:           worksheet.longeurProjection,
            nbCoude90:                   worksheet.nbCoude90,
            nbCoude45:                   worksheet.nbCoude45,
            reductionSection:            worksheet.reductionSection,
            etat:                        worksheet.etat,
            demontable:                  worksheet.demontable,
            distanceSecurite:            worksheet.distanceSecurite,
            conduitType:                 worksheet.conduitType,
            conduitMateriauConstitutif:  worksheet.conduitMateriauConstitutif,
            plaqueSignaletique:          worksheet.plaqueSignaletique,
            classeTemperature:           worksheet.classeTemperature,
            classePression:              worksheet.classePression,
            resistanceCondansat:         worksheet.resistanceCondansat,
            resistanceCorrosion:         worksheet.resistanceCorrosion,
            resistanceFeu:               worksheet.resistanceFeu,
            distanceSecuriteCombustible: worksheet.distanceSecuriteCombustible,
            presenceTrappe:              worksheet.presenceTrappe,
            hauteurTotal:                worksheet.hauteurTotal,
            hauteurLocauxChauffe:        worksheet.hauteurLocauxChauffe,
            hauteurLocauxNonChauffe:     worksheet.hauteurLocauxNonChauffe,
            hauteurExterieur:            worksheet.hauteurExterieur,
            devoiement:                  worksheet.devoiement,
            distanceDevoiement:          worksheet.distanceDevoiement,
            conduitIsole:                worksheet.conduitIsole,
            sectionConduitLargeur:       worksheet.sectionConduitLargeur,
            sectionConduitLongeur:       worksheet.sectionConduitLongeur,
            sectionConduitDiametre:      worksheet.sectionConduitDiametre,
            deboucheSup40:               worksheet.deboucheSup40,
            obstacleInf8:                worksheet.obstacleInf8,
            deboucheAccessible:          worksheet.deboucheAccessible,
            typeDebouche:                worksheet.typeDebouche,
            toiture:                     worksheet.toiture,
            pieceLogement:               worksheet.pieceLogement,
            pieceLongueur:               worksheet.pieceLongueur,
            pieceLargeur:                worksheet.pieceLargeur,
            pieceHauteur:                worksheet.pieceHauteur,
            pieceSurface:                worksheet.pieceSurface,
            accesPorteLargeur:           worksheet.accesPorteLargeur,
            accesPorteHauteur:           worksheet.accesPorteHauteur,
            natureMur:                   worksheet.natureMur,
            natureSol:                   worksheet.natureSol,
            naturePlafond:               worksheet.naturePlafond,
            ameneeAir:                   worksheet.ameneeAir,
            priseElec:                   worksheet.priseElec,
            niveauHabitation:            worksheet.niveauHabitation,
            typeChantier:                worksheet.typeChantier,
            escalier:                    worksheet.escalier,
            escalierLargeur:             worksheet.escalierLargeur,
            zoneInstallation:            worksheet.zoneInstallation,
            creation:                    worksheet.creation,
        },
    };
};

export const savePbWorksheet = ( data: PbFileStep ): PbFile => {
    let fileData = getCurrentPbFileData();

    let worksheet: PbWorkSheet = fileData.worksheet;

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
