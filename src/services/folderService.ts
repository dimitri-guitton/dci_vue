import fs from 'fs';
import Store from 'electron-store';
import * as commonService from './commonService';

const schema = {
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

// Store pour stoker les users Data
const store = new Store( { schema } );

/**
 * Créé le dossier DCI si il n'exsite pas
 */
export const createDciFolderIfNotExist = () => {
    const dropboxPath = store.get( 'dropboxPath' );
    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI' ) ) {
        fs.mkdirSync( dropboxPath + '/DCI' );
    }
};

/**
 * Créer un dossier de devis avec le type et le nom du client
 * @param type
 * @param customer
 */
export const createAFolder = ( type: string, customer: string ) => {
    const dropboxPath = store.get( 'dropboxPath' );

    const today      = new Date();
    const stringDate = `${ today.getFullYear() }${ commonService.minTwoDigits( today.getMonth() + 1 ) }${ commonService.minTwoDigits(
        today.getDate() ) }${ commonService.minTwoDigits( today.getHours() ) }${ commonService.minTwoDigits( today.getMinutes() ) }`;
    const folderSlug = `ID_COM-${ stringDate }-${ type.toUpperCase() } (${ customer.toUpperCase() })`;

    if ( !fs.existsSync( dropboxPath + '/DCI/' + folderSlug ) ) {
        fs.mkdirSync( dropboxPath + '/DCI/' + folderSlug );
    }

    return folderSlug;
};
