import Store from 'electron-store';
import { getFolderPath, updateJsonData } from '@/services/folder/folderService';
import fs from 'fs';
import SvairAvisImpot from '@/types/SvairAvisImpot';
import Assent from '@/types/File/Assent';
import { DataGouv } from '@/types/File/DataGouv';
import { CreateAccount } from '@/views/file/FileEdit.vue';

const schema = {
    dropboxPath:          {
        type:    'string',
        default: '',
    },
    currentFolderName:    {
        type:    'string',
        default: '',
    },
    currentFileReference: {
        type:    'string',
        default: '',
    },
    currentFileData:      {
        type:    'string',
        default: '',
    },
} as const;

const store = new Store( { schema } );


export const getCurrentFileReference = () => {
    return store.get( 'currentFileReference' );
};

export const setCurrentFileReference = ( reference: string ) => {
    store.set( 'currentFileReference', reference );
};

export const getcurrentFolderName = () => {
    return store.get( 'currentFolderName' );
};

export const setcurrentFolderName = ( folderName: string ) => {
    store.set( 'currentFolderName', folderName );
};

// export const resetCurrentFileReference = () => {
//     store.set( 'currentFileReference', '' );
// };

export const setCurrentFileData = ( fileData: string ) => {
    console.log( '%c SET CURRENT FILE DATA', 'background: #fdd835; color: #000000' );
    store.set( 'currentFileData', fileData );
};

export const getCurrentFileData = () => {
    const currentFile = store.get( 'currentFileData' ) as string;
    if ( currentFile !== '' ) {
        console.log( '%c CURRENT FILE NOT EMPTY', 'background: #fdd835; color: #000000' );
        return JSON.parse( currentFile );
    } else {
        console.log( '%c CURRENT FILE EMPTY', 'background: #fdd835; color: #000000' );
        const name = getcurrentFolderName() as string;
        console.log( 'GET FILE DATA NAME -->', name );
        const path = `${ getFolderPath( name ) }/data.json`;
        console.log( 'GET FILE DATA PATH -->', path );
        if ( fs.existsSync( path ) ) {
            const rawdata  = fs.readFileSync( path ).toString( 'utf8' );
            const fileData = JSON.parse( rawdata );
            setCurrentFileData( JSON.stringify( fileData ) );
        }
    }
};

export const resetCurrentFileData = () => {
    store.set( 'currentFileData', '' );
};

export const addAssent = ( data: SvairAvisImpot, dataGouv: DataGouv, isBeneficiary = false ): Assent => {
    let fileData = getCurrentFileData();
    console.log( 'FILE DATA', fileData );

    console.log( fileData.assents );
    if ( fileData.assents.length > 0 ) {
        const find = fileData.assents.find( f => f.refAvis === dataGouv.refAvis && f.numFiscal === dataGouv.numFiscal );
        console.log( 'FIND --> ', find );

        if ( find !== undefined ) {
            return find;
        }
    }

    let zipCode = '';
    let city    = '';
    const regex = /^(([0-8][0-9]|9[0-5])[0-9]{3}) (.*)$/;
    let m;
    console.log( 'VILLE ', data.foyerFiscal.ville );
    if ( ( m = regex.exec( data.foyerFiscal.ville ) ) !== null ) {
        // The result can be accessed through the `m`-variable.
        zipCode = m[ 0 ];

        m.forEach( ( match, groupIndex ) => {
            if ( groupIndex === 1 ) {
                zipCode = match;
                console.log( 'ZIP CODE -->', zipCode );
            } else if ( groupIndex === 3 ) {
                city = match;
                console.log( 'CITY -->', city );
            }
        } );
    }


    const assent: Assent = {
        civility:   'm', // Par défaut sur 'm'
        refAvis:    dataGouv.refAvis,
        numFiscal:  dataGouv.numFiscal,
        isBeneficiary,
        datagouv:   dataGouv,
        nom:        data.declarant1.nom,
        prenom:     data.declarant1.prenoms,
        adresse:    data.foyerFiscal.adresse,
        codepostal: zipCode,
        ville:      city,
        revenu:     data.revenuFiscalReference,
    };

    const assents = fileData.assents;
    assents.push( assent );
    fileData = {
        ...fileData,
        assents: assents,
    };

    console.log( '%c NEW FILE DATA', 'background: #fdd835; color: #000000' );
    console.log( fileData );
    updateJsonData( fileData );

    return assent;
};

export const updateAssent = ( data: CreateAccount ) => {
    let fileData = getCurrentFileData();

    const assents: Assent[ ] = [];
    let index                = 0;
    for ( const assent of data.assents ) {

        const find = fileData.assents.find( a => a.refAvis === assent.refAvis && a.numFiscal === assent.numFiscal );

        let datagouv;
        if ( find !== undefined ) {
            datagouv = find.datagouv;
        }

        const newAssent: Assent = {
            ...assent,
            datagouv,
            civility:      data.assentsDatas[ index ].civility,
            isBeneficiary: data.indexBeneficiary === index,
            nom:           data.assentsDatas[ index ].lastName,
            prenom:        data.assentsDatas[ index ].firstName,
            adresse:       data.assentsDatas[ index ].address,
            codepostal:    data.assentsDatas[ index ].zipCode,
            ville:         data.assentsDatas[ index ].city,
            revenu:        data.assentsDatas[ index ].income,
        };

        assents.push( newAssent );
        index++;
    }

    fileData = {
        ...fileData,
        assents: assents,
    };

    updateJsonData( fileData );
};

export const updateBeneficiary = ( data: CreateAccount ) => {
    updateAssent( data );
    let fileData = getCurrentFileData();

    const beneficiary: Beneficiary = {
        civility:  data.assentsDatas[ data.indexBeneficiary ].civility,
        lastName:  data.assentsDatas[ data.indexBeneficiary ].lastName,
        firstName: data.assentsDatas[ data.indexBeneficiary ].firstName,
        address:   data.assentsDatas[ data.indexBeneficiary ].address,
        zipCode:   data.assentsDatas[ data.indexBeneficiary ].zipCode,
        city:      data.assentsDatas[ data.indexBeneficiary ].city,
        email:     data.email,
        phone:     data.phone,
        mobile:    data.mobile,
        income:    data.assentsDatas[ data.indexBeneficiary ].income,
    };

    fileData = {
        ...fileData,
        beneficiary: beneficiary,
    };

    console.log( '%c NEW FILE DATA', 'background: #fdd835; color: #000000' );
    console.log( fileData );
    updateJsonData( fileData );

};
