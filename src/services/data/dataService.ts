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
import { FILE_COMPLETE_STATUS, FILE_INCOMPLETE_STATUS, FILE_PAC_RR, FILE_PV } from '@/services/constantService';
import { BaseFile } from '@/types/v2/File/Common/BaseFile';
import { getEnergyZone } from '@/services/file/fileCommonService';
import { CombleFile } from '@/types/v2/File/Comble/CombleFile';
import { SolFile } from '@/types/v2/File/Sol/SolFile';
import { PgFile } from '@/types/v2/File/Pg/PgFile';
import { RoFile } from '@/types/v2/File/Ro/RoFile';
import { RrFile } from '@/types/v2/File/Rr/RrFile';
import { PbFile } from '@/types/v2/File/Pb/PbFile';
import { PvFile } from '@/types/v2/File/Pv/PvFile';
import { AllFile } from '@/types/v2/File/All';
import { updateErrorsStatusInDci } from '@/services/sqliteService';
import { Technician } from '@/types/v2/File/Common/Technician';

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
    currentFileData:     {
        type:    'string',
        default: '',
    },
    commercialId:        {
        type:    'number',
        default: 0,
    },
    commercialFirstName: {
        type:    'string',
        default: '',
    },
    commercialLastName:  {
        type:    'string',
        default: '',
    },
    commercialPhone:     {
        type:    'string',
        default: '',
    },
    lastUpdateFileState: { // Date de la dernière mise à jour de l'état des dossiers (todos, ...)
        type:    'number',
        default: 0,
    },
    connectedToInternet: {
        type:    'boolean',
        default: true,
    },
    oldJsonAreConverted: {
        type:    'boolean',
        default: false,
    },
} as const;

const store = new Store( { schema } );

export const getDropboxPath = (): string => {
    return ( store.get( 'dropboxPath' ) as string );
};

export const setDropboxPath = ( value: string ) => {
    store.set( 'dropboxPath', value );
};

export const getConnectedToInternet = (): boolean => {
    return ( store.get( 'connectedToInternet' ) as boolean );
};

export const setConnectedToInternet = ( value: boolean ) => {
    store.set( 'connectedToInternet', value );
};

export const getOldJsonAreConverted = (): boolean => {
    return ( store.get( 'oldJsonAreConverted' ) as boolean );
};

export const setOldJsonAreConverted = ( value: boolean ) => {
    store.set( 'oldJsonAreConverted', value );
};

export const getCurrentFileReference = () => {
    return store.get( 'currentFileReference' );
};

export const setCurrentFileReference = ( reference: string ) => {
    store.set( 'currentFileReference', reference );
};

