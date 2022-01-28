import Store from 'electron-store';
import { getFolderPath, updateJsonData } from '@/services/folder/folderService';
import fs from 'fs';
import SvairAvisImpot from '@/types/SvairAvisImpot';
import Assent from '@/types/File/Assent';
import { DataGouv } from '@/types/File/DataGouv';

const schema = {
    dropboxPath:          {
        type:    'string',
        default: '',
    },
    currentFolderName:    {
        type:    'string',
        default: '',
    },
    currentFileReference: {
        type:    'string',
        default: '',
    },
    currentFileData:      {
        type:    'string',
        default: '',
    },
} as const;

const store = new Store( { schema } );


export const getCurrentFileReference = () => {
    return store.get( 'currentFileReference' );
};

export const setCurrentFileReference = ( reference: string ) => {
    store.set( 'currentFileReference', reference );
};

export const getcurrentFolderName = () => {
    return store.get( 'currentFolderName' );
};

export const setcurrentFolderName = ( folderName: string ) => {
    store.set( 'currentFolderName', folderName );
};

// export const resetCurrentFileReference = () => {
//     store.set( 'currentFileReference', '' );
// };

export const setCurrentFileData = ( fileData: string ) => {
    console.log( '%c SET CURRENT FILE DATA', 'background: #fdd835; color: #000000' );
    store.set( 'currentFileData', fileData );
};

export const getCurrentFileData = () => {
    const currentFile = store.get( 'currentFileData' ) as string;
    if ( currentFile !== '' ) {
        console.log( '%c CURRENT FILE NOT EMPTY', 'background: #fdd835; color: #000000' );
        return JSON.parse( currentFile );
    } else {
        console.log( '%c CURRENT FILE EMPTY', 'background: #fdd835; color: #000000' );
        const name = getcurrentFolderName() as string;
        console.log( 'GET FILE DATA NAME -->', name );
        const path = `${ getFolderPath( name ) }/data.json`;
        console.log( 'GET FILE DATA PATH -->', path );
        if ( fs.existsSync( path ) ) {
            const rawdata  = fs.readFileSync( path ).toString( 'utf8' );
            const fileData = JSON.parse( rawdata );
            setCurrentFileData( JSON.stringify( fileData ) );
        }
    }
};

export const resetCurrentFileData = () => {
    store.set( 'currentFileData', '' );
};

export const addAssent = ( data: SvairAvisImpot, dataGouv: DataGouv ) => {
    let fileData = getCurrentFileData();
    console.log( 'FILE DATA', fileData );

    // TODO na pas ajouter si l'avis existe déja
    const assent: Assent = {
        refAvis:        dataGouv.refAvis,
        numFiscal:      dataGouv.numFiscal,
        isbeneficiaire: false,// TODO check à quoi ça sert, peut être update à l'étape
        datagouv:       dataGouv,
        nom:            data.declarant1.nom,
        prenom:         data.declarant1.prenoms,
        adresse:        data.foyerFiscal.adresse,
        codepostal:     '',// TODO faire la relation ville -> codePostal
        ville:          data.foyerFiscal.ville,
        revenu:         data.revenuFiscalReference,
    };

    const assents = fileData.assents;
    assents.push( assent );
    fileData = {
        ...fileData,
        assents: assents,
    };

    console.log( '%c NEW FILE DATA', 'background: #fdd835; color: #000000' );
    console.log( fileData );
    updateJsonData( fileData );
};
