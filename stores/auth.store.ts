import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookie } from '#app'

interface User {
    id: string
    name: string
    email: string
    role: string
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(useCookie('token').value || null)
    const user = ref<User | null>(null)

    // Computed
    const isAuthenticated = computed(() => !!token.value)

    // Actions
    function setToken(newToken: string) {
        token.value = newToken
        useCookie('token').value = newToken
    }

    async function refreshToken() {
        try {
            const { data } = await useNuxtApp().$api.post('/auth/refresh')
            setToken(data.token)
        } catch (error) {
            throw new Error('Failed to refresh token')
        }
    }

    async function logout() {
        token.value = null
        useCookie('token').value = null
        user.value = null
        navigateTo('/login')
    }

    return {
        token,
        user,
        isAuthenticated,
        setToken,
        refreshToken,
        logout,
    }
})
