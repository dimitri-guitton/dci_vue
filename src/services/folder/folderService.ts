import fs from 'fs';
import Store from 'electron-store';
import * as commonService from '../commonService';
import { toEnglishDate } from '../commonService';
import { convertOldRoFile } from '@/services/file/converter/convertRoData';
import { convertOldRrFile } from '@/services/file/converter/convertRrData';
import { convertOldCetFile } from '@/services/file/converter/convertCetData';
import path from 'path';
import { addFile, deleteFile } from '@/services/sqliteService';
import { FILE_CET, FILE_PAC_RO, FILE_PAC_RR, FILE_PB, FILE_PG, FILE_PV, LIST_FILE_TYPE } from '@/services/constantService';
import { getcurrentFolderName, setCurrentFileData, setErrorsStatusInDci } from '@/services/data/dataService';
import { convertOldPgFile } from '@/services/file/converter/convertPgData';
import { convertOldCombleFile } from '@/services/file/converter/convertCombleData';
import { convertOldSolFile } from '@/services/file/converter/convertSolData';
import { DatatableFile } from '@/types/v2/DatatableFile/DatatableFile';
import { PdfType } from '@/services/pdf/pdfGenerator';
import { shell } from 'electron';
import { NewFolderData } from '@/components/DCI/modals/NewFileModal.vue';
import { convertOldPbFile } from '@/services/file/converter/convertPbData';
import { convertOldPvFile } from '@/services/file/converter/convertPvData';
import { ElMessage } from 'element-plus';

declare const __static: string;

