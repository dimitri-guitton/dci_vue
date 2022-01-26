import FolderItemType from '@/types/Folder/FolderItemType';
import FolderItem from '@/types/Folder/FolderItem';

export const folderTypesToString = ( types: FolderItemType[] ): string => {
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

export const folderItemHasType = ( item: FolderItem, search: string ): boolean => {
    return item.types.find( type => type.slug === search ) !== undefined;
};
