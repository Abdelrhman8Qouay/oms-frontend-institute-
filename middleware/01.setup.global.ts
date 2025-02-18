// middleware/01.setup.global.ts
import { defineNuxtRouteMiddleware } from '#app'
import { useAuthStore } from '~/stores/auth.store'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { type User } from '~/utils/types/user.type'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $api } = useNuxtApp()
    const authStore = useAuthStore()
    const errPrefix = 'App Setup:'

    // Fetch user details if authenticated
    if (authStore.isAuthenticated) {
        try {
            // Call the API to fetch the user profile
            const { data } = await $api.get(ENDPOINTS.AUTH.GET_USER)

            if (!data) {
                console.error(errPrefix, 'Fetch User: empty user details got')
            }

            // Update the user in the auth store
            authStore.setUser((data as User) || null)
        } catch (error) {
            console.error('Failed to fetch user details:', error)
            authStore.logout() // Log out the user if the request fails
        }
    }

    // Optional: Log route access for debugging
    console.log(`Navigating from ${from.path} to ${to.path}`)
})
