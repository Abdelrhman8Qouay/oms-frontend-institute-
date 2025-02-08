export interface MenuObject {
    id?: string
    name?: string
    description?: string
    restaurantId?: string | number
    isActive?: boolean
    createdAt?: string | Date
    updatedAt?: string | Date
    categories?: Array<MenuCategory>
}

export interface MenuCategory {
    id?: string
    name?: string
    menuId?: string
    displayOrder?: number
    isActive?: boolean
    createdAt?: string | Date
    updatedAt?: string | Date
    items?: Array<MenuItem>
}

export interface MenuItem {
    id: string
    name: string
    price: number
    description?: string
    categoryId: string
    isAvailable: boolean
    preparationTime?: number
    customization?: {
        options?: {
            name: string
            choices: string[]
            price?: number
        }[]
        allergens?: string[]
        dietary?: string[]
    }
}
