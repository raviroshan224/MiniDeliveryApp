export interface Order {
    id: string;
    recipientName: string;
    description?: string;
    packageType?: string;
    fromLocation?: string;
    toLocation?: string;
    isSynced: boolean;
    createdWhileOffline: boolean;
    serverId?: string;
    createdAt: string;
    status: 'Pending' | 'In Transit' | 'Delivered';
}
