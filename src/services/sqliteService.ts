import sqlite3 from 'sqlite3';
import { ISqlite, open } from 'sqlite';
import Store from 'electron-store';
import { Database } from 'sqlite/build/Database';
import {
    FILE_CET_TYPE,
    FILE_CLOSE_STATUS,
    FILE_COMBLE_TYPE,
    FILE_COMPLETE_STATUS,
    FILE_INCOMPLETE_STATUS,
    FILE_PAC_RO_TYPE,
    FILE_PAC_RR_TYPE,
    FILE_PB_TYPE,
    FILE_PG_TYPE,
    FILE_PV_TYPE,
    FILE_SOL_TYPE,
    FILE_TO_CORRECT_STATUS,
} from '@/services/constantService';
import { toFrenchDate, toFrenchDateWithTime } from '@/services/commonService';
import { DbFile } from '@/types/v2/Sqlite/DbFile';
import { DatatableFile } from '@/types/v2/DatatableFile/DatatableFile';
import { DatatableFileType } from '@/types/v2/DatatableFile/DatatableFileType';
import { DatatableFileStatus } from '@/types/v2/DatatableFile/DatatableFileStatus';
import { DbFileTodo } from '@/types/v2/Sqlite/DbFileTodo';
import RunResult = ISqlite.RunResult;

const schema = {
    dropboxPath: {
        type:    'string',
        default: '',
    },
} as const;

// Store pour stoker les users Data
const store = new Store( { schema } );

let db: Database;

/**
 * Retourne les todos depuis la chaine de caractère dans la table File
 * @param todosId
 */
async function getTodos( todosId: string | null ): Promise<DbFileTodo[]> {
    if ( todosId === null ) {
        todosId = '';
    }

    const query = `SELECT *
                   from fileTodo
                   WHERE serverId IN (${ todosId.split( ',' ) })
                   ORDER BY serverId;`;

    return await db.all( query );
}


/**
 * Convertie les données de la DB en objets FileItem
 * @param items
 */
async function convertDbFileToFileItem( items: DbFile[] ) {
    const data: DatatableFile[] = [];

    for ( const item of items ) {
        const types: DatatableFileType[] = [];
        let status: DatatableFileStatus;

        switch ( parseInt( item.statusInDCI ) ) {
            case FILE_COMPLETE_STATUS.code:
                status = FILE_COMPLETE_STATUS;
                break;
            case FILE_INCOMPLETE_STATUS.code:
                status = FILE_INCOMPLETE_STATUS;
                break;
            case FILE_TO_CORRECT_STATUS.code:
                status = FILE_TO_CORRECT_STATUS;
                break;
            case FILE_CLOSE_STATUS.code:
                status = FILE_CLOSE_STATUS;
                break;
            default:
                status = FILE_INCOMPLETE_STATUS;
        }

        const fileTypes = item.fileTypes.split( ',' );
        fileTypes.forEach( ( type: string ) => {
            switch ( type ) {
                case FILE_COMBLE_TYPE.slug:
                    types.push( FILE_COMBLE_TYPE );
                    break;
                case FILE_SOL_TYPE.slug:
                    types.push( FILE_SOL_TYPE );
                    break;
                case FILE_PAC_RR_TYPE.slug:
                    types.push( FILE_PAC_RR_TYPE );
                    break;
                case FILE_PAC_RO_TYPE.slug:
                    types.push( FILE_PAC_RO_TYPE );
                    break;
                case FILE_CET_TYPE.slug:
                    types.push( FILE_CET_TYPE );
                    break;
                case FILE_PG_TYPE.slug:
                    types.push( FILE_PG_TYPE );
                    break;
                case FILE_PB_TYPE.slug:
                    types.push( FILE_PB_TYPE );
                    break;
                case FILE_PV_TYPE.slug:
                    types.push( FILE_PV_TYPE );
                    break;
                default:
                    console.warn( `Le type (${ type }) n'est pas pris en compte pour MYSQL` );
                    break;
            }
        } );

        let errorsStatusInDci: number[] = [];
        if ( item.errorsStatusInDci !== null && item.errorsStatusInDci.length > 0 ) {
            errorsStatusInDci = item.errorsStatusInDci.split( ';' ).map( i => parseInt( i ) );
        }

        const todos: DbFileTodo[] = [];
        if ( item.todos !== null ) {
            const dbTodos = await getTodos( item.todos );


            for ( const todo of dbTodos ) {
                //! ON FORCE à true ou false et non à 1 ou 0, sinon les checkbox ne comprennent pas
                if ( todo.isDone ) {
                    todo.isDone = true;
                } else {
                    todo.isDone = false;
                }

                todos.push( todo );
            }

        }

        data.push( {
                       id:         item.id,
                       reference:  item.reference,
                       folderName: item.folderName,
                       types:      types,
                       customer:   item.customer,
                       totalTTC:   item.totalTTC,
                       isProspect: item.isProspect,
                       isClosed:   item.isClosed,
                       status:     status,
                       todos,
                       errors:     errorsStatusInDci,
                       createdAt:  toFrenchDate( item.createdAt ),
                       updatedAt:  toFrenchDate( item.updatedAt ),
                       sendAt:     toFrenchDateWithTime( item.sendAt ),
                   } )
        ;
    }

    return data;
}

