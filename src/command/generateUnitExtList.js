const fs  = require( 'fs' );
const csv = require( 'csv-parser' );

function parseCSV( filePath ) {
    return new Promise( ( resolve, reject ) => {
        const results = [];
        fs.createReadStream( filePath )
          .pipe( csv( { separator: ';' } ) )
          .on( 'data', ( data ) => results.push( data ) )
          .on( 'end', () => resolve( results ) )
          .on( 'error', ( error ) => reject( error ) );
    } );
}

async function processData() {
    const response = {
        monophase: [],
        triphase:  [],
    };
    
    const defaultOutput = {
        '-15': 0,
        '-13': 0,
        '-11': 0,
        '-9':  0,
        '-8':  0,
        '-7':  0,
        '-6':  0,
        '-5':  0,
        '-4':  0,
    };
    
    try {
        const csvFiles = [
            { type: 'mono', path: 'src/command/65_mono.csv', temp: 65 },
            { type: 'mono', path: 'src/command/55_mono.csv', temp: 55 },
            { type: 'mono', path: 'src/command/40_mono.csv', temp: 40 },
            { type: 'tri', path: 'src/command/65_tri.csv', temp: 65 },
            { type: 'tri', path: 'src/command/55_tri.csv', temp: 55 },
            { type: 'tri', path: 'src/command/40_tri.csv', temp: 40 },
        ];
        
        for ( const csvFile of csvFiles ) {
            const csv = await parseCSV( csvFile.path );
            
            const refList = response[ csvFile.type === 'mono' ? 'monophase' : 'triphase' ];
            
            csv.forEach( ( row ) => {
                const temperature = parseInt( row[ 'TEMP_EXT' ].replace( '°C', '' ) );
                for ( const key in row ) {
                    if ( key !== 'TEMP_EXT' && key !== '' ) {
                        const ref = refList.find( ( item ) => item.ref === key );
                        
                        let val = parseFloat( row[ key ].replace( ',', '.' ) );
                        // Check si la valeur est un nombre
                        if ( isNaN( val ) ) {
                            val = 0;
                        }
                        
                        if ( ref ) {
                            ref.output[ csvFile.temp.toString() ][ temperature ] = val;
                        } else {
                            // TODO ERREUR : 18 n'est pas pris en compte car il y à 8 avant
                            // Si la référence contient un des nombres suivants, c'est la taille
                            const availableSizes = [ 4, 6, 8, 10, 12, 14, 16, 18 ];
                            let size             = availableSizes.find( ( size ) => key.includes( size.toString() ) );
                            if ( !size ) {
                                size = 0;
                            }
                            
                            const newItem                                            = {
                                ref:    null,
                                size:   size,
                                output: {
                                    65: { ...defaultOutput },
                                    55: { ...defaultOutput },
                                    40: { ...defaultOutput },
                                },
                            };
                            newItem.ref                                              = key;
                            newItem.output[ csvFile.temp.toString() ][ temperature ] = val;
                            refList.push( newItem );
                        }
                    }
                }
            } );
            ;
        }
        
        // Trié par ordre alphabétique
        response.monophase.sort( ( a, b ) => a.ref.localeCompare( b.ref ) );
        response.triphase.sort( ( a, b ) => a.ref.localeCompare( b.ref ) );
        
        const jsCode = `import { UnitExtList } from '@/services/algorithm/RoAlgo';\n\nexport const generatedUnitExtList: UnitExtList = ${ JSON.stringify(
            response,
            null,
            2 ) };`;
        fs.writeFileSync( 'src/command/unitExtList.ts', jsCode );
    }
    catch ( error ) {
        console.error( 'An error occurred:', error );
    }
}

processData();
