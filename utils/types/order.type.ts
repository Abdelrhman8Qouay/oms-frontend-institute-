// src/utils/types/order.type.ts
import type { CustomerDetails } from './cashier.type'
import type { MenuItem } from './menu.type'
import type { User } from './user.type'

export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
    FAILED = 'failed',
}

export enum OrderTypes {
    DINE_IN = 'dine_in',
    TAKEAWAY = 'takeaway',
    DELIVERY = 'delivery',
}

export enum OrderActionType {
    CREATED = 'created',
    UPDATED = 'updated',
    STATUS_CHANGED = 'status_changed',
    CANCELLED = 'cancelled',
    OVERRIDDEN = 'overridden',
    FORCE_CHANGED = 'force_changed',
    // NOTE_ADDED = 'note_added',
    // PAYMENT_PROCESSED = 'payment_processed'
}

// export enum PaymentStatus {
//     PENDING = 'pending',
//     PAID = 'paid',
//     FAILED = 'failed',
//     REFUNDED = 'refunded',
//     PARTIALLY_REFUNDED = 'partially_refunded'
// }

// export enum PaymentMethod {
//     CASH = 'cash',
//     CARD = 'card',
//     MOBILE = 'mobile',
//     ONLINE = 'online'
// }

export interface OrderHistoryEntry {
    id: string
    action: OrderActionType
    adminId: string
    admin?: User
    timestamp: string
    changes?: {
        status?: {
            from: OrderStatus
            to: OrderStatus
        }
        type?: {
            from: OrderTypes
            to: OrderTypes
        }
        // payment?: {
        //     from: PaymentStatus
        //     to: PaymentStatus
        // }
    }
    forced?: boolean
    reason?: string
    notes?: string
}

export interface LastAdminAction {
    action: OrderActionType
    adminId: string
    admin?: User
    timestamp: string
}

export interface OrderHistoryResponse {
    history: OrderHistoryEntry[]
    lastAdminAction: LastAdminAction
    currentStatus: OrderStatus
}

export interface OrderItemObject {
    id: string
    name: string
    price: number
    quantity: number
    menuItem: MenuItem
    totalPrice: number
    // specialInstructions?: string
    // modifiers?: {
    //     name: string
    //     options: string[]
    // }[]
}

// export interface OrderPaymentDetails {
//     method: PaymentMethod
//     status: PaymentStatus
//     amountPaid: number
//     transactionId?: string
//     processedAt?: string
// }

export interface OrderCustomerDetails {
    name?: string
    phone?: string
    address?: string
}

export interface OrderAdminAction {
    adminId: string
    action: string
    timestamp: Date | string
}

export interface OrderOverride {
    reason: string
    adminId: string
    timestamp: Date | string
    previousStatus: OrderStatus
    newStatus?: OrderStatus
    forced?: boolean
}

export interface OrderCancellation {
    reason: string
    refundRequested?: boolean
    canceledByAdmin?: string
    timestamp: Date | string
}

export interface OrderMetadata {
    adminNotes?: string
    overrides?: OrderOverride[]
    cancellation?: OrderCancellation
    lastAdminAction?: OrderAdminAction
}

export interface OrderObject {
    id: string
    status: OrderStatus
    type: OrderTypes
    totalPrice: number
    itemsCount: number
    customerDetails: CustomerDetails
    customer?: User | null
    items: OrderItemObject[]
    // payments: OrderPaymentDetails[]
    createdAt: string
    updatedAt: string
    metadata?: OrderMetadata
    // priority?: number
    // estimatedCompletionTime?: string
    // deliveryAddress?: {
    //     street: string
    //     city: string 
    //     state: string
    //     zipCode: string
    //     country: string
    // }
    // tableNumber?: number // For dine-in orders
}