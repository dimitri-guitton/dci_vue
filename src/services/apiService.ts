import Store from 'electron-store';
import { ElMessage } from 'element-plus';
import { setCommercialInfo } from '@/services/data/dataService';

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