/**
 * Convertie une date en string avec des quotes
 * @param value
 */
const dateToString = ( value: Date | null ) => {
    if ( value === null ) {
        return null;
    }

    return `'${ value.getTime() }'`;
};

/**
 * Retourne null si null sinon retourne un string avec des quotes
 * @param value
 */
const convertToStringIfNotNull = ( value: string | null ): string | null => {
    if ( value === null ) {
        return null;
    }

    return `'${ value }'`;
};

/**
 * Ouvre la DB
 */
export async function openDb() {
    const dropboxPath = store.get( 'dropboxPath' );

    db = await open( {
                         filename: `${ dropboxPath }/DCI/database.db`,
                         driver:   sqlite3.cached.Database,
                     } );
}

/**
 * Création des tables pour la DB
 */
export async function initDb() {
    const fileTable     = 'CREATE TABLE IF NOT EXISTS file ( id INTEGER PRIMARY KEY AUTOINCREMENT, reference VARCHAR(255) NOT NULL, folderName VARCHAR(255) NOT NULL,fileTypes VARCHAR(255) NOT NULL, customer VARCHAR(255), totalTTC FLOAT, isProspect SMALLINT NOT NULL, isClosed SMALLINT NOT NULL, statusInDCI INTEGER NOT NULL, errorsStatusInDci VARCHAR(255) NOT NULL,todos VARCHAR(255), createdAt DATETIME NOT NULL, updatedAt DATETIME NOT NULL, sendAt DATETIME )';
    const fileTodoTable = 'CREATE TABLE IF NOT EXISTS fileTodo ( serverId INTEGER PRIMARY KEY, label VARCHAR(255) NOT NULL, isDone BOOLEAN NOT NULL, receivedAt DATETIME NOT NULL, donedAt DATETIME )';

    await db.exec( fileTable );
    await db.exec( fileTodoTable );

    // Update DB
    const addErrorsColumn = 'ALTER TABLE file ADD COLUMN errorsStatusInDci VARCHAR(255)';
    try {
        await db.exec( addErrorsColumn );
    } catch ( e ) {
        console.warn( e );
    }
}

/**
 * Ajout d'un dossiers dans la DB
 * @param reference
 * @param folderName
 * @param fileTypes
 * @param customer
 * @param totalTTC
 * @param isProspect
 * @param isClosed
 * @param statusInDCI
 * @param errorsStatusInDci
 * @param todos
 * @param createdAt
 * @param updatedAt
 * @param sendAt
 */
export async function addFile( reference: string,
                               folderName: string,
                               fileTypes: string,
                               customer: string,
                               totalTTC: number,
                               isProspect: boolean,
                               isClosed: boolean,
                               statusInDCI: string,
                               errorsStatusInDci: string | null,
                               todos: string | null,
                               createdAt: Date,
                               updatedAt: Date,
                               sendAt: Date | null ) {

    const strTodos     = convertToStringIfNotNull( todos );
    const strCreatedAt = dateToString( createdAt );
    const strUpdatedAt = dateToString( updatedAt );
    console.log( 'SEND AT -->', sendAt );
    const strSendAt = dateToString( sendAt );

    const query = `INSERT INTO file (reference, folderName, fileTypes, customer, totalTTC, isProspect, isClosed,
                                     statusInDCI, errorsStatusInDci, todos, createdAt, updatedAt, sendAt)
                   VALUES ("${ reference }",
                           "${ folderName }",
                           "${ fileTypes }",
                           "${ customer }",
                           ${ totalTTC },
                           ${ isProspect },
                           ${ isClosed },
                           "${ statusInDCI }",
                           "${ errorsStatusInDci }",
                           ${ strTodos },
                           ${ strCreatedAt },
                           ${ strUpdatedAt },
                           ${ strSendAt })
    `;

    console.log( '%c BEFORE EXECUTE QUERY', 'background: #fdd835; color: #000000' );
    console.log( query );
    await db.exec( query );
}


/**
 * Récupère tous les dossiers de la DB
 */
export async function getAllFiles(): Promise<DatatableFile[]> {
    const query = `SELECT *
                   from file
                   ORDER BY createdAt DESC;`;

    const queryResult = await db.all( query );
    console.log( 'queryResult', queryResult );

    const result = await convertDbFileToFileItem( queryResult );
    console.log( 'result', result );
    return result;
}

export async function setFileProspect( fileId: number, value: boolean ) {
    const query = `UPDATE file
                   SET isProspect = ${ value }
                   WHERE id = ${ fileId }`;

    await db.run( query );
}

