import { DatatableFileType } from '@/types/v2/DatatableFile/DatatableFileType';
import { DatatableFileStatus } from '@/types/v2/DatatableFile/DatatableFileStatus';
import { DbFileTodo } from '@/types/v2/Sqlite/DbFileTodo';

export interface DatatableFile {
    id: number;
    reference: string;
    folderName: string;
    types: DatatableFileType[];
    customer: string;
    totalTTC: number;
    isProspect: boolean;
    isClosed: boolean;
    status: DatatableFileStatus;
    todos: DbFileTodo[];
    errors: number[];
    createdAt: string;
    updatedAt: string;
    sendAt: string;
}
