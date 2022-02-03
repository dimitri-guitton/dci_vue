import FileItemStatus from '@/types/FileItem/FileItemStatus';
import FileItemType from '@/types/FileItem/FileItemType';

interface Filetem {
    id: number;
    reference: string;
    folderName: string;
    types: FileItemType[];
    customer: string;
    totalTTC: number;
    isProspect: boolean;
    isClosed: boolean;
    status: FileItemStatus;
    todos: string;
    createdAt: string;
    updatedAt: string;
    sendAt: string;
}

export default Filetem;
