import fs from 'fs';
import Store from 'electron-store';
import * as commonService from '../commonService';
import { toFrenchDate } from '../commonService';
import { convertOldRoFile } from '@/services/file/convertRoData';
import { convertOldRrFile } from '@/services/file/convertRRData';
import { convertOldCeFile } from '@/services/file/convertCeData';
import FolderItem from '@/types/Folder/FolderItem';
import path from 'path';
import { addFile, deleteFile } from '@/services/sqliteService';
import { FOLDER_CET_TYPE } from '@/services/constantService';
import CeFile from '@/types/File/Ce/CeFile';

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

const FoldersNames = {
    AVIS_FOLDER:                        'avis',
    MAP_FOLDER:                         'carte',
    DEVIS_FOLDER:                       'devis',
    DEVIS_SIGNE_FOLDER:                 'devis_signe',
    FICHE_FOLDER:                       'fiche',
    FICHE_SIGNE_FOLDER:                 'fiche_signe',
    ATTEST_ADRESSE_SIGNE_FOLDER:        'attest_adresse_signe',
    PHOTOS_FACADE_FOLDER:               'photos_facade',
    PHOTOS_MAISON_FOLDER:               'photos_maison',
    PHOTOS_CHANTIER_FOLDER:             'photos_chantier',
    ATTESTATION_HONNEUR_FOLDER:         'attestation_sur_honneur',
    MANDAT_MA_PRIME_RENOV:              'mandat_maprimerenov',
    PHOTOS_TABLEAU_ELECTRIQUE:          'photos_tableau_electrique',
    PHOTOS_ANCIENNE_CHAUDIERE:          'photos_ancienne_chaudiere',
    PHOTOS_RADIATEUR:                   'photos_radiateur',
    PHOTOS_EMPLACEMENT_UNITE_EXT:       'photos_emplacement_unite_ext',
    PHOTOS_EMPLACEMENT_SPLITS:          'photos_emplacement_splits',
    ATTEST_TVA_SIMPLIFIEE_FOLDER:       'attest_tva_simp',
    ATTEST_TVA_SIMPLIFIEE_SIGNE_FOLDER: 'attest_tva_simp_signe',
    CADRE_CONTRIBUTION_CEE:             'cadre_contribution_cee',
    PHOTO_EMPLACEMENT_POELE:            'photo_emplacement_poele',
    PHOTO_COMBLE_EMPLACEMENT_TUYAUX:    'photo_comble_emplacement_tuyaux',
    PHOTO_TOITURE:                      'photo_toiture_et_tuile',
};

