<template>
    <div class="admin-orders">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Orders Management</h1>
            <!-- <div class="flex items-center space-x-4">
                <OrderStatsWidget :stats="stats" :loading="isStatsLoading" />
            </div> -->
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="filters.status" class="w-full rounded-md border-gray-300 shadow-sm">
                        <option :value="undefined">All Statuses</option>
                        <option v-for="status in orderStatuses" :key="status" :value="status">
                            {{ formatStatus(status) }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select v-model="filters.type" class="w-full rounded-md border-gray-300 shadow-sm">
                        <option :value="undefined">All Types</option>
                        <option v-for="type in orderTypes" :key="type" :value="type">
                            {{ formatType(type) }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input v-model="filters.fromDate" type="date" class="w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input v-model="filters.toDate" type="date" class="w-full rounded-md border-gray-300 shadow-sm">
                </div>
                <div class="flex items-end">
                    <label class="inline-flex items-center">
                        <input v-model="filters.includeCanceled" type="checkbox"
                            class="rounded border-gray-300 text-blue-600 shadow-sm">
                        <span class="ml-2 text-sm text-gray-700">Include Canceled</span>
                    </label>
                </div>
                <div class="flex items-end">
                    <button @click="applyFilters"
                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Apply
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <CommonLoader v-if="isLoading" />

        <!-- Error State -->
        <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
            Failed to load orders: {{ error.message || "Unknown error" }}
            <button @click="fetchOrders" class="ml-2 text-blue-600 hover:text-blue-800">
                Retry
            </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!orders.length" class="p-8 text-center bg-gray-50 rounded-lg">
            <Icon name="mdi:receipt-text-outline" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 class="text-lg font-medium text-gray-700">No orders found</h3>
            <p class="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>

        <!-- Orders Table -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{{ order.id.slice(0, 8) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ order.customerName || 'Guest' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span :class="typeBadgeClass(order.type)">
                                    {{ formatType(order.type) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span :class="statusBadgeClass(order.status)">
                                    {{ formatStatus(order.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${{ order.totalAmount?.toFixed(2) || '0.00' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(order.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <NuxtLink :to="`/dashboard/orders/${order.id}`"
                                    class="text-blue-600 hover:text-blue-900 mr-3">
                                    View
                                </NuxtLink>
                                <DashboardOrdersOrderActionsDropdown :order="order" @update="handleOrderAction" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div class="flex-1 flex justify-between sm:hidden">
                    <button :disabled="currentPage === 1" @click="prevPage"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Previous
                    </button>
                    <button :disabled="currentPage >= totalPages" @click="nextPage"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button :disabled="currentPage === 1" @click="prevPage"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">Previous</span>
                                <Icon name="mdi:chevron-left" class="h-5 w-5" />
                            </button>
                            <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="{
                                'z-10 bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                            }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                {{ page }}
                            </button>
                            <button :disabled="currentPage >= totalPages" @click="nextPage"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">Next</span>
                                <Icon name="mdi:chevron-right" class="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Action Modals -->
        <DashboardOrdersOrderStatusModal v-if="showStatusModal" :order="selectedOrder" @close="showStatusModal = false"
            @submit="updateOrderStatus" />
        <DashboardOrdersOrderCancelModal v-if="showCancelModal" :order="selectedOrder" @close="showCancelModal = false"
            @submit="cancelOrder" />
        <DashboardOrdersOrderOverrideModal v-if="showOverrideModal" :order="selectedOrder"
            @close="showOverrideModal = false" @submit="overrideOrder" />
    </div>
</template>

<script setup lang="ts">
import { OrderStatus, OrderTypes } from '~/utils/types/order.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'

definePageMeta({
    layout: 'admin',
})

const { $api } = useNuxtApp()

// Order status and type options
const orderStatuses = Object.values(OrderStatus)
const orderTypes = Object.values(OrderTypes)

// Filters
const filters = reactive({
    status: undefined as OrderStatus | undefined,
    type: undefined as OrderTypes | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
    includeCanceled: false
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// Data
const orders = ref<any[]>([])
// const stats = ref<any>(null)
// const isStatsLoading = ref(false)
const isLoading = ref(false)
const error = ref<any>(null)

// Modal states
const showStatusModal = ref(false)
const showCancelModal = ref(false)
const showOverrideModal = ref(false)
const selectedOrder = ref<any>(null)

// Formatting functions
const formatStatus = (status: OrderStatus) => {
    return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

const formatType = (type: OrderTypes) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
}

// Badge classes
const statusBadgeClass = (status: OrderStatus) => {
    const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
    switch (status) {
        case OrderStatus.COMPLETED:
            return `${base} bg-green-100 text-green-800`
        case OrderStatus.CANCELED:
            return `${base} bg-red-100 text-red-800`
        case OrderStatus.PENDING:
            return `${base} bg-yellow-100 text-yellow-800`
        default:
            return `${base} bg-blue-100 text-blue-800`
    }
}

const typeBadgeClass = (type: OrderTypes) => {
    const base = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
    switch (type) {
        case OrderTypes.DELIVERY:
            return `${base} bg-purple-100 text-purple-800`
        case OrderTypes.DINE_IN:
            return `${base} bg-indigo-100 text-indigo-800`
        case OrderTypes.TAKEAWAY:
            return `${base} bg-red-100 text-indigo-800`
        default:
            return `${base} bg-gray-100 text-gray-800`
    }
}

// Fetch orders
const fetchOrders = async () => {
    try {
        isLoading.value = true
        error.value = null

        const params = {
            ...Object.entries(filters)
                .filter(([key, value]) =>
                    value !== undefined && value !== null && value !== ''
                )
                .reduce((acc, [key, value]) => {
                    acc[key] = value
                    return acc
                }, {} as Record<string, unknown>),
            limit: pageSize.value,
            offset: (currentPage.value - 1) * pageSize.value
        }

        const response = await $api.get(ENDPOINTS.ADMIN_ORDERS.GET_ORDERS, { params })
        orders.value = response.data.data
        totalItems.value = response.headers['x-total-count'] || response.data.length
    } catch (err) {
        error.value = err
        console.error('Failed to fetch orders:', err)
    } finally {
        isLoading.value = false
        console.log(orders.value)
    }
}

// Fetch statistics
// const fetchStatistics = async () => {
//     try {
//         isStatsLoading.value = true
//         const response = await $api.get(ENDPOINTS.ADMIN_ORDERS.GET_STATISTICS, { params: filters })
//         stats.value = response.data
//     } catch (err) {
//         console.error('Failed to fetch statistics:', err)
//     } finally {
//         isStatsLoading.value = false
//     }
// }

// Apply filters
const applyFilters = () => {
    currentPage.value = 1
    fetchOrders()
    // fetchStatistics()
}

// Pagination controls
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const visiblePages = computed(() => {
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

// Order actions
const handleOrderAction = (action: string, order: any) => {
    selectedOrder.value = order
    switch (action) {
        case 'update':
            showStatusModal.value = true
            break
        case 'cancel':
            showCancelModal.value = true
            break
        case 'override':
            showOverrideModal.value = true
            break
        case 'history':
            navigateTo(`/dashboard/orders/${order.id}/history`)
            break
    }
}

const updateOrderStatus = async (data: { status: OrderStatus, notes?: string }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.UPDATE_ORDER(selectedOrder.value.id), {
            status: data.status,
            adminNotes: data.notes
        })
        showStatusModal.value = false
        fetchOrders()
    } catch (err) {
        console.error('Failed to update order:', err)
    }
}

const cancelOrder = async (data: { reason: string, refund: boolean }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.CANCEL_ORDER(selectedOrder.value.id), {
            reason: data.reason,
            refund: data.refund
        })
        showCancelModal.value = false
        fetchOrders()
    } catch (err) {
        console.error('Failed to cancel order:', err)
    }
}

const overrideOrder = async (data: { reason: string, force: boolean }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.OVERRIDE_ORDER(selectedOrder.value.id), {
            reason: data.reason,
            force: data.force
        })
        showOverrideModal.value = false
        fetchOrders()
    } catch (err) {
        console.error('Failed to override order:', err)
    }
}

// Initial fetch
onMounted(() => {
    fetchOrders()
    // fetchStatistics()
})

// Watch for pagination changes
watch(currentPage, () => {
    fetchOrders()
})
</script>

<style scoped>
.admin-orders {
    @apply px-4 py-6 sm:px-6 lg:px-8;
}
</style>