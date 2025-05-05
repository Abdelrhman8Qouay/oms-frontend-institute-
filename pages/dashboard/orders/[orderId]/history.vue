<template>
    <div class="admin-order-history">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <NuxtLink to="/dashboard/orders" class="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                    <Icon name="chevron-left" class="w-4 h-4 mr-1" />
                    Back to Orders
                </NuxtLink>
                <div class="flex items-center mt-2">
                    <h1 class="text-2xl font-bold mr-3">
                        Order {{ orderIdFormat(orderId) }} History
                    </h1>
                    <OrderStatusBadge :status="currentStatus" show-icon />
                </div>
            </div>
            <div v-if="lastAction" class="text-sm text-gray-500">
                <p>Last action: <span class="font-medium">{{ formatAction(lastAction.action) }}</span></p>
                <p>By: <span class="font-medium">{{ lastAction.admin?.username || 'Admin' }}</span></p>
                <p>{{ formatDateTime(lastAction.timestamp) }}</p>
            </div>
        </div>

        <!-- Loading State -->
        <CommonLoader v-if="isLoading" />

        <!-- Error State -->
        <div v-else-if="error" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
            Failed to load order history: {{ error.message || "Unknown error" }}
            <button @click="fetchHistory" class="ml-2 text-blue-600 hover:text-blue-800">
                Retry
            </button>
        </div>

        <!-- Timeline -->
        <div v-else class="bg-white rounded-lg shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium">Order Activity Timeline</h2>
                <p class="text-sm text-gray-500 mt-1">All actions performed on this order</p>
            </div>

            <div class="px-6 py-4">
                <div class="flow-root">
                    <ul class="-mb-8">
                        <li v-for="(event, index) in history" :key="event.timestamp">
                            <div class="relative pb-8">
                                <span v-if="index !== history.length - 1"
                                    class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"></span>
                                <div class="relative flex space-x-3">
                                    <div>
                                        <span :class="[
                                            eventIcon(event.action).bg,
                                            'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                                        ]">
                                            <Icon :name="eventIcon(event.action).icon" class="h-4 w-4 text-white" />
                                        </span>
                                    </div>
                                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p class="text-sm text-gray-500">
                                                <span class="font-medium text-gray-900">
                                                    {{ formatAction(event.action) }}
                                                </span>
                                                <template v-if="event.admin">
                                                    by {{ event.admin.username || 'Admin' }}
                                                </template>
                                            </p>
                                            <div v-if="event.changes?.status" class="mt-1 text-xs">
                                                Status changed from
                                                <OrderStatusBadge :status="event.changes.status.from" />
                                                to
                                                <OrderStatusBadge :status="event.changes.status.to" />
                                            </div>
                                            <div v-if="event.reason" class="mt-1 text-xs text-gray-600">
                                                Reason: {{ event.reason }}
                                            </div>
                                        </div>
                                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                                            <time :datetime="event.timestamp">
                                                {{ formatDateTime(event.timestamp) }}
                                            </time>
                                            <div v-if="event.forced" class="mt-1">
                                                <span
                                                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                    Forced
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="event.notes"
                                    class="ml-11 mt-2 mb-4 text-sm bg-gray-50 p-3 rounded border border-gray-200">
                                    <p class="font-medium text-gray-700">Admin Notes:</p>
                                    <p class="text-gray-600">{{ event.notes }}</p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { OrderHistoryResponse, OrderActionType } from '~/utils/types/order.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { formatDateTime, orderIdFormat } from '~/utils/functions/format'
import { eventIcon, formatAction } from '~/utils/functions/orders'

definePageMeta({
    layout: 'admin',
})

const route = useRoute()
const { $api } = useNuxtApp()

const orderId = computed(() => route.params.orderId as string)
const history = ref<OrderHistoryResponse['history']>([])
const currentStatus = ref<string>('')
const lastAction = ref<OrderHistoryResponse['lastAdminAction'] | null>(null)
const isLoading = ref(false)
const error = ref<any>(null)


// Fetch order history
const fetchHistory = async () => {
    try {
        isLoading.value = true
        error.value = null

        const response = await $api.get<OrderHistoryResponse>(ENDPOINTS.ADMIN_ORDERS.GET_ORDER_HISTORY(orderId.value))

        history.value = response.data.history || []
        currentStatus.value = response.data.currentStatus
        lastAction.value = response.data.lastAdminAction

        // Sort by timestamp (newest first)
        history.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } catch (err) {
        error.value = err
        console.error('Failed to fetch order history:', err)
    } finally {
        isLoading.value = false
    }
}

// Initial fetch
onMounted(() => {
    fetchHistory()
})
</script>

<style scoped>
.admin-order-history {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6;
}
</style>