import type { OrderStatus } from "../types/order.type"

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        // REFRESH_TOKEN: '/auth/refresh-token',
        GET_USER: '/auth/me',
        USER_PROFILE: '/auth/profile',
    },
    CASHIER: {
        CREATE_ORDER: '/cashier/orders/new',
        GET_ORDERS: '/cashier/orders',
        CANCEL_ORDER: (orderId: string) => `/cashier/orders/${orderId}/cancel`,
        CURRENT_CASHIER_MENU: (menuId: string) => `/cashier/menu/current/${menuId}`,
        GET_ORDER_DETAILS: (orderId: string) => `/cashier/orders/${orderId}`,
        GET_MENU: (menuId: string) => `/cashier/menu/${menuId}`,
        GET_CATEGORIES: (menuId: string) => `/cashier/categories/${menuId}`,
        GET_ITEMS: (categoryId: string) => `/cashier/items/${categoryId}`,
    },
    CHEF: {
        GET_ORDER_QUEUE: '/chef/orders/queue',
        CLAIM_ORDER: (orderId: string) => `/chef/orders/${orderId}/claim`,
        COMPLETE_ORDER: (orderId: string) => `/chef/orders/${orderId}/complete`,
        CANCEL_ORDER: (orderId: string) => `/chef/orders/${orderId}/cancel`,
        GET_ORDER_DETAILS: (orderId: string) => `/chef/orders/${orderId}/details`,
    },
    ADMIN_DASHBOARD: {
        GET_STATS: '/admin/dashboard/stats',
        GET_REVENUE: '/admin/dashboard/revenue',
        GET_POPULAR_ITEMS: '/admin/dashboard/popular-items',
        GET_AI_INSIGHTS: '/admin/dashboard/ai-insights',
    },
    ADMIN_MENUS: {
        CREATE_MENU: '/admin/menus',
        GET_MENUS: '/admin/menus',
        GET_MENU_BY_ID: (menuId: string) => `/admin/menus/${menuId}`,
        TOGGLE_ACTIVE_MENU: (menuId: string) => `/admin/menus/${menuId}/active`,
        UPDATE_MENU: (menuId: string) => `/admin/menus/${menuId}`,
        DELETE_MENU: (menuId: string) => `/admin/menus/${menuId}`,
        // TOGGLE_AVAILABILITY: (menuId: string) => `/admin/menus/${menuId}/availability`,
    },
    ADMIN_ORDERS: {
        GET_ORDERS: '/admin/orders',
        FIND_ORDER: (orderId: string) => `/admin/orders/${orderId}`,
        UPDATE_ORDER: (orderId: string) => `/admin/orders/${orderId}`,
        CANCEL_ORDER: (orderId: string) => `/admin/orders/${orderId}/cancel`,
        OVERRIDE_ORDER: (orderId: string) => `/admin/orders/${orderId}/override`,
        FORCE_ORDER_STATUS: (orderId: string, status: OrderStatus) => `/admin/orders/${orderId}/force-status/${status}`,
        GET_ORDER_HISTORY: (orderId: string) => `/admin/orders/${orderId}/history`,
    },
} as const

// Extract nested keys from ENDPOINTS
type ExtractEndpointPaths<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends string
    ? `${Prefix}${K & string}` // Base case: direct string endpoint
    : T[K] extends (...args: any[]) => string
    ? `${Prefix}${K & string}` // Base case: function endpoint
    : ExtractEndpointPaths<T[K], `${Prefix}${K & string}.`> // Recursive case
}[keyof T]

// Generate type for endpoint keys
export type EndpointKeys = ExtractEndpointPaths<typeof ENDPOINTS>
