import { defineStore } from 'pinia'
import { UserRole, type User } from '~/utils/types/user.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { useAxios } from '@vueuse/integrations/useAxios.mjs'
import type { AxiosInstance } from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const { $api } = useNuxtApp()

    // State
    const token = ref<string | null>(null)
    const user = ref<User | null>(null)
    const tokenExpiry = ref<string | null>(null)

    // Initialize cookies
    const tokenCookie = useCookie<string | null>('token', { default: () => null })
    const tokenExpiryCookie = useCookie<string | null>('tokenExpiry', { default: () => null })

    // Sync state with cookies
    token.value = tokenCookie.value
    tokenExpiry.value = tokenExpiryCookie.value

    // Computed
    const isAuthenticated = computed(() => !!token.value)
    const isChef = computed(() => user.value?.role === UserRole.CHEF)
    const isCashier = computed(() => user.value?.role === UserRole.CASHIER)
    const isAdmin = computed(() => user.value?.role === UserRole.ADMIN)

    // Actions
    function setToken(newToken: string, expiresIn: number = 3600) {
        token.value = newToken
        tokenCookie.value = newToken

        // Set token expiry
        const expiryDate = new Date(Date.now() + expiresIn * 1000).toISOString()
        tokenExpiry.value = expiryDate
        tokenExpiryCookie.value = expiryDate
    }

    function setUser(newUser: User | any) {
        user.value = newUser
    }

    async function logout(to: 'staff' | 'dashboard' = 'staff', axiosInstance?: AxiosInstance) {
        const instance = $api || axiosInstance
        try {
            if (!instance) {
                throw new Error('Auth Store Error: No Axios Instance in logout')
            }

            await useAxios(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' }, instance)

            // Clear state and cookies
            token.value = null
            tokenCookie.value = null
            tokenExpiry.value = null
            tokenExpiryCookie.value = null
            user.value = null

            // Redirect to login page
            return navigateTo(`/auth/${to}/login`)
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    return {
        token,
        user,
        tokenExpiry,
        isAuthenticated,
        isChef,
        isCashier,
        isAdmin,
        setToken,
        setUser,
        logout,
    }
})
