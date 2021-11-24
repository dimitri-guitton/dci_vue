interface FolderItem {
    ref: string;
    prospect: boolean;
    name: string;
    total: number;
    createdAt: string;
    status: string;
    deliveredAt?: string;
}

export default FolderItem;
