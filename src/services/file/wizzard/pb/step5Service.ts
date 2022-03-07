import { WorksheetBuilder } from '@/types/v2/Wizzard/WorksheetBuilder';
import * as Yup from 'yup';
import { updateJsonData } from '@/services/folder/folderService';
import { PbWorkSheet } from '@/types/v2/File/Pb/PbWorkSheet';
import { PbFileStep } from '@/types/v2/Wizzard/FileStep';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { getCurrentPbFileData } from '@/services/data/dataService';
import { updateReference } from '@/services/sqliteService';

/**
 * Création du formualaire pour la fiche d'info
 */
export const pbWorksheetBuilder = (): WorksheetBuilder => {
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

export const yupPbConfigStep5 = () => {
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
export const initPbFormDataStep5 = ( worksheet: PbWorkSheet ) => {
    const data = {
        worksheet: {
            period:   worksheet.period,
            infosSup: worksheet.infosSup,
        },
    };

    return data;
};

export const savePbWorksheet = ( data: PbFileStep ): PbFile => {
    let fileData = getCurrentPbFileData();

    let worksheet: PbWorkSheet = fileData.worksheet;

    let updateFileReference = false;
    if ( worksheet.technicalVisit !== data.worksheet.technicalVisit ) {
        updateFileReference = true;
    }

    worksheet = {
        ...worksheet,
        ...data.worksheet,
    };

    fileData = {
        ...fileData,
        worksheet,
    };

    if ( updateFileReference ) {
        let newRef: string;
        const oldRef = fileData.ref;
        if ( data.worksheet.technicalVisit ) {
            // AJOUT DE VT
            newRef = `VT-${ fileData.ref }`;
        } else {
            newRef = fileData.ref.substring( 3 );
        }

        fileData = {
            ...fileData,
            ref: newRef,
        };

        updateReference( oldRef, newRef );
    }


    updateJsonData( fileData );

    return fileData;
};
