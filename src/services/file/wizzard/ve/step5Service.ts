import { WorksheetBuilder } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { VeFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentVeFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { VeFile } from '@/types/v2/File/Ve/VeFile';

/**
 * Création du formualaire pour la fiche d'info
 */
export const veWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [],
    };
};

export const yupVeConfigStep5 = () => {
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
export const initVeFormDataStep5 = ( worksheet: BaseWorksheet ) => {
    return {
        worksheet: {
            period:   worksheet.period,
            infosSup: worksheet.infosSup,
        },
    };
};

export const saveVeWorksheet = ( data: VeFileStep ): VeFile => {
    let fileData = getCurrentVeFileData();

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
