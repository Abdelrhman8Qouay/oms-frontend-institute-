<template>
    <div class="admin-menus">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Show All Menus</h1>
            <NuxtLink to="/dashboard/menus/create"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Icon name="line-md:plus" class="w-4 h-4" />
                <span>Add New Menu</span>
            </NuxtLink>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg">
            Failed to load menus: {{ error || "Unknown error" }}
            <button class="flex items-center bg-transparent text-gray-500 rounded-lg"
                @click="fetchMenus()">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!safeMenus.length" class="p-8 text-center bg-gray-50 rounded-lg">
            <Icon name="mdi:receipt-text-outline" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-700">No menus found</h3>
            <p class="text-gray-500 mt-2">Create your first menu to get started</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Menu
            </button>
        </div>

        <!-- Success State -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <ul class="divide-y divide-gray-200">
                <DashboardMenuCollapsibleMenu v-for="menu in safeMenus" :key="menu.id" :menu="menu"
                    :default-open="safeMenus.length === 1" @toggle-activation="toggleActiveMenu"
                    @delete-menu="deleteMenu" />
            </ul>

            <!-- Pagination -->
            <CommonPagination :total-items="totalItems" :page-size="pageSize" v-model="currentPage"
                @page-change="fetchMenus()" @per-change="(pageSize) => handlePerPageChange(pageSize)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MenuObject } from '~/utils/types/menu.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'

definePageMeta({
    layout: 'admin',
})

const { $api } = useNuxtApp()

// Type-safe computed for menus
const safeMenus = computed<MenuObject[]>(() => {
    return menus.value || []
})

// =========================================== Pagination state
const currentPage = ref(1)
const pageSize = ref(5)
const totalItems = ref(0)

const handlePerPageChange = (size: number) => {
    pageSize.value = size
    fetchMenus()
}

// =========================================== Data
const menus = ref<MenuObject[]>([])
const isLoading = ref(false)
const error = ref<any>(null)

// =========================================== Menu Requests
const fetchMenus = async () => {
    try {
        isLoading.value = true
        error.value = null

        const params = {
            limit: pageSize.value,
            offset: (currentPage.value - 1) * pageSize.value
        }

        const response = await $api.get(ENDPOINTS.ADMIN_MENUS.GET_MENUS, { params })
        menus.value = response.data.data
        totalItems.value = response.data.meta.total
    } catch (err) {
        error.value = err
        console.error('Failed to fetch menus:', err)
    } finally {
        isLoading.value = false
    }
}

const toggleActiveMenu = async (menuId: string) => {
    try {
        const response = await $api.put(ENDPOINTS.ADMIN_MENUS.TOGGLE_ACTIVE_MENU(menuId))

        fetchMenus()
    } catch (err) {
        error.value = err
        console.error('Failed to toggle active menu:', err)
    }
}

const deleteMenu = async (menuId: string) => {
    try {
        const response = await $api.delete(ENDPOINTS.ADMIN_MENUS.DELETE_MENU(menuId))

        fetchMenus()
    } catch (err) {
        error.value = err
        console.error('Failed to toggle active menu:', err)
    }
}

onMounted(() => {
    fetchMenus()
})

</script>

<style scoped>
.admin-menus {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6;
}

/* Transition for collapsible sections */
.collapse-transition {
    transition: all 0.2s ease-in-out;
    overflow: hidden;
}
</style>