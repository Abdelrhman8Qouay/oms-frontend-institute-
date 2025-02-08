import type { MenuItem } from './menu.type'

export interface CustomerDetails {
    name?: string
    phone?: string
    address?: string
}

export interface SelectedItem extends MenuItem {
    quantity: number
    totalPrice: number
}
