export enum UserRole {
    OWNER = 'owner',
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    GHOST = 'ghost',
    CHEF = 'chef',
    CASHIER = 'cashier',
}

// Types for User Management
export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
}
