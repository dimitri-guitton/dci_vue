// Fait une requete api sur https://erp.local/admin/product/json-ro pour récupérer un JSON
// Ecrit le résultat dans un fichier selon le type de données

const axios = require( 'axios' );
const fs    = require( 'fs' );

async function getData() {
    // Requete http
    // TODO Mettre l'url de la prod par la suite
    const response = await axios.get( 'https://127.0.0.1:8000/data/pac-ro?pass=9AFDC2F8C9BC394E9872B1839FFA4' );
    
    if ( response.status !== 200 ) {
        throw new Error( 'Error while fetching data' );
    }
    
    const extProducts = response.data.ext;
    const intProducts = response.data.int;
    
    
    const jsCodeExt = `import { UnitExtList } from '@/services/algorithm/RoAlgo';\n\nexport const generatedUnitExtList: UnitExtList = ${ JSON.stringify(
        response.data.ext,
        null,
        2 ) };`;
    fs.writeFileSync( 'src/commands/import_pac_ro_products/dist/unitExtList.ts', jsCodeExt );
    
    const jsCodeInt = `import { UnitIntList } from '@/services/algorithm/RoAlgo';\n\nexport const generatedUnitIntList: UnitIntList = ${ JSON.stringify(
        response.data.int,
        null,
        2 ) };`;
    fs.writeFileSync( 'src/commands/import_pac_ro_products/dist/unitIntList.ts', jsCodeInt );
    
}

getData();