export async function deleteFile( fileId: number ): Promise<RunResult> {
    console.log( '%c ON DELETE', 'background: #fdd835; color: #000000' );
    const query = `DELETE
                   FROM file
                   WHERE id = ${ fileId }`;

    return await db.run( query );
}

async function getFileByReference( reference: string ) {
    const query = `SELECT *
                   FROM file
                   WHERE reference = '${ reference }'
                   ORDER BY createdAt DESC;`;

    if ( db === undefined ) {
        await openDb();
    }
    return await db.all( query );
}

export async function updateTotalTtc( referene: string, value: number ) {
    console.log( '%c UPDATE TOTAL TTC BDD', 'background: #CEFF00; color: #000000' );
    const res = await getFileByReference( referene );
    console.log( 'RES -->', res );
    let fileId = 0;
    if ( res.length > 0 ) {
        fileId = res[ 0 ].id;
    }

    const query = `UPDATE file
                   SET totalTTC = ${ value }
                   WHERE id = ${ fileId }`;

    await db.run( query );
}

export async function updateReference( oldReferene: string, newReference: string ) {
    console.log( '%c UPD REF', 'background: #fdd835; color: #000000' );
    console.log( oldReferene );
    console.log( newReference );

    const query = `UPDATE file
                   SET reference = '${ newReference }'
                   WHERE reference = '${ oldReferene }'`;

    await db.run( query );
}

export async function updateErrorsStatusInDci( referene: string, errors: number[] ) {
    const res = await getFileByReference( referene );

    let fileId = 0;
    if ( res.length > 0 ) {
        fileId = res[ 0 ].id;
    }

    const query = `UPDATE file
                   SET errorsStatusInDci = '${ errors.join( ';' ) }'
                   WHERE id = ${ fileId }`;


    let query2: string;
    if ( errors.length === 0 ) {
        query2 = `UPDATE file
                  SET statusInDCI = ${ FILE_COMPLETE_STATUS.code }
                  WHERE id = ${ fileId }`;
    } else {
        query2 = `UPDATE file
                  SET statusInDCI = ${ FILE_INCOMPLETE_STATUS.code }
                  WHERE id = ${ fileId }`;
    }

    await db.run( query );
    await db.run( query2 );
}

export async function closeFile( reference: string, isClosed: boolean ) {

    let status = FILE_COMPLETE_STATUS.code;
    if ( isClosed ) {
        status = FILE_CLOSE_STATUS.code;
    }

    const query = `UPDATE file
                   SET isClosed    = ${ isClosed },
                       statusInDCI = ${ status }
                   WHERE reference = '${ reference }'`;

    console.log( query );
    await db.run( query );
}

export async function addTodo( serverId: number,
                               label: string,
                               isDone: boolean,
                               receivedAt: Date,
                               doneAt: Date | null ) {

    const strReceivedAt = dateToString( receivedAt );
    const strDoneAt     = dateToString( doneAt );
    console.log( 'receivedAt', receivedAt );
    console.log( strReceivedAt );
    const query = `INSERT INTO fileTodo (serverId, label, isDone, receivedAt, donedAt)
                   VALUES (${ serverId },
                           "${ label }",
                           ${ isDone },
                           ${ strReceivedAt },
                           ${ strDoneAt })
    `;

    console.log( query );
    await db.exec( query );
}

export async function addTodoToFile( todosId: number[],
                                     fileReference: string ) {

    const strTodosId: string = todosId.join( ',' );

    const query = `UPDATE file
                   SET todos       = '${ strTodosId }',
                       statusInDCI = ${ FILE_TO_CORRECT_STATUS.code }
                   WHERE reference = '${ fileReference }'`;

    console.log( query );
    await db.run( query );
}

export async function sendAt( reference: string, sendAt: Date ) {
    const query = `UPDATE file
                   SET sendAt = ${ dateToString( sendAt ) }
                   WHERE reference = '${ reference }'`;

    console.log( query );
    await db.run( query );
}

export async function updateDbTodo( id: number, isDone: boolean ) {
    let date: string | null = null;
    if ( isDone ) {
        date = dateToString( new Date() );
    }
    console.log( 'Date of is done', date );
    const query = `UPDATE fileTodo
                   SET isDone  = ${ isDone },
                       donedAt = ${ date }
                   WHERE serverId = ${ id }`;

    console.log( query );
    await db.run( query );
}

export async function getTodoByFile( reference: string ) {
    console.log( '%c GETTODO BY FILE', 'background: #fdd835; color: #000000' );
    const query = `SELECT todos
                   from file
                   WHERE reference = '${ reference }';`;

    const queryResult = await db.all( query );
    console.log( 'queryResult', queryResult );

    let todos: DbFileTodo[] = [];
    if ( queryResult.length > 0 ) {
        todos = await getTodos( queryResult[ 0 ].todos );
    }


    return todos;
}

export async function setStatusFile( reference: string, status: number ) {
    const query = `UPDATE file
                   SET statusInDCI = ${ status }
                   WHERE reference = '${ reference }'`;

    console.log( query );
    await db.run( query );
}


