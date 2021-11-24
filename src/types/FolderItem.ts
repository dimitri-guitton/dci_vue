import FolderItemStatus from '@/types/FolderItemStatus';
import FolderItemType from '@/types/FolderItemType';

interface FolderItem {
    ref: string;
    prospect: boolean;
    name: string;
    total: number;
    createdAt: string;
    status: FolderItemStatus;
    deliveredAt?: string;
    type: FolderItemType;
}

export default FolderItem;
