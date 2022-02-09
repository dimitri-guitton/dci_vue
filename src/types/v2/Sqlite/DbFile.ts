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
    todos: string;
    createdAt: string;
    updatedAt: string;
    sendAt: string;
}
