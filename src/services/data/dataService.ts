import Store from 'electron-store';
import { getFolderPath, updateJsonData } from '@/services/folder/folderService';
import fs from 'fs';
import SvairAvisImpot from '@/types/SvairAvisImpot';
import { CetFile } from '@/types/v2/File/Cet/CetFile';
import { DataGouv } from '@/types/v2/File/Common/DataGouv';
import { Assent } from '@/types/v2/File/Common/Assent';
import { Beneficiary } from '@/types/v2/File/Common/Beneficiary';
import { Product } from '@/types/v2/File/Common/Product';
import { Option } from '@/types/v2/File/Common/Option';
import { BlankOption } from '@/types/v2/File/Common/BlankOption';
import { FILE_PAC_RO, FILE_PAC_RR } from '@/services/constantService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';

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

        // TODO faire la verif si la path existe, si il n'existe pas créer le .json
        // if ( fs.existsSync( path ) ) {
        const rawdata  = fs.readFileSync( path ).toString( 'utf8' );
        const fileData = JSON.parse( rawdata );
        setCurrentFileData( JSON.stringify( fileData ) );

        return fileData;
        // }
    }
};

export const getCurrentCetFileData = (): CetFile => {
    return getCurrentFileData();
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

export const updateAssent = ( data ) => {
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

export const updateBeneficiary = ( data ) => {
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
// export const updateHousing     = ( data ) => {
//     console.log( 'DATA -->', data );
//     let fileData = getCurrentFileData();
//
//     if ( data.housingLessThan2Years === undefined ) {
//         data.housingLessThan2Years = false;
//     }
//
//     if ( data.housingIsAddressBenef === undefined ) {
//         data.housingIsAddressBenef = false;
//     }
//
//     let address = {
//         address: '',
//         zipCode:  '',
//         city:     '',
//         plot:     '',
//         area:     '',
//         location: '',
//     };
//     if ( data.housingIsAddressBenef ) {
//         address = {
//             address: fileData.beneficiary.address,
//             zipCode:  fileData.beneficiary.zipCode,
//             city:     fileData.beneficiary.city,
//             plot:     '',
//             area:     '',
//             location: '',
//         };
//     }
//
//     const housing: Housing = {
//         ...fileData.housing,
//         nbOccupant:     data.nbOccupant,
//         type:           data.housingType,
//         isAddressBenef: data.housingIsAddressBenef,
//         ...address,
//         constructionYear: data.housingConstructionYear,
//         lessThan2Years:   data.housingLessThan2Years,
//     };
//
//     fileData = {
//         ...fileData,
//         housing: housing,
//     };
//
//     console.log( '%c NEW FILE DATA', 'background: #fdd835; color: #000000' );
//     console.log( fileData );
//     updateJsonData( fileData );
// };

export const getProductById = ( id: number ): Product => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.products.find( ( p: Product ) => p.id === id );
};

export const getOptionById = ( id: number ): Option => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.options.find( ( o: Option ) => o.id === id );
};

export const getBlankOptionById = ( id: number ): BlankOption => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.blankOptions.find( ( bo: BlankOption ) => bo.id === id );
};

export const getTva = (): number => {
    const fileData = getCurrentFileData();

    if ( fileData.type === FILE_PAC_RO || fileData.type === FILE_PAC_RR ) {
        return 0;
    } else {
        return +fileData.quotation.tva;
    }
};

/**
 * Retourne le palier selon les revenues et lenombre d'occupant d'un logement
 * @param stages
 * @param occupant
 * @param revenu
 */
const filterScale = ( stages, occupant, revenu ) => {
    return stages.filter( ( stage ) =>
                              Object.prototype.hasOwnProperty.call( stage, 'max' )
                              ? stage.nbr === parseFloat( occupant ) && revenu >= stage.min && revenu < stage.max
                              : stage.nbr === parseFloat( occupant ) && revenu >= stage.min,
    );
};

/**
 * Retourne le code pour le devis en cours (ig: GP, P, ...)
 */
export const getCodeBonus = () => {
    const fileData: BaseFile = getCurrentFileData();

    const totalRevenu = fileData.assents.reduce( ( a, b ) => ( b.revenu && !Number.isNaN( b.revenu ) ? a + b.revenu : a ), 0 );

    // Quand la prime est désactivé retourne 'CL'
    if ( fileData.disabledBonus ) {
        return 'CL';
    }

    const scales = fileData.scales.filter( ( scale ) => filterScale( scale.stages, fileData.housing.nbOccupant, totalRevenu ).length > 0 );
    return ( scales.length > 0 ? scales[ 0 ].code : 'CL' ).toUpperCase();
};

export const getLessThan2Year = () => {
    const fileData: BaseFile = getCurrentFileData();
    return fileData.housing.lessThan2Years;
};