const schema = {
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

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

export const FoldersNames = {
    AVIS:                        'avis',
    MAP:                         'carte',
    DEVIS:                       'devis',
    DEVIS_SIGNE:                 'devis_signe',
    FICHE:                       'fiche',
    FICHE_SIGNE:                 'fiche_signe',
    ATTEST_ADRESSE_SIGNE:        'attest_adresse_signe',
    ATTESTATION_HONNEUR:         'attestation_sur_honneur',
    MANDAT_MA_PRIME_RENOV:       'mandat_maprimerenov',
    ATTEST_TVA_SIMPLIFIEE:       'attest_tva_simp',
    ATTEST_TVA_SIMPLIFIEE_SIGNE: 'attest_tva_simp_signe',
    CADRE_CONTRIBUTION_CEE:      'cadre_contribution_cee',
    DIMENSIONNEMENT_PAC:         'dimensionnement_pac',
    VIDEO:                       'video',
    PHOTO:                       'photo',
    MANDAT_ENEDIS:               'mandat_enedis',
    MANDAT_MAIRIE:               'mandat_mairie',
    ETUDE_RENTABILITE:           'etude_rentabilite',
};

const Folders = [
    { name: FoldersNames.AVIS, dossierType: [ 'all' ] },
    { name: FoldersNames.MAP, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS, dossierType: [ 'all' ] },
    { name: FoldersNames.DEVIS_SIGNE, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE, dossierType: [ 'all' ] },
    { name: FoldersNames.FICHE_SIGNE, dossierType: [ 'all' ] },
    { name: FoldersNames.ATTEST_ADRESSE_SIGNE, dossierType: [ 'all' ] },
    { name: FoldersNames.ATTESTATION_HONNEUR, dossierType: [ 'all' ] },
    { name: FoldersNames.MANDAT_MA_PRIME_RENOV, dossierType: [ FILE_PAC_RO, FILE_CET, FILE_PG, FILE_PB ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE, dossierType: [ FILE_PAC_RR, FILE_PAC_RO, FILE_CET, FILE_PG, FILE_PB ] },
    { name: FoldersNames.ATTEST_TVA_SIMPLIFIEE_SIGNE, dossierType: [ FILE_PAC_RR, FILE_PAC_RO, FILE_CET, FILE_PG, FILE_PB ] },
    { name: FoldersNames.CADRE_CONTRIBUTION_CEE, dossierType: [ 'all' ] },
    { name: FoldersNames.DIMENSIONNEMENT_PAC, dossierType: [ FILE_PAC_RR, FILE_PAC_RO ] },
    { name: FoldersNames.VIDEO, dossierType: [ 'all' ] },
    { name: FoldersNames.PHOTO, dossierType: [ 'all' ] },
    { name: FoldersNames.MANDAT_ENEDIS, dossierType: [ FILE_PV ] },
    { name: FoldersNames.MANDAT_MAIRIE, dossierType: [ FILE_PV ] },
    { name: FoldersNames.ETUDE_RENTABILITE, dossierType: [ FILE_PV ] },
];

/**
 * Créer les sous dossier dans un dossier principale
 * @param type
 * @param parent
 */
const createSubFolders   = ( type: string, parent: string ) => {
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
// TODO argument inutile comme type qui est déja dans NewFolderData
export const addJsonData = ( type: string, parent: string, reference: string, folderName: string, newFolder: NewFolderData ) => {

    // const jsonPath = path.join( __static, `examples/empty_new_data_${ type }.json` );
    const jsonPath = path.join( __static, `config_json/empty_new_data_${ type }.json` );

    const rawdata = fs.readFileSync( jsonPath ).toString( 'utf8' );

    let fileData = JSON.parse( rawdata );

    const today = new Date();
    // console.log( '+5 MONTH', new Date( today.setMonth( today.getMonth() + 5 ) ) );

    fileData = {
        ...fileData,
               ref:                       reference,
               folderName:                folderName,
               createdAt:                 toEnglishDate( today.toString() ),
               updatedAt:                 toEnglishDate( today.toString() ),
               disabledBonus:             newFolder.disabledBonus,
               disabledCeeBonus:          newFolder.disabledCeeBonus,
               disabledMaPrimeRenovBonus: newFolder.disabledMaPrimeRenovBonus,
               statusInDci:               2,
               errorsStatusInDci:         [],
               quotation:                 {
                   ...fileData.quotation,
                   executionDelay: toEnglishDate( new Date( today.setMonth( today.getMonth() + 5 ) ).toString() ),
               },
           };

           console.log( `${ parent }/data.json` );
           console.log( fileData );
           fs.writeFileSync( `${ parent }/data.json`, JSON.stringify( fileData ) );
           setCurrentFileData( JSON.stringify( fileData ) );

       }
;

export const createFolderRef = ( type: string ): string => {
    const today      = new Date();
    const stringDate = `${ today.getFullYear() }${ commonService.minTwoDigits( today.getMonth() + 1 ) }${ commonService.minTwoDigits(
        today.getDate() ) }${ commonService.minTwoDigits( today.getHours() ) }${ commonService.minTwoDigits( today.getMinutes() ) }${ commonService.minTwoDigits(
        today.getSeconds() ) }`;
    return `ID_COM-${ stringDate }-${ type.toUpperCase() }`;
};

/**
 * Créer un dossier de devis avec le type et le nom du client
 * @param newFolder
 */
export const createAFolder = async ( newFolder: NewFolderData ): Promise<{ reference: string; folderName: string }> => {
    const dropboxPath = store.get( 'dropboxPath' );
    const today       = new Date();


    const type     = newFolder.type;
    const customer = newFolder.customer;

    const reference  = createFolderRef( type );
    const folderName = `${ reference } (${ customer.toUpperCase() })`;

    const path = `${ dropboxPath }/DCI/${ folderName }`;
    if ( !fs.existsSync( path ) ) {
        fs.mkdirSync( path );

        createSubFolders( type, path );
        addJsonData( type, path, reference, folderName, newFolder );
        await addFile( reference, folderName, type, customer, 0, false, false, '2', null, null, today, today, null );
    }

    return {
        reference,
        folderName,
    };
};

/**
 * Convertie les anciens JSON
 */
export const convertAllOldJsonToNewJson = () => {
    console.log( '%c CONVERT', 'background: #fdd835; color: #000000' );
    // const dropboxPath        = store.get( 'dropboxPath' );
    const oldDatas: object[] = [];
    const jsonFolder         = path.join( __static, 'examples' );
    console.log( 'JSON FOLDER', jsonFolder );
    console.log( `${ jsonFolder }/old_data_cet.json` );

    if ( fs.existsSync( `${ jsonFolder }/old_data_cet.json` ) ) {
        console.log( '%c CONVERT OLD CET', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_cet.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_pg.json` ) ) {
        console.log( '%c CONVERT OLD PG', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pg.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_sol.json` ) ) {
        console.log( '%c CONVERT OLD SOL', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_sol.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_comble.json` ) ) {
        console.log( '%c CONVERT OLD COMBLE', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_comble.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_pac_ro.json` ) ) {
        console.log( '%c CONVERT OLD PAC RO', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pac_ro.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_pac_rr.json` ) ) {
        console.log( '%c CONVERT OLD PAC RR', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pac_rr.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_pb.json` ) ) {
        console.log( '%c CONVERT OLD PB', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pb.json`, 'utf8' ) ) );
    }
    if ( fs.existsSync( `${ jsonFolder }/old_data_pv.json` ) ) {
        console.log( '%c CONVERT OLD PV', 'background: #4CD439; color: #000000' );
        oldDatas.push( JSON.parse( fs.readFileSync( `${ jsonFolder }/old_data_pv.json`, 'utf8' ) ) );
    }

    for ( const oldData of oldDatas ) {
        let data = '';

        let type = oldData[ 'type' ].toLowerCase();

        if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'ro' ) {
            data = JSON.stringify( convertOldRoFile( oldData ), null, 4 );
            type += '_ro';
        } else if ( type === 'pac' && oldData[ 'pacType' ].toLowerCase() === 'rr' ) {
            data = JSON.stringify( convertOldRrFile( oldData ), null, 4 );
            type += '_rr';
        } else if ( type === 'cet' ) {
            data = JSON.stringify( convertOldCetFile( oldData ), null, 4 );
        } else if ( type === 'poele' ) {
            data = JSON.stringify( convertOldPgFile( oldData ), null, 4 );
            type = 'pg';
        } else if ( type === 'comble' ) {
            data = JSON.stringify( convertOldCombleFile( oldData ), null, 4 );
        } else if ( type === 'sol' ) {
            data = JSON.stringify( convertOldSolFile( oldData ), null, 4 );
        } else if ( type === 'pb' ) {
            data = JSON.stringify( convertOldPbFile( oldData ), null, 4 );
        } else if ( type === 'pv' ) {
            data = JSON.stringify( convertOldPvFile( oldData ), null, 4 );
        } else {
            console.log( '%c RETURN FALSE', 'background: #fdd835; color: #000000' );
            return false;
        }

        const path = `${ jsonFolder }/empty_new_data_${ type }.json`;
        fs.writeFileSync( path, data );
    }

    return true;
};

/**
 * Retourne les données des json sur l'ERP
 */
export const getFileJson = () => {
    const jsonFolder = path.join( __static, 'config_json' );

    // Si le dossier n'existe pas on le créer
    try {
        fs.accessSync( jsonFolder );
    } catch ( e ) {
        fs.mkdirSync( jsonFolder );
    }

    for ( const file of LIST_FILE_TYPE ) {
        const url = `${ process.env.VUE_APP_API_URL }/config-file/${ file.slug }`;

        console.log( 'URL -->', url );
        fetch( url )
            .then( response => response.json() )
            .then( response => {
                console.log( 'Response -->', response );

                const finalPath = `${ jsonFolder }/empty_new_data_${ file.slug }.json`;
                fs.writeFileSync( finalPath, JSON.stringify( response ) );
            } )
            .catch( error => alert( 'Erreur : ' + error ) );
    }
};

export const getFolderPath = ( folderName: string ): string => {
    const dropboxPath = store.get( 'dropboxPath' );

    const path = `${ dropboxPath }/DCI/${ folderName }`;

    if ( fs.existsSync( path ) ) {
        return path;
    }

    return '';
};

/**
 * Supprime un dossiser dans Drpbox et dans la DB
 * @param folder
 */
export const removeFolder = async ( folder: DatatableFile ): Promise<boolean> => {
    const folderPath = getFolderPath( folder.folderName );

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

export const updateJsonData = ( fileData ) => {
    console.log( '%c UPDATE JSON DATA', 'background: #35D452; color: #000000' );
    const name = getcurrentFolderName() as string;
    const path = `${ getFolderPath( name ) }/data.json`;
    console.log( path );
    if ( fs.existsSync( path ) ) {
        console.log( 'File data -->', fileData );
        fs.writeFileSync( path, JSON.stringify( fileData, null, 2 ) );
        setCurrentFileData( JSON.stringify( fileData ) );
    } else {
        console.log( `'%c LE FICHIER (${ path }) n'existe pas'`, 'background: #FF0017; color: #000000' );
    }
};

/**
 * Check si un dossier est vide
 * @param folderPath
 */
const isFolderEmpty = ( folderPath ): boolean => {
    try {
        fs.accessSync( folderPath );

        const files = fs.readdirSync( folderPath );

        // Suppression du .DS_Store sous MAC
        if ( files[ 0 ] == '.DS_Store' ) {
            files.splice( 0, 1 );
        }

        console.log( files );
        if ( files.length > 0 ) {
            return false;
        }
    } catch ( e ) {
        console.warn( e );
    }

    console.log( `${ folderPath } IS EMPTY` );
    return true;
};

export const checkFolder = async ( folderName: string ) => {
    console.log( '%c IN CHECK FOLDER', 'background: #BCBE9D; color: #000000' );
    const folderPath       = getFolderPath( folderName );
    const errors: number[] = [];

    // Fichier dans le dossier "DEVIS"
    const quotationEmpty: boolean       = isFolderEmpty( path.join( folderPath, FoldersNames.DEVIS ) );
    // Fichier dans le dossier "DEVIS SIGNE"
    const signedQuotationEmpty: boolean = isFolderEmpty( path.join( folderPath, FoldersNames.DEVIS_SIGNE ) );
    // Fichier dans le dossier "AVIS"
    const assentEmpty: boolean          = isFolderEmpty( path.join( folderPath, FoldersNames.AVIS ) );
    // Fichier dans le dossier "FICHE"
    const worksheetEmpty: boolean       = isFolderEmpty( path.join( folderPath, FoldersNames.FICHE ) );
    // Fichier dans le dossier "PHOTO"
    const photoEmpty: boolean           = isFolderEmpty( path.join( folderPath, FoldersNames.PHOTO ) );
    // Fichier dans le dossier "ATTESTATION_HONNEUR"
    const attestEmpty: boolean          = isFolderEmpty( path.join( folderPath, FoldersNames.ATTESTATION_HONNEUR ) );

    console.log( '%c ', 'background: #fdd835; color: #000000' );
    console.log( quotationEmpty );
    console.log( signedQuotationEmpty );
    console.log( assentEmpty );
    console.log( worksheetEmpty );
    console.log( photoEmpty );
    console.log( attestEmpty );
    console.log( '%c ', 'background: #fdd835; color: #000000' );

    if ( quotationEmpty ) {
        errors.push( 1 );
    }
    if ( signedQuotationEmpty ) {
        errors.push( 2 );
    }
    if ( assentEmpty ) {
        errors.push( 3 );
    }
    if ( worksheetEmpty ) {
        errors.push( 4 );
    }
    if ( photoEmpty ) {
        errors.push( 5 );
    }
    if ( attestEmpty ) {
        errors.push( 6 );
    }

    console.log( 'ERRRORS', errors );
    await setErrorsStatusInDci( errors );
};


export const openPdf = ( filePath: string ) => {
    console.log( '%c OPEN PDF', 'background: #FF0007; color: #000000' );
    console.log( filePath );
    shell.openPath( filePath ).then( response => console.log( 'After open', response ) );
};


export const savePdf = ( buffer: Buffer, type: PdfType, openAfterSave = true ) => {
    console.log( '%c ON SAVE PDF', 'background: #fdd835; color: #000000' );
    const folderName = getcurrentFolderName() as string;
    const folderPath = getFolderPath( folderName );

    let folder = '';
    let name   = '';
    switch ( type ) {
        case PdfType.Address:
            folder = FoldersNames.ATTEST_ADRESSE_SIGNE;
            name   = 'attestation_adresse.pdf';
            break;
        case PdfType.Quotation:
            folder = FoldersNames.DEVIS;
            name   = 'devis.pdf';
            break;
        case PdfType.Worksheet:
            folder = FoldersNames.FICHE;
            name   = 'fiche.pdf';
            break;
        case PdfType.Tva:
            folder = FoldersNames.ATTEST_TVA_SIMPLIFIEE;
            name   = 'attestation_tva_simplifiee.pdf';
            break;
        case PdfType.ContributionFramework:
            folder = FoldersNames.CADRE_CONTRIBUTION_CEE;
            name   = 'cadre_contribution.pdf';
            break;
        case PdfType.MaPrimeRenov:
            folder = FoldersNames.MANDAT_MA_PRIME_RENOV;
            name   = 'mandat_ma_prime_renov.pdf';
            break;
        case PdfType.ProfitabilityStudy:
            folder = FoldersNames.ETUDE_RENTABILITE;
            name   = 'etude_rentabilite.pdf';
            break;
        case PdfType.SizingPac:
            folder = FoldersNames.DIMENSIONNEMENT_PAC;
            name   = 'dimensionnement_pac.pdf';
            break;
        default:
            console.log( '%c ERROR', 'background: #fdd835; color: #000000' );
    }

    const filePath = `${ folderPath }/${ folder }/${ name }`;
    // const writer   = fs.createWriteStream( filePath );

    try {
        fs.writeFile( filePath, buffer, () => {
            console.log( '%c AFTER WRITE FILE', 'background: #fdd835; color: #000000' );
            openPdf( filePath );
        } );
    } catch ( err ) {
        ElMessage( {
                       message: 'Impossible de générer le PDF',
                       type:    'error',
                   } );
        console.error( err );
    }

    // writer.write( buffer );

    // if ( openAfterSave ) {
    //     console.log( '%c IN OPEN', 'background: #fdd835; color: #000000' );
    //     setTimeout( () => {
    //         openPdf( filePath );
    //     }, 500 );
    // }
};

export const copyFileFromAssetToDropbox = ( assetPath: string, destinationFolder: string, fileName: string ) => {
    console.log( '%c IN copyFileFromAssetToDropbox', 'background: #fdd835; color: #000000' );
    fs.copyFile( assetPath, `${ getFolderPath( getcurrentFolderName() ) }/${ destinationFolder }/${ fileName }`, ( err ) => {
        if ( err ) {
            throw err;
        }
    } );
};

