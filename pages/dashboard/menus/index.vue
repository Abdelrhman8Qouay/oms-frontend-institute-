<template>
    <div class="admin-menus">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Show All Menus</h1>
            <NuxtLink to="dashboard/menus/create"
                class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Icon name="plus" class="w-4 h-4" />
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
            <button class="flex items-center bg-transparent text-gray-500 rounded-lg" @click="execute()">Retry</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!safeMenus.length" class="p-8 text-center bg-gray-50 rounded-lg">
            <Icon name="menu" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
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
                    :default-open="safeMenus.length === 1" />
            </ul>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        @click="currentPage--">
                        Previous
                    </button>
                    <button :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        @click="currentPage++">
                        Next
                    </button>
                </div>
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-700">
                            Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                            to <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span>
                            of <span class="font-medium">{{ totalItems }}</span> results
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                @click="currentPage--">
                                <span class="sr-only">Previous</span>
                                <Icon name="chevron-left" class="h-5 w-5" />
                            </button>
                            <button v-for="page in visiblePages" :key="page" :class="{
                                'z-10 bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                            }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                @click="currentPage = page">
                                {{ page }}
                            </button>
                            <button :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                @click="currentPage++">
                                <span class="sr-only">Next</span>
                                <Icon name="chevron-right" class="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { MenuObject } from '~/utils/types/menu.type'
import { useAxios } from '@vueuse/integrations/useAxios'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'

definePageMeta({
    layout: 'admin',
})

const { $api } = useNuxtApp()

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// Calculate visible pages for pagination (max 5 pages shown)
const visiblePages = computed(() => {
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages.value, start + maxVisible - 1)

    // Adjust start if we're at the end
    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Ensure page and limit are valid numbers
const getValidatedParams = () => {
    const page = Math.max(1, Number(currentPage.value)) || 1
    const limit = Math.max(1, Number(pageSize.value)) || 10

    return {
        page: page,
        limit: limit
    }
}

// Fetch menus data with proper typing
const {
    data: menus,
    error,
    isLoading,
    execute
} = useAxios<MenuObject[]>(
    ENDPOINTS.ADMIN_MENUS.GET_MENUS,
    {
        method: 'GET',
        // Use a function to return fresh params each time
        params: getValidatedParams()
    },
    $api,
    {
        initialData: [] as MenuObject[],
        onSuccess: (data) => {
            console.log(data)
            // Assuming your API returns data in format: { data: MenuObject[], total: number }
            totalItems.value = data.length || 0
            menus.value = data
        },
        onError: (err) => {
            console.error('Failed to fetch menus:', err)
            totalItems.value = 0
        }
    }
)

// Watch for pagination changes
watch([currentPage, pageSize], () => {
    execute()
}, { immediate: true })

// Type-safe computed for menus
const safeMenus = computed<MenuObject[]>(() => {
    return menus.value || []
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