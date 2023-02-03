import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PvWorkSheet } from '@/types/v2/File/Pv/PvWorkSheet';
import { PvFileStep } from '@/types/v2/Wizzard/FileStep';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { getCurrentPvFileData } from '@/services/data/dataService';

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
    return {
        worksheet: {
            period:                     worksheet.period,
            infosSup:                   worksheet.infosSup,
            electricityPriceEvolution:  worksheet.electricityPriceEvolution,
            orientation:                worksheet.orientation,
            ratioResaleToEDF:           worksheet.ratioResaleToEDF,
            averagePricePerKWhInFrance: worksheet.averagePricePerKWhInFrance,
        },
    };
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
