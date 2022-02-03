import FileItemType from '@/types/FileItem/FileItemType';
import Filetem from '@/types/FileItem/Filetem';

export const fileItemTypesToString = ( types: FileItemType[] ): string => {
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

export const fileItemHasType = ( item: Filetem, search: string ): boolean => {
    return item.types.find( type => type.slug === search ) !== undefined;
};
