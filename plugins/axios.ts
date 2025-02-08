import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { useAuthStore } from '~/stores/auth.store'

declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const api: AxiosInstance = axios.create({
        baseURL: config.public.apiBaseUrl,
        withCredentials: true,
        timeout: parseInt(config.public.apiTimeout), // Use environment variable for timeout
    })

    // Request Interceptor: Attach Token
    api.interceptors.request.use(
        (request) => {
            const token = authStore.token
            if (token) {
                request.headers = request.headers || {}
                request.headers.Authorization = `Bearer ${token}`
            }
            return request
        },
        (error) => Promise.reject(error)
    )

    // Response Interceptor: Handle Errors
    api.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error) => {
            const originalRequest = error.config

            // Handle 401 Unauthorized (e.g., token expired)
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    // Attempt to refresh the token
                    await authStore.refreshToken()
                    const newToken = authStore.token

                    // Retry the original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return api(originalRequest)
                } catch (refreshError) {
                    // Logout if token refresh fails
                    await authStore.logout()
                    return Promise.reject('Session expired. Please log in again.')
                }
            }

            // Handle other errors
            return Promise.reject(error)
        }
    )

    // Inject into Nuxt
    nuxtApp.provide('api', api)
})
