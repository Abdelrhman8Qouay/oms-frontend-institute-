import type { CustomerDetails } from './cashier.type'
import type { MenuItem } from './menu.type'

// src\common\enums\order.enum.ts
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

export enum OrderSortBy {
    PRIORITY = 'priority',
    PRICE = 'price',
    TYPE = 'type',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
    ITEMS_COUNT = 'items_count',
}

export interface OrderObject {
    id: string
    status: OrderStatus
    type: OrderTypes
    totalPrice: number
    itemsCount: number
    customerDetails: CustomerDetails
    customer: any | null
    items: any[]
    createdAt: string | Date
    updatedAt: string | Date
}

export interface OrderItemObject {
    name: string
    price: number
    quantity: number
    menuItem: MenuItem
    order?: any
    totalPrice: number
}
