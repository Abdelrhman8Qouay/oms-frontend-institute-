<template>
    <div class="min-h-screen text-black p-6">
        <!-- Header -->
        <div class="header w-full flex flex-col items-center gap-4 bg-white p-4 rounded-lg shadow mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                <Icon name="mdi:chef-hat" mode="svg" size="30" class="stroke-white inline-block" />
                Kitchen Order Management
            </h1>
            <div class="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-6">
                <!-- Sort Dropdown -->
                <select v-model="sortBy" class="p-2 bg-yellow-500 rounded" @change="fetchQueueOrders">
                    <option v-for="col in Object.values(OrderSortBy)" :key="col" :value="col">
                        {{ formatReadableText(col) }}
                    </option>
                </select>

                <!-- Notification Toggle -->
                <button @click="toggleNotificationSound"
                    :title="notificationsEnabled ? 'Disable notification' : 'Enable notification'"
                    class="p-2 bg-yellow-500 rounded flex items-center gap-2">
                    <Icon
                        :name="notificationsEnabled ? 'ic:outline-notifications-active' : 'ic:outline-notifications-none'"
                        size="25" />
                </button>
            </div>
        </div>

        <!-- Kanban Board -->
        <div class="w-full flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-6" v-auto-animate>
            <div v-if="isQueueGetLoading" class="w-full h-full flex justify-center items-center">
                <CommonLoader :prevent-interaction="true" animation-type="fade" />
            </div>
            <div v-else class="flex flex-wrap justify-between gap-3">
                <!-- Pending Orders -->
                <div
                    class="h-max border border-yellow-500 shadow-lg shadow-yellow-500 p-4 rounded-lg md:[flex:1_0_32%] [flex:1_0_30%]">
                    <h2 class="text-base font-semibold mb-4 mt-3">🟡 Pending</h2>
                    <div v-for="order in filteredOrders(OrderStatus.PENDING)" :key="order.id"
                        class="text-base mb-4 p-4 bg-white rounded-lg shadow-md">
                        <ChefOrderCard :order="order" @cancel-order="(id) => orderRequest(id, 'cancel')"
                            @claim-order="(id) => orderRequest(id, 'claim')"
                            @complete-order="(id) => orderRequest(id, 'complete')" />
                    </div>
                </div>

                <!-- In Progress Orders -->
                <div
                    class="h-max border border-blue-500 shadow-lg shadow-blue-500 p-4 rounded-lg md:[flex:1_0_43%] [flex:1_0_66%]">
                    <h2 class="text-xl font-semibold mb-4">🔵 In Progress</h2>
                    <div v-for="order in filteredOrders(OrderStatus.IN_PROGRESS)" :key="order.id"
                        class="mb-4 p-4 bg-white rounded-lg shadow-lg">
                        <ChefOrderCard :order="order" @claim-order="(id) => orderRequest(id, 'claim')"
                            @complete-order="(id) => orderRequest(id, 'complete')" />
                    </div>
                </div>

                <!-- Completed Orders -->
                <div class="h-max border border-green-500 p-4 rounded-lg md:[flex:1_0_20%] [flex:1_0_95%] opacity-60">
                    <h2 class="text-base font-semibold mb-4">✅ Completed</h2>
                    <div v-for="order in filteredOrders(OrderStatus.COMPLETED)" :key="order.id"
                        class="text-base mb-4 p-4 bg-white rounded-lg">
                        <ChefOrderCard :order="order" @claim-order="(id) => orderRequest(id, 'claim')"
                            @complete-order="(id) => orderRequest(id, 'complete')" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Notification Sound -->
        <audio ref="notificationSound" src="/sounds/notify.mp3" preload="auto"></audio>
    </div>
</template>

<script setup lang="ts">
import { OrderStatus, OrderTypes } from '~/utils/types/order.type';
import { useAxios } from '@vueuse/integrations/useAxios.mjs';
import { ENDPOINTS } from '~/utils/constants/apiEndpoints';
import { formatReadableText } from '~/utils/functions/format';
import { UserRole } from '~/utils/types/user.type';
import type { OrderUpdateListened } from '~/utils/types/chef.type';

enum OrderSortBy {
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
    ITEMS_COUNT = 'items_count',
    PRICE = 'price'
}

const { $api } = useNuxtApp(); // Access Axios from plugin

// ===================================== State
const { connectSocket, joinRoom, listenToEvent } = useSocketIo();

const orders = ref<any[]>([]);
const filterStatus = ref('all');
const sortBy = ref<OrderSortBy>(OrderSortBy.CREATED_AT);
const notificationsEnabled = ref(true);

const notificationSound = ref<HTMLAudioElement | null>(null);

// ===================================== Fetch orders with query parameters
const { isLoading: isQueueGetLoading, execute: executeQueueOrders } = useAxios(
    ENDPOINTS.CHEF.GET_ORDER_QUEUE,
    { method: 'GET' },
    $api,
    {
        initialData: [],
        immediate: false,
        onError(err) {
            console.error('Failed to fetch Queue Orders:', err);
            throw err;
        },
        onSuccess(data) {
            orders.value = data;
        },
    }
);

const fetchQueueOrders = async () => {
    const query = {
        status: filterStatus.value === 'all' ? undefined : filterStatus.value,
        sort: sortBy.value,
    };

    await executeQueueOrders({ params: query });
};

// ===================================== Filtered and sorted orders
const filteredOrders = computed(() => (status: string) => {
    return orders.value
        .filter((order) => order.status === status && (filterStatus.value === 'all' || order.type === filterStatus.value))
        .sort((a, b) => {
            if (sortBy.value === OrderSortBy.CREATED_AT) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy.value === OrderSortBy.UPDATED_AT) return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            if (sortBy.value === OrderSortBy.ITEMS_COUNT) return a.items.length - b.items.length;
            if (sortBy.value === OrderSortBy.PRICE) return a.totalPrice - b.totalPrice;
            return 0;
        });
});

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
    await fetchQueueOrders(); // Refresh the order list
};


// Toggle notifications
const toggleNotificationSound = () => {
    notificationsEnabled.value = !notificationsEnabled.value;
};


// ===================================== Lifecycle
onMounted(() => {
    // Fetch the Queue Orders (Initial fetch)
    fetchQueueOrders();

    // Initialize socket connection and listeners
    connectSocket();
    joinRoom([UserRole.CHEF]);

    // Listen for order updates
    listenToEvent('orderUpdate', (update: OrderUpdateListened) => {
        const index = orders.value.findIndex((o) => o.id === update.orderId);
        if (index !== -1) {
            // Update existing order
            orders.value[index] = { ...orders.value[index], ...update };
        } else {
            // Add new order to the end of the queue
            orders.value.push(update?.order);
        }

        console.log('Received order Updates:', update);

        // Play notification sound if enabled
        if (notificationsEnabled.value && notificationSound.value) {
            notificationSound.value.play();
        }
    });
});
</script>