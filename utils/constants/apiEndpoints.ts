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
        CREATE_ORDER: '/cashier/orders',
        CURRENT_CASHIER_MENU: (menuId: string) => `/cashier/menu/current/${menuId}`,
        GET_MENU: (menuId: string) => `/cashier/menu/${menuId}`,
        GET_CATEGORIES: (menuId: string) => `/cashier/categories/${menuId}`,
        GET_ITEMS: (categoryId: string) => `/cashier/items/${categoryId}`,
    },
    CHEF: {
        GET_ORDER_QUEUE: '/chef/orders/queue',
        CLAIM_ORDER: (orderId: string) => `/chef/orders/${orderId}/claim`,
        COMPLETE_ORDER: (orderId: string) => `/chef/orders/${orderId}/complete`,
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
        GET_MENU_BY_ID: (id: string) => `/admin/menus/${id}`,
        UPDATE_MENU: (id: string) => `/admin/menus/${id}`,
        DELETE_MENU: (id: string) => `/admin/menus/${id}`,
        TOGGLE_AVAILABILITY: (id: string) => `/admin/menus/${id}/availability`,
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
