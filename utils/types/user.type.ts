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
    id?: string
    username: string
    email: string
    isEmailVerified: boolean
    emailVerificationToken?: string
    password?: string
    role: UserRole
    isActive?: boolean
    lastLogin?: Date | string
    fullName?: string
    createdAt: Date | string
    updatedAt: Date | string
}
