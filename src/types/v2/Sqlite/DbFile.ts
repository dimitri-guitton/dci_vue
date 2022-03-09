export interface DbFile {
    id: number;
    reference: string;
    folderName: string;
    fileTypes: string;
    customer: string;
    totalTTC: number;
    isProspect: boolean;
    isClosed: boolean;
    statusInDCI: string;
    errorsStatusInDci: string | null;
    todos: string;
    createdAt: string;
    updatedAt: string;
    sendAt: string;
}
