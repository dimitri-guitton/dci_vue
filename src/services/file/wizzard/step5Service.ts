import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { updateReference } from '@/services/sqliteService';

export const updateFileReferenceTechnicalVisit = ( fileData: BaseFile, technicalVisit: boolean ): BaseFile => {
    let newRef: string;

    const oldRef        = fileData.ref;
    const oldFolderName = fileData.folderName;
    let newFolderName   = oldFolderName;

    if ( technicalVisit ) {
        // AJOUT DE VT
        newRef = `VT-${ fileData.ref }`;
    } else {
        // Update que si contient VT-
        if ( oldRef.includes( 'VT-' ) ) {
            newRef = fileData.ref.substring( 3 );
        } else {
            newRef = oldRef;
        }

        // Le folderName ne dois jamais changer
        // FIX car certain folderName avait changé
        if ( oldFolderName.includes( 'VT-' ) ) {
            newFolderName = fileData.ref.substring( 3 );
        } else {
            newFolderName = oldFolderName;
        }
    }

    fileData = {
        ...fileData,
        ref:        newRef,
        folderName: newFolderName,
    };

    updateReference( oldRef, newRef );

    return fileData;
};
