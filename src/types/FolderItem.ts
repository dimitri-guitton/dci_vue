import FolderItemStatus from '@/types/FolderItemStatus';

interface FolderItem {
    ref: string;
    prospect: boolean;
    name: string;
    total: number;
    createdAt: string;
    status: FolderItemStatus;
    deliveredAt?: string;
}

export default FolderItem;
