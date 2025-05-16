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
        <div v-else class="bg-white rounded-lg shadow">
            <div>
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
                                {{ orderIdFormat(order.id) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ order.customer?.username || 'Guest' }}
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
                                ${{ fixedFraction(order.totalPrice, 2) || '0.00' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(order.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <NuxtLink :to="`/dashboard/orders/${order.id}`"
                                    class="text-blue-600 hover:text-blue-900 mr-3">
                                    View
                                </NuxtLink>
                                <CommonDropdown title="Actions" icon="mdi:chevron-down">
                                    <button
                                        v-for="([btn, action], index) in [['Update Status', 'update'], ['Force Status', 'force'], ['Cancel Order', 'cancel'], ['Override', 'override'], ['View History', 'history']]"
                                        :key="index" @click.prevent="handleOrderAction(action, order)"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                        {{ btn }}
                                    </button>
                                </CommonDropdown>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <CommonPagination :total-items="totalItems" :page-size="pageSize" v-model="currentPage"
                @page-change="fetchOrders()" @per-change="(pageSize) => handlePerPageChange(pageSize)" />
        </div>

        <!-- Order Action Modals -->
        <DashboardOrdersStatusUpdateModal v-if="showUpdateModal" :order="selectedOrder" @close="showUpdateModal = false"
            @submit="updateOrderStatus" />
        <DashboardOrdersStatusForceModal v-if="showForceModal" :order="selectedOrder" @close="showForceModal = false"
            @submit="forceOrderStatus" />
        <DashboardOrdersCancelModal v-if="showCancelModal" :order="selectedOrder" @close="showCancelModal = false"
            @submit="cancelOrder" />
        <DashboardOrdersOverrideModal v-if="showOverrideModal" :order="selectedOrder" @close="showOverrideModal = false"
            @submit="overrideOrder" />
    </div>
</template>

<script setup lang="ts">
import { OrderStatus, OrderTypes, type OrderObject } from '~/utils/types/order.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { fixedFraction, formatDate, orderIdFormat } from '~/utils/functions/format'
import { formatStatus, formatType, statusBadgeClass, typeBadgeClass } from '~/utils/functions/orders'

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

const handlePerPageChange = (size: number) => {
    pageSize.value = size
    fetchOrders()
}

// Data
const orders = ref<OrderObject[]>([])
// const stats = ref<any>(null)
// const isStatsLoading = ref(false)
const isLoading = ref(false)
const error = ref<any>(null)

// Modal states
const showUpdateModal = ref(false)
const showForceModal = ref(false)
const showCancelModal = ref(false)
const showOverrideModal = ref(false)
const selectedOrder = ref<any>(null)


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
        totalItems.value = response.data.meta.total
    } catch (err) {
        error.value = err
        console.error('Failed to fetch orders:', err)
    } finally {
        isLoading.value = false
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


// Order actions
const handleOrderAction = (action: string, order: any) => {
    selectedOrder.value = order
    switch (action) {
        case 'update':
            showUpdateModal.value = true
            break
        case 'force':
            showForceModal.value = true
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
        showUpdateModal.value = false
        fetchOrders()
    } catch (err) {
        console.error('Failed to update order:', err)
    }
}

const forceOrderStatus = async (data: { status: OrderStatus, reason: string, force: boolean }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.FORCE_ORDER_STATUS(selectedOrder.value.id, data.status), {
            reason: data.reason,
            force: data.force
        })
        showForceModal.value = false
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