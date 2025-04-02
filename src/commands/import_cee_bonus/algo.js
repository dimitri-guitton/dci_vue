const fs = require( 'fs' );

// Fonction pour lire le fichier CSV
function readCSVFile( filename ) {
    const fileContent = fs.readFileSync( filename, 'utf-8' );
    const lines       = fileContent.split( '\n' );
    const headers     = lines[ 0 ].split( ';' );
    const data        = [];
    
    // Supprime les espaces en début et fin de chaîne du headers
    for ( let i = 0; i < headers.length; i++ ) {
        headers[ i ] = headers[ i ].trim();
    }
    
    // Supprime les \r en fin de chaîne du headers
    headers[ headers.length - 1 ] = headers[ headers.length - 1 ].replace( '\r', '' );
    
    for ( let i = 1; i < lines.length; i++ ) {
        const line    = lines[ i ].split( ';' );
        const rowData = {};
        
        // Si la ligne est vide, on passe à la suivante
        if ( line.length === 1 && line[ 0 ] === '' ) {
            continue;
        }
        
        for ( let j = 0; j < headers.length; j++ ) {
            
            if ( line[ j ] === '' || line[ j ] === undefined ) {
                continue;
            }
            
            // Supprime les espaces en début et fin de chaîne
            line[ j ] = line[ j ].trim();
            
            // Supprime les \r en fin de chaîne
            line[ j ] = line[ j ].replace( '\r', '' );
            
            rowData[ headers[ j ] ] = line[ j ];
        }
        
        data.push( rowData );
    }
    
    return data;
}

function formatArea( area ) {
    if ( area === 'S < 35' ) {
        return 0;
    }
    
    if ( area === 'S < 70' ) {
        return 0;
    }
    
    if ( area === '35 ≤ S < 60' ) {
        return 35;
    }
    
    if ( area === '60 ≤ S < 70' ) {
        return 60;
    }
    
    if ( area === '70 ≤ S < 90' ) {
        return 70;
    }
    
    if ( area === '90 ≤ S < 110' ) {
        return 90;
    }
    
    if ( area === '110 ≤ S ≤ 130' || area === '110 ≤ S < 130' ) {
        return 110;
    }
    
    if ( area === 'S > 130' ) {
        return 130;
    }
    
    console.warn( 'Not found area: ' + area );
    return -1;
}

function formatNumber( number ) {
    if ( number === '' ) {
        return 0;
    }
    
    if ( number.includes( ',' ) ) {
        number = number.replace( ',', '.' );
    }
    
    return Number( number );
}

// Fonction pour créer l'objet TypeScript à partir des données CSV
function createCeePacObject( csvData ) {
    const CeePacRo = {
        H1: {}, H2: {},
    };
    
    csvData.forEach( row => {
        if ( row[ 'type' ] === '' ) {
            return;
        }
        
        let withEcs = null;
        if ( row[ 'ecs' ] !== undefined ) {
            withEcs = row[ 'ecs' ].toLowerCase() === 'oui' ? 'avec_ecs' : 'sans_ecs';
        }
        
        let type         = row[ 'type' ].toLowerCase();
        const zone       = row[ 'zone' ].toUpperCase();
        let etas         = row[ 'etas' ];
        const surface    = formatArea( row[ 'surface' ] );
        const primeAutre = formatNumber( row[ 'prime autre' ] );
        const primeGP    = formatNumber( row[ 'prime gp' ] );
        
        if ( type === 'maison' ) {
            type = 'maison_individuelle';
        }
        
        if ( etas === '4.3' ) {
            etas = '4_3';
        } else if ( etas === '3.9' ) {
            etas = '3_9';
        }
        
        if ( !CeePacRo[ zone ] ) {
            CeePacRo[ zone ] = {};
        }
        
        if ( !CeePacRo[ zone ][ type ] ) {
            CeePacRo[ zone ][ type ] = {};
        }
        
        if ( !CeePacRo[ zone ][ type ][ etas ] ) {
            CeePacRo[ zone ][ type ][ etas ] = {};
        }
        
        if ( !CeePacRo[ zone ][ type ][ etas ][ surface ] ) {
            CeePacRo[ zone ][ type ][ etas ][ surface ] = {};
        }
        
        if ( withEcs !== null ) {
            if ( !CeePacRo[ zone ][ type ][ etas ][ surface ][ withEcs ] ) {
                CeePacRo[ zone ][ type ][ etas ][ surface ][ withEcs ] = {};
            }
            
            CeePacRo[ zone ][ type ][ etas ][ surface ][ withEcs ] = {
                other: primeAutre,
                GP:    primeGP,
            };
            
        } else {
            
            CeePacRo[ zone ][ type ][ etas ][ surface ] = {
                other: primeAutre,
                GP:    primeGP,
            };
        }
    } );
    
    return CeePacRo;
}

// Lecture du fichier CSV
const filenameRo = 'src/commands/import_cee_bonus/values/PAC-RO.csv';
const roCsvData  = readCSVFile( filenameRo );

// Création de l'objet TypeScript CeePacRo
const CeePacRoObject = createCeePacObject( roCsvData );

// Conversion de l'objet en chaîne de caractères
const CeePacRoString = JSON.stringify( CeePacRoObject, null, 2 );

// Écriture de l'objet TypeScript dans un fichier
fs.writeFileSync( 'src/commands/import_cee_bonus/dist/CeePacRo.ts', `export const CeePacRoValues = ${ CeePacRoString };` );


// Lecture du fichier CSV
const filenameRr = 'src/commands/import_cee_bonus/values/PAC-RR.csv';
const rrCsvData  = readCSVFile( filenameRr );

// Création de l'objet TypeScript CeePacRo
const CeePacRrObject = createCeePacObject( rrCsvData );

// Conversion de l'objet en chaîne de caractères
const CeePacRrString = JSON.stringify( CeePacRrObject, null, 2 );

// Écriture de l'objet TypeScript dans un fichier
fs.writeFileSync( 'src/commands/import_cee_bonus/dist/CeePacRr.ts', `export const CeePacRrValues = ${ CeePacRrString };` );
