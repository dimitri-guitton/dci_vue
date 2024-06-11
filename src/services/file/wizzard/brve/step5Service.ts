import { WorksheetBuilder } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { BrveFileStep } from '@/types/v2/Wizzard/FileStep';
import { getCurrentBrveFileData } from '@/services/data/dataService';
import { updateJsonData } from '@/services/folder/folderService';
import { BaseWorksheet } from '@/types/v2/File/Common/BaseWorksheet';
import { BrveFile } from '@/types/v2/File/Brve/BrveFile';

/**
 * Création du formualaire pour la fiche d'info
 */
export const brveWorksheetBuilder = (): WorksheetBuilder => {
    return {
        steps: [],
    };
};

export const yupBrveConfigStep5 = () => {
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
export const initBrveFormDataStep5 = ( worksheet: BaseWorksheet ) => {
    return {
        worksheet: {
            period:   worksheet.period,
            infosSup: worksheet.infosSup,
        },
    };
};

export const saveBrveWorksheet = ( data: BrveFileStep ): BrveFile => {
    let fileData = getCurrentBrveFileData();

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
