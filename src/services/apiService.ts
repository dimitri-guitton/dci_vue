import Store from 'electron-store';
import { ElMessage } from 'element-plus';
import {
    getConnectedToInternet,
    getCurrentFileData,
    getLastUpdateFileState,
    resetCurrentFileData,
    setCommercialInfo,
    setcurrentFolderName,
    setLastUpdateFileState,
} from '@/services/data/dataService';
import { AllFile } from '@/types/v2/File/All';

const schema = {
    apiKey: {
        type:    'string',
        default: '',
    },
} as const;

const store = new Store( { schema } );

const API_URL: string = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : '';

const defaultHeader = () => {
    return {
        'Content-Type': 'application/json',
        'X-AUTH-TOKEN': store.get( 'apiKey' ) as string,
        mode:           'no-cors',
    };
};

/**
 * Encode un object en liste de parametres pour une URL
 * @param params
 */
const encodeParameters = ( params ): string => {
    return new URLSearchParams( params ).toString();
};

/**
 * Check que l'on est connecté à internet
 */
const checkInternet = (): boolean => {
    return getConnectedToInternet();
};

/**
 * Récupère les infos du commercial depuis son API_TOKEN
 */
export const fetchCommercialData = () => {
    if ( checkInternet() ) {
        fetch( `${ API_URL }/api/dci-settings`, {
            method:  'GET',
            headers: defaultHeader(),
        } )
            .then( response => response.json() )
            .then( response => {
                console.log( 'response -->', response );
                let phone = response.phone;
                if ( phone === null ) {
                    phone = '';
                }
                setCommercialInfo( +response.id, response.firstName, response.lastName, phone );

                ElMessage( {
                               message: 'Vos informations ont été changées avec succès',
                               type:    'success',
                           } );
            } )
            .catch( error => {
                ElMessage.error( 'Une erreur est survenue pour récupérer les informations sur l\'ERP' );
                console.error( error );
            } );
    }
};

/**
 * Récupère le status des dossiers
 */
export const fetchDossierState = () => {
    const params = {
        since: getLastUpdateFileState(),
    };
    if ( checkInternet() ) {
        fetch( `${ API_URL }/file-state?${ encodeParameters( params ) }`, {
            method:  'GET',
            headers: defaultHeader(),
        } )
            .then( response => response.json() )
            .then( response => {
                console.log( 'response -->', response );
                setLastUpdateFileState();
            } )
            .catch( error => {
                ElMessage.error( 'Une erreur est survenue lors de la synchronisation avec l\'ERP' );
                console.error( error );
            } );
    }
};

export const postFileToERP = ( folderName: string ) => {
    setcurrentFolderName( folderName );
    const fileData: AllFile = getCurrentFileData();

    if ( checkInternet() ) {
        fetch( `${ API_URL }/file`, {
            method:  'POST',
            headers: defaultHeader(),
            body:    JSON.stringify( fileData ),
        } )
            .then( response => response.json() )
            .then( response => {
                console.log( 'response -->', response );
                setLastUpdateFileState();
                resetCurrentFileData();
            } )
            .catch( error => {
                ElMessage.error( 'Une erreur est survenue lors de la transmission à l\'ERP' );
                console.error( error );
            } );
    }
};
