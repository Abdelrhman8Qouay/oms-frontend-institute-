import type { OrderObject, OrderStatus } from './order.type'
import type { UserRole } from './user.type'

export interface OrderUpdateListened {
    orderId: string
    status: OrderStatus
    order: OrderObject
    targetRole: UserRole | UserRole[]
    timestamp: string | Date
}
