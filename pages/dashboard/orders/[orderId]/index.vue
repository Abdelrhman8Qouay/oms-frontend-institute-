<template>
    <div class="admin-order-detail">
        <!-- Page Header -->
        <div class="flex justify-between items-start mb-6">
            <div>
                <NuxtLink to="/dashboard/orders" class="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                    <Icon name="chevron-left" class="w-4 h-4 mr-1" />
                    Back to Orders
                </NuxtLink>
                <div class="flex items-center mt-2">
                    <h1 class="text-2xl font-bold mr-3">
                        Order #{{ order.id }}
                    </h1>
                    <LazyDashboardOrdersOrderStatusBadge :status="order.status" show-icon />
                </div>
                <p class="text-sm text-gray-500 mt-1">
                    Created: {{ formatDateTime(order.createdAt) }}
                    <span v-if="order.createdAt !== order.updatedAt">
                        • Last updated: {{ formatDateTime(order.updatedAt) }}
                    </span>
                </p>
            </div>
            <DashboardOrdersOrderActionsDropdown :order="order" @action="handleOrderAction" />
        </div>

        <!-- Loading State -->
        <CommonLoader v-if="isLoading" />

        <!-- Error State -->
        <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
            Failed to load order: {{ error.message || "Unknown error" }}
            <button @click="fetchOrder" class="ml-2 text-blue-600 hover:text-blue-800">
                Retry
            </button>
        </div>

        <!-- Order Details -->
        <div v-else class="space-y-6">
            <!-- Order Summary Card -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium">Order Summary</h2>
                </div>
                <div class="px-6 py-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Order Type</h3>
                        <DashboardOrdersOrderTypeBadge :type="order.type" />
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                        <div v-if="order.customer">
                            <p class="text-sm">{{ order.customer.username }}</p>
                            <p class="text-sm text-gray-500">{{ order.customerDetails?.phone }}</p>
                        </div>
                        <div v-else-if="order.customerDetails.name">
                            <p class="text-sm">{{ order.customerDetails.name }}</p>
                            <p class="text-sm text-gray-500">{{ order.customerDetails?.phone }}</p>
                        </div>
                        <p v-else class="text-sm text-gray-500">Guest</p>
                    </div>
                    <!-- <div v-if="order.type === 'dine_in' && order.tableNumber">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Table Number</h3>
                        <p class="text-sm">{{ order.tableNumber }}</p>
                    </div> -->
                    <!-- <div v-if="order.type === 'delivery' && order.deliveryAddress">
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
                        <p class="text-sm">{{ order.deliveryAddress.street }}</p>
                        <p class="text-sm">
                            {{ order.deliveryAddress.city }}, {{ order.deliveryAddress.state }} {{
                                order.deliveryAddress.zipCode }}
                        </p>
                    </div> -->
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Daily Queue Number</h3>
                        <p class="text-sm">{{ order.dailyQueueNumber }} <span
                                class="text-[11px] text-gray-500">of</span> Day {{ formatDate(order.createdAt) }}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Items</h3>
                        <p class="text-sm">{{ order.itemsCount }}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 mb-2">Total Price</h3>
                        <p class="text-lg font-semibold">${{ order.totalPrice }}</p>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 class="text-lg font-medium">Order Items</h2>
                    <span class="text-sm text-gray-500">{{ order.items.length }} items</span>
                </div>
                <div class="divide-y divide-gray-200">
                    <div v-for="item in order.items" :key="item.id" class="px-6 py-4">
                        <div class="flex justify-between">
                            <div class="flex-1">
                                <h3 class="text-sm font-medium">{{ item.name }}</h3>
                                <!-- <p v-if="item.specialInstructions" class="text-xs text-gray-500 mt-1">
                                    Special instructions: {{ item.specialInstructions }}
                                </p>
                                <div v-if="item.modifiers && item.modifiers.length" class="mt-1">
                                    <div v-for="modifier in item.modifiers" :key="modifier.name"
                                        class="text-xs text-gray-600">
                                        <span class="font-medium">{{ modifier.name }}:</span>
                                        {{ modifier.options.join(', ') }}
                                    </div>
                                </div> -->
                            </div>
                            <div class="ml-4 text-right">
                                <p class="text-sm">${{ item.price }} × {{ item.quantity }}</p>
                                <p class="text-sm font-semibold">${{ item.totalPrice }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Timeline -->
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium">Order Activity</h2>
                </div>
                <div class="px-6 py-4">
                    <div class="flow-root">
                        <ul class="-mb-8">
                            <li v-for="(event, index) in order.metadata?.overrides || []" :key="index">
                                <div class="relative pb-8">
                                    <span v-if="index !== (order.metadata?.overrides?.length || 0) - 1"
                                        class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"></span>
                                    <div class="relative flex space-x-3">
                                        <div>
                                            <span :class="[
                                                'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white',
                                                event.forced ? 'bg-orange-500' : 'bg-blue-500'
                                            ]">
                                                <Icon :name="event.forced ? 'mdi:alert-triangle' : 'mdi:refresh'"
                                                    class="h-4 w-4 text-white" />
                                            </span>
                                        </div>
                                        <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p class="text-sm text-gray-500">
                                                    <span class="font-medium text-gray-900">
                                                        Status {{ event.forced ? OrderActionType.FORCE_CHANGED :
                                                            OrderActionType.STATUS_CHANGED }}
                                                    </span>
                                                    by Admin
                                                </p>
                                                <div class="mt-1 flex items-center">
                                                    <LazyDashboardOrdersOrderStatusBadge :status="event.previousStatus"
                                                        size="xs" />
                                                    <Icon name="arrow-right" class="mx-2 text-gray-400 w-3 h-3" />
                                                    <LazyDashboardOrdersOrderStatusBadge
                                                        :status="event.newStatus || event.previousStatus" size="xs" />
                                                </div>
                                                <div v-if="event.reason" class="mt-1 text-xs text-gray-600">
                                                    Reason: {{ event.reason }}
                                                </div>
                                            </div>
                                            <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                                <!-- <time :datetime="event.timestamp">
                                                    {{ formatDateTime(event.timestamp) }}
                                                </time> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <NuxtLink v-if="order.metadata?.overrides?.length" :to="`/dashboard/orders/${order.id}/history`"
                        class="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                        View full history
                        <Icon name="chevron-right" class="ml-1 w-4 h-4" />
                    </NuxtLink>
                    <p v-else class="text-sm text-gray-500 text-center py-4">
                        No activity recorded for this order
                    </p>
                </div>
            </div>

            <!-- Admin Notes -->
            <div v-if="order.metadata?.adminNotes" class="bg-white rounded-lg shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium">Admin Notes</h2>
                </div>
                <div class="px-6 py-4">
                    <p class="text-sm text-gray-700">{{ order.metadata.adminNotes }}</p>
                </div>
            </div>
        </div>

        <!-- Order Action Modals -->
        <DashboardOrdersOrderStatusModal v-if="showStatusModal" :order="order" @close="showStatusModal = false"
            @submit="updateOrderStatus" />
        <DashboardOrdersOrderCancelModal v-if="showCancelModal" :order="order" @close="showCancelModal = false"
            @submit="cancelOrder" />
        <DashboardOrdersOrderOverrideModal v-if="showOverrideModal" :order="order" @close="showOverrideModal = false"
            @submit="overrideOrder" />
    </div>
