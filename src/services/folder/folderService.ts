import fs from 'fs';
import Store from 'electron-store';
import * as commonService from '../commonService';
import { convertOldRoFolder } from '@/services/folder/convertRoData';
import { convertOldRRFolder } from '@/services/folder/convertRRData';

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


/**
 * Convertie l'ancien système de données avec le nouveau
 */
export const convertOldJsonToNewJson = () => {
    const dropboxPath          = store.get( 'dropboxPath' );
    let oldData: object | null = null;

    if ( fs.existsSync( dropboxPath + '/DCI/data.json' ) ) {
        oldData = JSON.parse( fs.readFileSync( dropboxPath + '/DCI/data.json', 'utf8' ) );
        console.log( oldData );
    }

    if ( oldData === null || oldData === undefined ) {
        return false;
    }

    let data = '';

    if ( oldData[ 'type' ].toLowerCase() === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
        data = JSON.stringify( convertOldRoFolder( oldData ) );
    } else if ( oldData[ 'type' ].toLowerCase() === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
        data = JSON.stringify( convertOldRRFolder( oldData ) );
    } else {
        console.log( '%c RETURN FALSE', 'background: #fdd835; color: #000000' );
        return false;
    }

    console.log( '%c NEW DATA', 'background: #fdd835; color: #000000' );
    console.log( data );

    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI/newData.json' ) ) {
        fs.writeFileSync( dropboxPath + '/DCI/newData.json', data );
    }
    return true;
};
