import { DatatableFileType } from '@/types/v2/DatatableFile/DatatableFileType';
import { DatatableFile } from '@/types/v2/DatatableFile/DatatableFile';

export const datatableFileTypesToString = ( types: DatatableFileType[] ): string => {
    console.log( 'TYPES', types );
    let allType = '';
    types.forEach( ( type ) => {
        if ( allType === '' ) {
            allType = type.name;
        } else {
            allType += `, ${ type.name }`;
        }
    } );

    return allType;
};

export const datatableFileHasType = ( item: DatatableFile, search: string ): boolean => {
    return item.types.find( type => type.slug === search ) !== undefined;
};
