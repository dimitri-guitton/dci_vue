import { WorksheetBuilder } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { CpvFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentCpvFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { CpvFile } from '@/types/v2/File/Cpv/CpvFile';

/**
 * Création du formualaire pour la fiche d'info
 */
export const cpvWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [],
    };
};

export const yupCpvConfigStep5 = () => {
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
export const initCpvFormDataStep5 = ( worksheet: BaseWorksheet ) => {
    return {
        worksheet: {
            period:   worksheet.period,
            infosSup: worksheet.infosSup,
        },
    };
};

export const saveCpvWorksheet = ( data: CpvFileStep ): CpvFile => {
    let fileData = getCurrentCpvFileData();

    let worksheet: BaseWorksheet = fileData.worksheet;

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
