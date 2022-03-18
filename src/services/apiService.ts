import Store from 'electron-store';
import { ElMessage } from 'element-plus';
import {
    getCurrentFileData,
    getLastUpdateFileState,
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

const API_URL: string   = process.env.VUE_APP_API_URL ? process.env.VUE_APP_API_URL : '';
const API_TOKEN: string = store.get( 'currentFileData' );

const defaultHeader = {
    'auth-token': API_TOKEN,
    mode:         'no-cors',
};

/**
 * Encode un object en liste de parametres pour une URL
 * @param params
 */
const encodeParameters = ( params ): string => {
    return new URLSearchParams( params ).toString();
};

/**
 * Récupère les infos du commercial depuis son API_TOKEN
 */
export const fetchCommercialData = () => {
    fetch( `${ API_URL }/commercial-info`, {
        method:  'GET',
        headers: defaultHeader,
    } )
        .then( response => response.json() )
        .then( response => {
            console.log( 'response -->', response );
            setCommercialInfo( +response.id, response.firstName, response.lastName, response.phone );
        } )
        .catch( error => {
            ElMessage.error( 'Une erreur est survenue pour récupérer les informations sur l\'ERP' );
            console.error( error );
        } );
};

/**
 * Récupère le stattus des dossiers
 */
export const fetchDossierState = () => {
    const params = {
        since: getLastUpdateFileState(),
    };
    fetch( `${ API_URL }/file-state?${ encodeParameters( params ) }`, {
        method:  'GET',
        headers: defaultHeader,
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
};

export const postFileToERP = ( folderName: string ) => {
    setcurrentFolderName( folderName );

    const fileData: AllFile = getCurrentFileData();

    fetch( `${ API_URL }/file`, {
        method:  'POST',
        headers: defaultHeader,
        body:    JSON.stringify( fileData ),
    } )
        .then( response => response.json() )
        .then( response => {
            console.log( 'response -->', response );
            setLastUpdateFileState();
        } )
        .catch( error => {
            ElMessage.error( 'Une erreur est survenue lors de la transmission à l\'ERP' );
            console.error( error );
        } );


};
