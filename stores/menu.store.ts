import { defineStore } from 'pinia'
import { useCache } from '~/composables/useCache'
import type { MenuObject } from '~/utils/types/menu.type'
import { v4 as uuidv4 } from 'uuid'

const generateUUID = () => uuidv4()

export const useMenuStore = defineStore('menu', () => {
    // Cache keys for different users/pages
    const cacheKeys = {
        cashier: 'menu_cashier',
        adminHome: 'menu_admin_home',
        adminMenus: 'menu_admin_menus',
    }

    // Cache for different menu data based on page context
    const menuCache = {
        cashier: useCache<MenuObject>({ key: cacheKeys.cashier, defaultValue: {}, storageType: 'memory', ttl: 60 * 5 }),
        adminHome: useCache<MenuObject[]>({ key: cacheKeys.adminHome, defaultValue: [], storageType: 'memory', ttl: 60 * 10 }),
        adminMenus: useCache<MenuObject[]>({ key: cacheKeys.adminMenus, defaultValue: [], storageType: 'memory', ttl: 60 * 15 }),
    }

    // Cache for menuId (shared across pages)
    const menuIdCache = {
        cashier: useCache<string>({ key: cacheKeys.cashier + '_id', defaultValue: generateUUID(), storageType: 'local' }),
        adminHome: useCache<string>({ key: cacheKeys.adminHome + '_id', defaultValue: generateUUID(), storageType: 'local' }),
        adminMenus: useCache<string>({ key: cacheKeys.adminMenus + '_id', defaultValue: generateUUID(), storageType: 'local' }),
    }

    return {
        cacheKeys,
        menuCache,
        menuIdCache,
    }
})
