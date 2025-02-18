import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '~/stores/auth.store'

declare module '#app' {
    interface NuxtApp {
        $api: AxiosInstance
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    // Create the Axios instance
    const api: AxiosInstance = axios.create({
        baseURL: config.public.apiBaseUrl,
        withCredentials: true,
        timeout: parseInt(config.public.apiTimeout),
    })

    // Request Interceptor: Attach Token
    api.interceptors.request.use(
        (request: InternalAxiosRequestConfig) => {
            const token = authStore.token // Get the current token value
            if (token) {
                request.headers = request.headers || {}
                request.headers.Authorization = `Bearer ${token}`
            }
            return request
        },
        (error) => Promise.reject(error)
    )

    // Inject the Axios instance into Nuxt
    nuxtApp.provide('api', api)
})