export const getcurrentFolderName = (): string => {
    return ( store.get( 'currentFolderName' ) as string );
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

export const setCommercialInfo = ( id: number, firstName: string, lastName: string, phone: string ) => {
    store.set( 'commercialId', id );
    store.set( 'commercialFirstName', firstName );
    store.set( 'commercialLastName', lastName );
    store.set( 'commercialPhone', phone );
};

export const getLastUpdateFileState = (): string => {
    return store.get( 'lastUpdateFileState' ) as string;
};

export const setLastUpdateFileState = () => {
    const now = Math.round( new Date().getTime() / 1000 );
    store.set( 'lastUpdateFileState', now );
};

export const getCommercialInfo = (): Technician => {
    return {
        id:        store.get( 'commercialId' ) as number,
        firstName: store.get( 'commercialFirstName' ) as string,
        lastName:  store.get( 'commercialLastName' ) as string,
        phone:     store.get( 'commercialPhone' ) as string,
    };
};

export const getCurrentFileData = (): AllFile => {
    const currentFile = store.get( 'currentFileData' ) as string;
    if ( currentFile !== '' ) {
        console.log( '%c CURRENT FILE NOT EMPTY', 'background: #fdd835; color: #000000' );
        return JSON.parse( currentFile );
    } else {
        console.log( '%c CURRENT FILE EMPTY', 'background: #fdd835; color: #000000' );
        const name = getcurrentFolderName() as string;
        console.log( 'GET FILE DATA NAME -->', name );
        const path = `${ getFolderPath( name ) }/${ process.env.VUE_APP_FILENAME_DATA }.json`;
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
    return ( getCurrentFileData() as CetFile );
};

export const getCurrentPbFileData = (): PbFile => {
    return ( getCurrentFileData() as PbFile );
};

export const getCurrentPvFileData = (): PvFile => {
    return ( getCurrentFileData() as PvFile );
};

export const getCurrentPgFileData = (): PgFile => {
    return ( getCurrentFileData() as PgFile );
};

export const getCurrentRoFileData = (): RoFile => {
    return ( getCurrentFileData() as RoFile );
};

export const getCurrentRrFileData = (): RrFile => {
    return ( getCurrentFileData() as RrFile );
};

export const getCurrentCombleFileData = (): CombleFile => {
    return ( getCurrentFileData() as CombleFile );
};

export const getCurrentSolFileData = (): SolFile => {
    return ( getCurrentFileData() as SolFile );
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
export const getCodeBonus = ( fileData: BaseFile | null = null ) => {
    if ( fileData === null ) {
        fileData = getCurrentFileData();
    }

    const totalRevenu = fileData.assents.reduce( ( a, b ) => ( b.revenu && !Number.isNaN( b.revenu ) ? a + b.revenu : a ), 0 );

    // Quand la prime est désactivé retourne 'CL'
    if ( fileData.disabledBonus ) {
        return 'CL';
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const scales = fileData.scales.filter( ( scale ) => filterScale( scale.stages, fileData.housing.nbOccupant, totalRevenu ).length > 0 );
    return ( scales.length > 0 ? scales[ 0 ].code : 'CL' ).toUpperCase();
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

export const updateBeneficiary = ( data ): AllFile => {
    updateAssent( data );
    let fileData: AllFile = getCurrentFileData();

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

    let zipCode = beneficiary.zipCode;
    if ( !fileData.housing.isAddressBenef ) {
        zipCode = fileData.housing.zipCode;
    }

    fileData = {
        ...fileData,
        codeBonus:   getCodeBonus(),
        beneficiary: beneficiary,
        energyZone:  getEnergyZone( +zipCode ),
    };

    updateJsonData( fileData );

    return fileData;
};

export const getProductById = ( id: number ): Product | undefined => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.products.find( ( p: Product ) => p.id === id );
};

export const getProductByRef = ( ref: string ): Product | undefined => {
    console.log( 'Get product by ref -->', ref );
    const fileData = getCurrentFileData();

    return fileData.quotation.products.find( ( p: Product ) => p.reference === ref );
};

export const getOptionById = ( id: number ): Option | undefined => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.options.find( ( o: Option ) => o.id === id );
};

export const getBlankOptionById = ( id: number ): BlankOption | undefined => {
    const fileData = getCurrentFileData();
    console.log( 'file data', fileData );

    return fileData.quotation.blankOptions.find( ( bo: BlankOption ) => bo.id === id );
};

export const getTva = (): number => {
    const fileData = getCurrentFileData();

    if ( fileData.type === FILE_PAC_RR || fileData.type === FILE_PV ) {
        return 0;
    } else {
        return +fileData.quotation.tva;
    }
};

export const getHousingType = (): string => {
    const fileData: BaseFile = getCurrentFileData();

    return fileData.housing.type;
};

export const getLessThan2Year = () => {
    const fileData: BaseFile = getCurrentFileData();
    return fileData.housing.lessThan2Years;
};

/**
 * Retourne l'adresse selon si c'est l'adresse du bénéficiare ou du logement qui est pris en compte
 * @param data
 */
export const getAddress = ( data: BaseFile ): { address: string; zipCode: string; city: string } => {
    let address = data.housing.address;
    let zipCode = data.housing.zipCode;
    let city    = data.housing.city;

    if ( data.housing.isAddressBenef ) {
        address = data.beneficiary.address;
        zipCode = data.beneficiary.zipCode;
        city    = data.beneficiary.city;
    }

    return {
        address,
        zipCode,
        city,
    };
};

export const setErrorsStatusInDci = async ( errors: number[], folderName: string ) => {
    setcurrentFolderName( folderName );
    const fileData: BaseFile = getCurrentFileData();

    const newFileData: BaseFile = {
        ...fileData,
        errorsStatusInDci: errors,
        statusInDci:       errors.length === 0 ? FILE_COMPLETE_STATUS.code : FILE_INCOMPLETE_STATUS.code,
    };

    updateJsonData( newFileData );

    await updateErrorsStatusInDci( fileData.ref, errors );
    resetCurrentFileData();

    return fileData;
};
