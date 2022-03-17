import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { updateReference } from '@/services/sqliteService';

export const updateFileReferenceTechnicalVisit = ( fileData: BaseFile, technicalVisit: boolean ): BaseFile => {
    let newRef: string;

    const oldRef = fileData.ref;
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
    }

    fileData = {
        ...fileData,
        ref: newRef,
    };

    updateReference( oldRef, newRef );

    return fileData;
};
