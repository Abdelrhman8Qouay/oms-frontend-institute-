import { OrderActionType, OrderStatus, OrderTypes } from "../types/order.type"

// Formatting functions
export function formatStatus(status: OrderStatus) {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

export function formatType(type: OrderTypes) {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

// Badge classes
export function statusBadgeClass(status: OrderStatus) {
    const base = 'px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full'
    switch (status) {
        case OrderStatus.IN_PROGRESS:
            return `${base} bg-blue-100 text-blue-800`
        case OrderStatus.COMPLETED:
            return `${base} bg-green-100 text-green-800`
        case OrderStatus.PENDING:
            return `${base} bg-yellow-100 text-yellow-800`
        case OrderStatus.DELIVERED:
            return `${base} bg-purple-100 text-purple-800`
        case OrderStatus.CANCELED:
            return `${base} bg-zinc-100 text-zinc-800`
        case OrderStatus.FAILED:
            return `${base} bg-rose-100 text-rose-800`
        default:
            return `${base} bg-cyan-100 text-cyan-800`
    }
}

export function typeBadgeClass(type: OrderTypes) {
    const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
    switch (type) {
        case OrderTypes.DELIVERY:
            return `${base} bg-purple-100 text-purple-800`
        case OrderTypes.DINE_IN:
            return `${base} bg-indigo-100 text-indigo-800`
        case OrderTypes.TAKEAWAY:
            return `${base} bg-red-100 text-indigo-800`
        default:
            return `${base} bg-gray-100 text-gray-800`
    }
}


// =================================== Formatting (Order Actions)
export function eventIcon(action: OrderActionType) {
    const icons = {
        created: { icon: 'plus', bg: 'bg-green-500' },
        updated: { icon: 'edit', bg: 'bg-blue-500' },
        status_changed: { icon: 'refresh', bg: 'bg-purple-500' },
        cancelled: { icon: 'x', bg: 'bg-red-500' },
        overridden: { icon: 'alert-circle', bg: 'bg-yellow-500' },
        force_changed: { icon: 'alert-triangle', bg: 'bg-orange-500' },
        note_added: { icon: 'file-text', bg: 'bg-indigo-500' },
        payment_processed: { icon: 'credit-card', bg: 'bg-teal-500' }
    }
    return icons[action] || { icon: 'info', bg: 'bg-gray-500' }
}

export function formatAction(action: OrderActionType) {
    const actionMap = {
        created: 'Order created',
        updated: 'Order updated',
        status_changed: 'Status changed',
        cancelled: 'Order cancelled',
        overridden: 'Order overridden',
        force_changed: 'Status forced',
        note_added: 'Note added',
        payment_processed: 'Payment processed'
    }
    return actionMap[action] || action.replace('_', ' ')
}
