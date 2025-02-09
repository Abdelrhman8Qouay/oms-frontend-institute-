import { useNuxtApp } from '#app'
import { useAxios } from '@vueuse/integrations/useAxios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ShallowRef, Ref } from 'vue'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import type { MenuObject } from '~/utils/types/menu.type'

export interface FetchAxiosOptionsWithInitialData {
    abortPrevious?: boolean | undefined
    immediate?: boolean | undefined
    initialData: any
    onBefore?: (() => void) | undefined
    onError?: ((e: unknown) => void) | undefined
    onFinish?: ((e: unknown) => void) | undefined
    onSuccess?: ((e: unknown) => void) | undefined
    resetOnExecute?: boolean | undefined
    shallow?: boolean | undefined
}

interface FetchApiAxios<T = any> {
    response: ShallowRef<AxiosResponse<T> | undefined>
    data: Ref<T | null>
    isFinished: Ref<boolean>
    isLoading: Ref<boolean>
    isAborted: Ref<boolean>
    error: ShallowRef<unknown | undefined>
    abort: (message?: string) => void
    cancel: (message?: string) => void
    isCanceled: Ref<boolean>
    execute: (urlOverride?: string, config?: AxiosRequestConfig) => Promise<any>
}

export const useApi = () => {
    const { $api } = useNuxtApp() as { $api: AxiosInstance } // Access Axios from plugin

    const fetchApi = async <T = any>(
        endpoint: string | ((...args: any[]) => string),
        options: AxiosRequestConfig = {},
        axiosOptions: FetchAxiosOptionsWithInitialData = {
            initialData: {} as T,
        }
    ): Promise<FetchApiAxios<T>> => {
        const url = typeof endpoint === 'function' ? endpoint() : endpoint

        const { onBefore, ...rest } = axiosOptions

        const axiosInstance = useAxios<T>(url, { ...options }, $api, rest as any)

        return {
            response: axiosInstance.response,
            data: axiosInstance.data,
            isFinished: axiosInstance.isFinished,
            isLoading: axiosInstance.isLoading,
            isAborted: axiosInstance.isAborted,
            error: axiosInstance.error,
            abort: axiosInstance.abort,
            cancel: axiosInstance.cancel,
            isCanceled: axiosInstance.isCanceled,
            execute: async (urlOverride?: string, config?: AxiosRequestConfig) => {
                // Call onBefore hook before executing the request
                if (onBefore) {
                    try {
                        onBefore()
                    } catch (error) {
                        console.error('Error in onBefore hook:', error)
                    }
                }

                return await axiosInstance.execute(urlOverride || url, { ...options, ...config })
            },
        }
    }

    return {
        auth: {
            login: (data: any, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.AUTH.LOGIN, { method: 'POST', data, ...options }, axiosOptions),

            register: (data: any, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi(ENDPOINTS.AUTH.REGISTER, { method: 'POST', data, ...options }, axiosOptions),

            logout: (options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.AUTH.LOGOUT, { method: 'POST', ...options }, axiosOptions),

            getProfile: (options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.AUTH.USER_PROFILE, options, axiosOptions),
        },
        cashier: {
            createOrder: (orderData: any, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi(ENDPOINTS.CASHIER.CREATE_ORDER, { method: 'POST', data: orderData, ...options }, axiosOptions),

            getCurrentMenu: <T = MenuObject>(menuId: string, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi<T>(ENDPOINTS.CASHIER.CURRENT_CASHIER_MENU(menuId), options, axiosOptions),
        },
        chef: {
            getOrderQueue: () => useAxios(ENDPOINTS.CHEF.GET_ORDER_QUEUE, { method: 'GET' }, $api),
            claimOrder: (orderId: string) => useAxios(ENDPOINTS.CHEF.CLAIM_ORDER(orderId), { method: 'POST' }, $api),
            completeOrder: (orderId: string) => useAxios(ENDPOINTS.CHEF.COMPLETE_ORDER(orderId), { method: 'POST' }, $api),
            getOrderDetails: (orderId: string) => useAxios(ENDPOINTS.CHEF.GET_ORDER_DETAILS(orderId), { method: 'GET' }, $api),
        },
        admin: {
            getStats: (options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.ADMIN_DASHBOARD.GET_STATS, options, axiosOptions),

            getMenus: (options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.ADMIN_MENUS.GET_MENUS, options, axiosOptions),

            getMenuById: (id: string, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) => fetchApi(ENDPOINTS.ADMIN_MENUS.GET_MENU_BY_ID(id), options, axiosOptions),

            createMenu: (data: any, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi(ENDPOINTS.ADMIN_MENUS.CREATE_MENU, { method: 'POST', data, ...options }, axiosOptions),

            updateMenu: (id: string, data: any, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi(ENDPOINTS.ADMIN_MENUS.UPDATE_MENU(id), { method: 'PUT', data, ...options }, axiosOptions),

            deleteMenu: (id: string, options?: AxiosRequestConfig, axiosOptions?: FetchAxiosOptionsWithInitialData) =>
                fetchApi(ENDPOINTS.ADMIN_MENUS.DELETE_MENU(id), { method: 'DELETE', ...options }, axiosOptions),
        },
    }
}