const Folders = [
    { name: FoldersNames.AVIS_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.MAP_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.ATTEST_ADRESSE_SIGNE_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.PHOTOS_FACADE_FOLDER, dossierType: [ 'sol', 'comble', 'poele' ] },
    { name: FoldersNames.PHOTOS_MAISON_FOLDER, dossierType: [ 'sol', 'comble' ] },
    { name: FoldersNames.PHOTOS_CHANTIER_FOLDER, dossierType: [ 'sol' ] },
    { name: FoldersNames.ATTESTATION_HONNEUR_FOLDER, dossierType: [ 'all' ] },
    { name: FoldersNames.PHOTOS_TABLEAU_ELECTRIQUE, dossierType: [ 'pac_rr', 'pac_ro', 'poele' ] },
    { name: FoldersNames.MANDAT_MA_PRIME_RENOV, dossierType: [ 'pac_ro', 'cet', 'poele' ] },
    { name: FoldersNames.PHOTOS_ANCIENNE_CHAUDIERE, dossierType: [ 'pac_ro' ] },
    { name: FoldersNames.PHOTOS_RADIATEUR, dossierType: [ 'pac_ro' ] },
    { name: FoldersNames.PHOTOS_EMPLACEMENT_UNITE_EXT, dossierType: [ 'pac_rr', 'pac_ro' ] },
    { name: FoldersNames.PHOTOS_EMPLACEMENT_SPLITS, dossierType: [ 'pac_rr' ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE_FOLDER, dossierType: [ 'pac_rr', 'pac_ro', 'cet', 'poele' ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE_SIGNE_FOLDER, dossierType: [ 'pac_rr', 'pac_ro', 'cet', 'poele' ] },
    { name: FoldersNames.CADRE_CONTRIBUTION_CEE, dossierType: [ 'pac_rr', 'pac_ro' ] },
    { name: FoldersNames.PHOTO_EMPLACEMENT_POELE, dossierType: [ 'poele' ] },
    { name: FoldersNames.PHOTO_COMBLE_EMPLACEMENT_TUYAUX, dossierType: [ 'poele' ] },
    { name: FoldersNames.PHOTO_TOITURE, dossierType: [ 'poele' ] },
];

/**
 * Créer les sous dossier dans un dossier principale
 * @param type
 * @param parent
 */
const createSubFolders = ( type: string, parent: string ) => {
    const subFolders = Folders.filter( folder => {
        if ( folder.dossierType !== undefined ) {
            return folder.dossierType.filter( t => t === 'all' || t === type ).length > 0;
        }
        return false;
    } );

    subFolders.forEach( subFolder => {
        const newFolder = path.resolve( parent, subFolder.name );
        if ( !fs.existsSync( newFolder ) ) {
            fs.mkdirSync( newFolder );
        }
    } );
};

const addJsonData = ( type: string, parent: string, reference: string, folderName: string ) => {
    if ( type === FOLDER_CET_TYPE.slug ) {
        const jsonPath = '/Users/dimitri/workspace/eco_atlantique/dci_vue/data_example/emptyNewDataCet.json';

        const rawdata        = fs.readFileSync( jsonPath ).toString( 'utf8' );
        let fileData: CeFile = JSON.parse( rawdata );
        fileData             = {
            ...fileData,
            ref:               reference,
            folderName:        folderName,
            createdAt:         toFrenchDate( new Date().toString() ),
            updatedAt:         toFrenchDate( new Date().toString() ),
            statusInDci:       2,
            errorsStatusInDci: [],
            quotation:         {
                ...fileData.quotation,
                totalHt:  0,
                totalTva: 0,
            },
        };

        console.log( `${ parent }/data.json` );
        console.log( fileData );
        fs.writeFileSync( `${ parent }/data.json`, JSON.stringify( fileData ) );
    }
};

export const createFolderRef = ( type: string ): string => {
    const today      = new Date();
    const stringDate = `${ today.getFullYear() }${ commonService.minTwoDigits( today.getMonth() + 1 ) }${ commonService.minTwoDigits(
        today.getDate() ) }${ commonService.minTwoDigits( today.getHours() ) }${ commonService.minTwoDigits( today.getMinutes() ) }${ commonService.minTwoDigits(
        today.getMilliseconds() ) }${ ( Math.random() ).toString().slice( -8 ) }`;
    return `ID_COM-${ stringDate }-${ type.toUpperCase() }`;
};

/**
 * Créer un dossier de devis avec le type et le nom du client
 * @param type
 * @param customer
 */
export const createAFolder = async ( type: string, customer: string ) => {
    const dropboxPath = store.get( 'dropboxPath' );
    const today       = new Date();


    const reference  = createFolderRef( type );
    const folderName = `${ reference } (${ customer.toUpperCase() })`;

    const path = `${ dropboxPath }/DCI/${ folderName }`;
    if ( !fs.existsSync( path ) ) {
        fs.mkdirSync( path );

        createSubFolders( type, path );
        addJsonData( type, path, reference, folderName );
        await addFile( reference, folderName, type, customer, 0, false, false, '2', null, today, today, null );
    }

    return reference;
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

    const type = oldData[ 'type' ].toLowerCase();
    console.log( 'TYPE -->', type );
    if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
        data = JSON.stringify( convertOldRoFile( oldData ) );
    } else if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
        data = JSON.stringify( convertOldRrFile( oldData ) );
    } else if ( type === 'cet' ) {
        data = JSON.stringify( convertOldCeFile( oldData ) );
    } else {
        console.log( '%c RETURN FALSE', 'background: #fdd835; color: #000000' );
        return false;
    }

    console.log( '%c NEW DATA', 'background: #fdd835; color: #000000' );
    console.log( data );

    const id = new Date().valueOf();
    console.log( 'ID -->', id );
    if ( dropboxPath !== '' && !fs.existsSync( dropboxPath + '/DCI/newData_' + type + '_' + id + '.json' ) ) {
        fs.writeFileSync( dropboxPath + '/DCI/newData_' + type + '_' + id + '.json', data );
    }
    return true;
};

export const getFolderPath = ( folder: FolderItem ): string => {
    const dropboxPath = store.get( 'dropboxPath' );

    const path = `${ dropboxPath }/DCI/${ folder.folderName }`;

    if ( fs.existsSync( path ) ) {
        return path;
    }

    return '';
};

/**
 * Supprime un dossiser dans Drpbox et dans la DB
 * @param folder
 */
export const removeFolder = async ( folder: FolderItem ): Promise<boolean> => {
    const folderPath = getFolderPath( folder );

    if ( fs.existsSync( folderPath ) ) {
        try {
            fs.rmSync( folderPath, { recursive: true, force: true } );
            await deleteFile( folder.id );
            return true;
        } catch ( e ) {
            return false;
        }
    }

    return false;

};

/**
 * TODO A FAIRE
 * @param folder
 */
export const checkFolder = ( folder: FolderItem ) => {
    return true;
};
