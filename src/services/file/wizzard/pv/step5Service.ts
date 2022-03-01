import { WorksheetBuilder } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';
import { PvFileStep } from '@/types/v2/Wizzard/FileStep';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { getCurrentPvFileData } from '@/services/data/dataService';

/**
 * Création du formualaire pour la fiche d'info
 */
export const pvWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [
            {
                items: [],
            },
            {
                items: [],
            },
        ],
    };
};

export const yupPvConfigStep5 = () => {
    return Yup.object( {
                           worksheet: Yup.object().shape( {
                                                              period:   Yup.string(),
                                                              infosSup: Yup.string(),
                                                          } ),
                       } );
};

/**
 * Retourne les valeurs du formulaire pour l'etape 5
 * @param worksheet
 */
export const initPvFormDataStep5 = ( worksheet: PvWorkSheet ) => {
    const data = {
        worksheet: {
            period:   worksheet.period,
            infosSup: worksheet.infosSup,
        },
    };

    return data;
};

export const savePvWorksheet = ( data: PvFileStep ): PvFile => {
    let fileData = getCurrentPvFileData();

    let worksheet: PvWorkSheet = fileData.worksheet;

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