</template>

<script setup lang="ts">
import { OrderActionType, OrderStatus, OrderTypes, type OrderObject } from '~/utils/types/order.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { formatDate, formatDateTime } from '~/utils/functions/format'

definePageMeta({
    layout: 'admin',
})

const route = useRoute()
const { $api } = useNuxtApp()

const orderId = computed(() => route.params.orderId as string)

// Order data
const order = ref<OrderObject>({
    id: '',
    status: OrderStatus.PENDING,
    type: OrderTypes.DINE_IN,
    totalPrice: 0,
    dailyQueueNumber: 0,
    itemsCount: 0,
    customerDetails: {
        name: '',
        phone: '',
        address: ''
    },
    items: [],
    createdAt: '',
    updatedAt: ''
})

// UI state
const isLoading = ref(false)
const error = ref<any>(null)
const showStatusModal = ref(false)
const showCancelModal = ref(false)
const showOverrideModal = ref(false)

// Fetch order data
const fetchOrder = async () => {
    try {
        isLoading.value = true
        error.value = null

        const response = await $api.get<OrderObject>(ENDPOINTS.ADMIN_ORDERS.FIND_ORDER(orderId.value))
        order.value = response.data
    } catch (err) {
        error.value = err
        console.error('Failed to fetch order:', err)
    } finally {
        isLoading.value = false
    }
}

// Handle order actions
const handleOrderAction = (action: string) => {
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
            navigateTo(`/dashboard/orders/${orderId.value}/history`)
            break
    }
}

const updateOrderStatus = async (data: { status: string, notes?: string }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.UPDATE_ORDER(orderId.value), {
            status: data.status,
            adminNotes: data.notes
        })
        showStatusModal.value = false
        fetchOrder()
    } catch (err) {
        console.error('Failed to update order:', err)
    }
}

const cancelOrder = async (data: { reason: string, refund: boolean }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.CANCEL_ORDER(orderId.value), {
            reason: data.reason,
            refund: data.refund
        })
        showCancelModal.value = false
        fetchOrder()
    } catch (err) {
        console.error('Failed to cancel order:', err)
    }
}

const overrideOrder = async (data: { reason: string, force: boolean }) => {
    try {
        await $api.put(ENDPOINTS.ADMIN_ORDERS.OVERRIDE_ORDER(orderId.value), {
            reason: data.reason,
            force: data.force
        })
        showOverrideModal.value = false
        fetchOrder()
    } catch (err) {
        console.error('Failed to override order:', err)
    }
}

// Initial fetch
onMounted(() => {
    fetchOrder()
})
</script>

<style scoped>
.admin-order-detail {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6;
}
</style>