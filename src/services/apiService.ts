import Store from 'electron-store';
import { ElMessage } from 'element-plus';
import {
    getConnectedToInternet,
    getCurrentFileData,
    getLastUpdateFileState,
    resetCurrentFileData,
    setApiTokenIsValid,
    setCommercialInfo,
    setcurrentFolderName,
    setLastUpdateFileState,
} from '@/services/data/dataService';
import { AllFile } from '@/types/v2/File/All';
import { addTodo, addTodoToFile, closeFile, getTodoByFile, sendAt, setStatusFile } from '@/services/sqliteService';
import { FILE_COMPLETE_STATUS, FILE_TO_CORRECT_STATUS } from '@/services/constantService';

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
        'Content-Type':  'application/json',
        'X-AUTH-TOKEN':  store.get( 'apiKey' ) as string,
        mode:            'no-cors',
        'cache-control': 'no-cache',
        pragma:          'no-cache',
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
                let phone = response.phone;
                if ( phone === null ) {
                    phone = '';
                }
                setCommercialInfo( +response.id, response.firstName, response.lastName, phone );
                setApiTokenIsValid( true );
                ElMessage( {
                               message: 'Vos informations ont été changées avec succès',
                               type:    'success',
                           } );
            } )
            .catch( error => {
                ElMessage.error( 'Une erreur est survenue pour récupérer les informations sur l\'ERP' );
                setApiTokenIsValid( false );
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
        fetch( `${ API_URL }/api/dossiers/update?${ encodeParameters( params ) }`, {
            method:  'GET',
            headers: defaultHeader(),
        } )
            .then( response => response.json() )
            .then( response => {
                const files = response.files;

                for ( const file of files ) {
                    closeFile( file.ref, file.isClosed );


                    if ( file.todos.length > 0 ) {
                        const allTodoId: number[] = [];
                        for ( const todo of file.todos ) {
                            addTodo( todo.id, todo.label, false, new Date(), null );
                            allTodoId.push( todo.id );
                        }

                        addTodoToFile( allTodoId, file.ref );
                    }
                }
                // setLastUpdateFileState( 1648721875 );
                setLastUpdateFileState( response.date );
            } )
            .catch( error => {
                ElMessage.error( 'Une erreur est survenue lors de la synchronisation avec l\'ERP' );
                console.error( error );
            } );
    }
};

export const postFileToERP = async ( folderName: string ) => {
    setcurrentFolderName( folderName );
    const fileData: AllFile = getCurrentFileData();

    const todos = await getTodoByFile( fileData.ref );

    if ( checkInternet() ) {
        const response = await fetch( `${ API_URL }/api/dossier`, {
            method:  'POST',
            headers: defaultHeader(),
            body:    JSON.stringify( { ...fileData, todos } ),
        } );

        if ( !response.ok ) {
            ElMessage.error( 'Une erreur est survenue lors de la transmission à l\'ERP' );
            console.error( response );
        }

        const json = await response.json();

        ElMessage( {
                       message: 'Dossier transféré avec succès',
                       type:    'success',
                   } );

        if ( json.allTodosAreDone ) {
            await setStatusFile( fileData.ref, FILE_COMPLETE_STATUS.code );
        } else {
            await setStatusFile( fileData.ref, FILE_TO_CORRECT_STATUS.code );
        }
        await sendAt( fileData.ref, new Date() );
        resetCurrentFileData();
    }
};
