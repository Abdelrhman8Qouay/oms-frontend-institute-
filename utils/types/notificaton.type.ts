// Types for Notifications
export enum NotificationTypes {
    ORDER = 'order',
    SYSTEM = 'system',
    ALERT = 'alert',
}

export interface Notification {
    id: string
    message: string
    type: NotificationTypes
    read: boolean
    createdAt: Date
}
