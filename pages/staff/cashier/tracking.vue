<template>
    <div class="min-h-screen bg-gray-50 p-4 md:p-6">
        <!-- Page Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                <Icon name="material-symbols-light:conversion-path" mode="svg" size="30"
                    class="stroke-current inline-block" />
                Order Tracking
            </h1>
            <div class="flex items-center gap-2">
                <input v-model="orderIdInput" type="text" placeholder="Enter Order ID"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    @keyup.enter="fetchOrder" />
                <button @click="fetchOrder"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Icon name="mdi:magnify" class="w-4 h-4" />
                    <span>Search</span>
                </button>
            </div>
        </div>

        <!-- Page Content -->
        <div class="flex">
            <!-- Order Details Tracking -->
            <div class="[flex:1_0_70%]">
                <!-- Loading State -->
                <div v-if="isOrderLoading" class="flex justify-center items-center h-64">
                    <CommonLoader :is-full-screen="false" />
                </div>

                <!-- Error State -->
                <div v-else-if="orderError" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
                    <div class="flex items-center gap-2">
                        <Icon name="ic:baseline-warning" class="text-red-600" />
                        <span>{{ orderError.message || 'Failed to load order details' }}</span>
                    </div>
                    <button @click="fetchOrder" class="mt-2 text-sm text-blue-600 hover:text-blue-800">
                        Try again
                    </button>
                </div>

                <!-- Empty/Initial State -->
                <div v-else-if="!order"
                    class="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Icon name="mdi:receipt-text-outline" class="w-16 h-16 text-gray-400 mb-4" />
                    <h3 class="text-lg font-medium text-gray-700 mb-2">
                        No order selected
                    </h3>
                    <p class="text-gray-500 text-center max-w-md">
                        Enter an order ID above to track its status, view items, and manage
                        payment.
                    </p>
                </div>

                <!-- Order Details -->
                <div v-else class="space-y-6">
                    <!-- Order Header -->
                    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-xl font-bold text-gray-800">
                                    Order #{{ order.id }}
                                </h2>
                                <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <div class="flex items-center gap-1">
                                        <Icon name="mdi:clock-time-four-outline" class="w-4 h-4" />
                                        <span>
                                            {{ formatDateTime(order.createdAt) }}
                                            ({{ timeSince(order.createdAt) }} ago)
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Icon name="mdi:account" class="w-4 h-4" />
                                        <span>
                                            {{ order.customerDetails?.name || 'Guest' }} •
                                            <!-- {{ order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout' }} -->
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="px-3 py-1 rounded-full text-sm font-medium"
                                :class="statusBadgeClass(order.status)">
                                {{ formatStatus(order.status) }}
                            </div>
                        </div>
                    </div>


                    <!-- Order Timeline -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
                            <h3 class="font-medium text-gray-700">Order Progress</h3>
                        </div>
                        <div class="p-4">
                            <div class="relative">
                                <!-- Timeline line -->
                                <div class="absolute left-4 top-0 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>

                                <ul class="space-y-6">
                                    <li v-for="(event, index) in orderTimeline" :key="index" class="relative pl-8">
                                        <div class="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full"
                                            :class="{
                                                'bg-blue-100 text-blue-600': event.isCurrent,
                                                'bg-green-100 text-green-600': event.isCompleted,
                                                'bg-gray-100 text-gray-400': !event.isCompleted,
                                            }">
                                            <Icon :name="event.isCompleted
                                                ? 'mdi:check-all'
                                                : event.isCurrent
                                                    ? 'mdi:clock-time-four-outline'
                                                    : 'mdi:clock-time-eleven'
                                                " class="w-4 h-4" />
                                        </div>
                                        <div class="flex flex-col min-w-0">
                                            <h4 class="text-sm font-medium" :class="{
                                                'text-gray-900': event.isCurrent || event.isCompleted,
                                                'text-gray-500': !event.isCompleted && !event.isCurrent,
                                            }">
                                                {{ event.status }}
                                            </h4>
                                            <p class="text-sm text-gray-500">
                                                {{ event.timestamp ? formatDateTime(event.timestamp) : 'Pending' }}
                                                <template v-if="event.timestamp">
                                                    ({{ timeSince(event.timestamp) }} ago)
                                                </template>
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Order Actions -->

                    <div class="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <div class="flex flex-wrap gap-3 justify-between">
                            <button @click.prevent="isModalOpen = true" class="px-2 py-1 bg-red-600 rounded"
                                title="enable to delete pending order">
                                Cancel
                            </button>
                            <!-- <div class="flex items-center gap-2">
                                <Icon name="credit-card" class="w-5 h-5" :class="{
                                    'text-green-600': order.paymentStatus === 'PAID',
                                    'text-gray-500': order.paymentStatus !== 'PAID',
                                }" />
                                <span class="font-medium">
                                    Payment:
                                    <span :class="{
                                        'text-green-600': order.paymentStatus === 'PAID',
                                        'text-yellow-600': order.paymentStatus === 'PENDING',
                                        'text-red-600': order.paymentStatus === 'FAILED',
                                    }">
                                        {{ formatReadableText(order.paymentStatus) }}
                                    </span>
                                </span>
                            </div> -->
                            <!-- <div class="flex gap-2">
                                <button v-if="order.paymentStatus !== 'PAID'" @click="markAsPaid"
                                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                    :disabled="isMarkingPaid">
                                    <CommonLoader v-if="isMarkingPaid" :is-full-screen="false" size="16px"
                                        color="#ffffff" />
                                    <span v-else>
                                        <Icon name="check-circle" class="w-4 h-4" />
                                        Mark as Paid
                                    </span>
                                </button>
                                <button v-if="order.status === OrderStatus.COMPLETED" @click="notifyCustomer"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    :disabled="isNotifying">
                                    <CommonLoader v-if="isNotifying" :is-full-screen="false" size="16px"
                                        color="#ffffff" />
                                    <span v-else>
                                        <Icon name="bell" class="w-4 h-4" />
                                        Notify Customer
                                    </span>
                                </button>
                                <button
                                    v-if="order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELED"
                                    @click="completeOrder"
                                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    :disabled="isCompleting">
                                    <CommonLoader v-if="isCompleting" :is-full-screen="false" size="16px"
                                        color="#ffffff" />
                                    <span v-else>
                                        <Icon name="check" class="w-4 h-4" />
                                        Complete Order
                                    </span>
                                </button>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Show All Orders -->
            <div class="[flex:1_0_25%] border-l border-l-black/20 h-screen">
                <!-- Filters -->
                <div class="w-full flex gap-2 p-2 shadow mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Orders Day</label>
                        <select v-model="filters.period" class="w-full rounded-md border-gray-300 shadow-sm">
                            <option v-for="opt in ['all', 'today']" :key="opt" :value="opt">
                                {{ opt }}
                            </option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button @click="applyFilters"
                            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            Apply
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <CommonLoader v-if="isOrdersLoading" />

                <!-- Error State -->
                <div v-else-if="ordersError" class="p-4 bg-red-100 text-red-800 rounded-lg mb-6">
                    Failed to load orders: {{ ordersError?.message || "Unknown error" }}
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
                <div v-else class="bg-white rounded-lg shadow w-full">
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
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="order in orders" :key="order.id"
                                    class="hover:bg-gray-200 cursor-pointer select-none"
                                    @click="orderIdInput = order.id">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {{ orderIdFormat(order.id) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ order.customerDetails?.name || 'Guest' }}
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
                                        {{ formatDate(order.createdAt) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <CommonPagination :total-items="totalItems" :page-size="pageSize" v-model="currentPage"
                        @page-change="fetchOrders()" @per-change="(pageSize) => handlePerPageChange(pageSize)" />
                </div>
            </div>
        </div>


        <div v-if="order && order.status === OrderStatus.PENDING" v-show="isModalOpen"
            class="fixed inset-0 overflow-y-auto z-50">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div class="flex justify-center items-center flex-col text-gray-900">

                        <h3 class="text-xl leading-6 font-bold text-blue-500 mb-4">
                            Are you sure you want to Cancel this Order?
                        </h3>
                        <div class="text-md mb-4 flex flex-col items-center">
                            <div># {{ order.id }}</div>
                            <div>{{ order.customer?.username || order.customerDetails?.name
                                || UserRole.GUEST
                                }}</div>
                            <div>${{ fixedFraction(order.totalPrice, 2) }}</div>
                        </div>
                        <p class="text-sm text-gray-500">
                            {{ order.createdAt ? formatDateTime(order.createdAt) : 'Pending' }}
                            <template v-if="order.createdAt">
                                ({{ timeSince(order.createdAt) }} ago)
                            </template>
                        </p>

                    </div>

                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button type="button" @click="isModalOpen = false"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                            Go Back
                        </button>
                        <button type="button" @click="orderRequest(order.id, 'cancel')"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm bg-orange-600 hover:bg-orange-700">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Notification Sound -->
        <audio ref="notificationSound" src="/sounds/bonk.mp3" preload="auto"></audio>
    </div>
</template>

<script setup lang="ts">
import { OrderStatus, OrderTypes, /* PaymentStatus */ } from '~/utils/types/order.type'
import { ENDPOINTS } from '~/utils/constants/apiEndpoints'
import { fixedFraction, formatDate, formatDateTime, formatReadableText, orderIdFormat, timeSince } from '~/utils/functions/format'
import type { OrderObject } from '~/utils/types/order.type'
import { useAxios } from '@vueuse/integrations/useAxios.mjs'
import { UserRole } from '~/utils/types/user.type'
import { formatStatus, formatType, statusBadgeClass, typeBadgeClass } from '~/utils/functions/orders'

const { $api } = useNuxtApp()

definePageMeta({
    layout: 'cashier',
})

interface UpdatedOrder {
    order: OrderObject
    orderId: string
    status: OrderStatus
    targetRoom: string
    timestamp: string | Date
}

// Order ID input
const orderIdInput = ref('')
const prevRoomName = ref('')

// Order data state
const order = ref<OrderObject | null>(null)
const isOrderLoading = ref(false)
const orderError = ref<any>(null)
const isModalOpen = ref(false)

const orders = ref<any[]>([])
const isOrdersLoading = ref(false)
const ordersError = ref<any>(null)

// Action states
// const isMarkingPaid = ref(false)
// const isNotifying = ref(false)
// const isCompleting = ref(false)

// Notification sound
const notificationSound = ref<HTMLAudioElement | null>(null)

// Socket.IO
const { isConnected, connectSocket, joinOrderRoom, listenToEvent, leaveRoom } = useSocketIo()

// Computed timeline based on order status
const orderTimeline = computed(() => {
    if (!order.value) return []

    const timeline = [
        {
            status: 'Order Received',
            isCompleted: true,
            isCurrent: false,
            timestamp: order.value.createdAt,
        },
        {
            status: 'Preparing',
            isCompleted: [OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED].includes(order.value.status),
            isCurrent: order.value.status === OrderStatus.IN_PROGRESS,
            timestamp: order.value.updatedAt,
        },
        {
            status: 'Ready for Pickup',
            isCompleted: order.value.status === OrderStatus.COMPLETED,
            isCurrent: false,
            // timestamp: order.value.completedAt,
        },
        // {
        //     status: 'Payment Collected',
        //     isCompleted: order.value.paymentStatus === 'PAID',
        //     isCurrent: false,
        //     timestamp: order.value.paymentDate,
        // },
        {
            status: 'Order Completed',
            isCompleted: order.value.status === OrderStatus.COMPLETED,
            isCurrent: false,
            // timestamp: order.value.completedAt,
        },
    ]

    return timeline
})


// Fetch order details
const fetchOrder = async () => {
    if (!orderIdInput.value.trim()) {
        orderError.value = new Error('Please enter an order ID')
        return
    }

    isOrderLoading.value = true
    orderError.value = null

    try {
        const res = await $api.get(
            ENDPOINTS.CASHIER.GET_ORDER_DETAILS(orderIdInput.value.trim()),
            { method: 'GET' }
        )

        order.value = res.data

        // Check previous room name to leave it
        if (prevRoomName.value) {
            leaveRoom(prevRoomName.value, 'leaveRoom')
        }

        // Setup Socket Listener
        setupSocketListeners(order.value?.id as string)
    } catch (err) {
        orderError.value = err as Error
        order.value = null
        console.error('Failed to fetch order:', err)
    } finally {
        isOrderLoading.value = false
    }
}

// Setup socket listeners for real-time updates
const setupSocketListeners = (orderId: string) => {
    if (!order.value) return

    connectSocket()
    prevRoomName.value = joinOrderRoom(orderId || order.value.id, 'joinOrderRoom')

    listenToEvent('orderUpdate', (updatedOrder: UpdatedOrder) => {
        console.log('Order Updated: ', updatedOrder)
        order.value = updatedOrder.order
        playNotificationSound()
    })

    // listenToEvent('paymentUpdate', (data: { orderId: string; paymentStatus: string }) => {
    //     if (data.orderId === order.value?.id && order.value) {
    //         order.value.paymentStatus = data.paymentStatus
    //         playNotificationSound()
    //     }
    // })
}

// Play notification sound
const playNotificationSound = () => {
    if (notificationSound.value) {
        notificationSound.value.play().catch((e) => {
            console.warn('Audio playback failed:', e)
        })
    }
}

// Mark order as paid
// const markAsPaid = async () => {
//     if (!order.value) return

//     isMarkingPaid.value = true

//     try {
//         await useAxios(
//             ENDPOINTS.CASHIER.MARK_AS_PAID(order.value.id),
//             { method: 'PATCH' },
//             $api,
//             {
//                 immediate: true,
//                 onError(err: any) {
//                     throw new Error(err.response?.data?.message || 'Failed to mark order as paid')
//                 },
//             }
//         )

//         if (order.value) {
//             order.value.paymentStatus = 'PAID'
//         }
//     } catch (err) {
//         error.value = err as Error
//     } finally {
//         isMarkingPaid.value = false
//     }
// }

// Notify customer
// const notifyCustomer = async () => {
//     if (!order.value) return

//     isNotifying.value = true

//     try {
//         await useAxios(
//             ENDPOINTS.CASHIER.NOTIFY_CUSTOMER(order.value.id),
//             { method: 'POST' },
//             $api,
//             {
//                 immediate: true,
//                 onError(err) {
//                     throw new Error(err.response?.data?.message || 'Failed to notify customer')
//                 },
//             }
//         )
//     } catch (err) {
//         error.value = err as Error
//     } finally {
//         isNotifying.value = false
//     }
// }

// Order status and type options


// Filters
const filters = reactive({
    period: 'all' as string,
})

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)

const handlePerPageChange = (size: number) => {
    pageSize.value = size
    fetchOrders()
}


// Fetch orders
const fetchOrders = async () => {
    try {
        isOrdersLoading.value = true
        ordersError.value = null

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

        const response = await $api.get(ENDPOINTS.CASHIER.GET_ORDERS, { params })
        orders.value = response.data.data
        totalItems.value = response.data.meta.total
    } catch (err: any) {
        ordersError.value = err
        console.error('Failed to fetch orders:', err)
    } finally {
        isOrdersLoading.value = false
    }
}


// Apply filters
const applyFilters = () => {
    currentPage.value = 1
    fetchOrders()
}

const cleanupOrderPage = () => {
    orderIdInput.value = ''
    order.value = null
    applyFilters()
}

// ===================================== order Requests
type orderRequestTypes = 'claim' | 'complete' | 'cancel'
const orderRequest = async (orderId: string, request: orderRequestTypes) => {
    const requestMap = {
        'claim': ENDPOINTS.CHEF.CLAIM_ORDER(orderId),
        'complete': ENDPOINTS.CHEF.COMPLETE_ORDER(orderId),
        'cancel': ENDPOINTS.CHEF.CANCEL_ORDER(orderId),
    }

    if (!requestMap[request]) return
    await useAxios(requestMap[request], { method: 'PATCH' }, $api, {
        initialData: null,
        immediate: true,
        onError(err) {
            console.error(`Failed to order ${request} request:`, err);
            throw err;
        }
    })

    cleanupOrderPage(); // Refresh the order details
};


// Initial fetch
onMounted(() => {
    fetchOrders()
})

// Watch for pagination changes
watch(currentPage, () => {
    fetchOrders()
})
</script>

<style scoped>
/* Custom transitions for smoother UI updates */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>