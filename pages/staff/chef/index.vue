<template>
    <div class="min-h-screen bg-gray-900 text-white p-6">
        <!-- Header -->
        <header class="mb-6">
            <h1 class="text-3xl font-bold">Kitchen Order Management</h1>
            <div class="flex space-x-4 mt-4">
                <!-- Filter Dropdown -->
                <select v-model="filterType" class="p-2 bg-gray-700 rounded" @change="fetchQueueOrders">
                    <option value="all">All</option>
                    <option v-for="type in Object.values(OrderTypes)" :key="type" :value="type">
                        {{ formatReadableText(type) }}
                    </option>
                </select>

                <!-- Sort Dropdown -->
                <select v-model="sortBy" class="p-2 bg-gray-700 rounded" @change="fetchQueueOrders">
                    <option v-for="col in Object.values(OrderSortBy)" :key="col" :value="col">
                        {{ formatReadableText(col) }}
                    </option>
                </select>

                <!-- Notification Toggle -->
                <button @click="toggleNotifications" class="p-2 bg-gray-700 rounded flex items-center gap-2">
                    <Icon name="material-symbols-light:notifications-active-outline" size="25" />
                    {{ notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications' }}
                </button>
            </div>
        </header>

        <!-- Kanban Board -->
        <div class="w-full h-max" v-auto-animate>
            <div v-if="isQueueGetLoading" class="w-full h-full flex justify-center items-center">
                <CommonLoader :prevent-interaction="true" animation-type="fade" />
            </div>
            <div v-else class="flex flex-wrap justify-between gap-3">
                <!-- Pending Orders -->
                <div class="bg-gray-800 p-4 rounded-lg md:[flex:1_0_25%] [flex:1_0_30%]">
                    <h2 class="text-base font-semibold mb-4 mt-3">🟡 Pending</h2>
                    <div v-for="order in filteredOrders(OrderStatus.PENDING)" :key="order.id"
                        class="text-base mb-4 p-4 bg-gray-700 rounded-lg">
                        <ChefOrderCard :order="order" @claim-order="claimOrder" @complete-order="completeOrder" />
                    </div>
                </div>

                <!-- In Progress Orders -->
                <div class="bg-gray-800 p-4 rounded-lg md:[flex:1_0_50%] [flex:1_0_66%]">
                    <h2 class="text-xl font-semibold mb-4">🔵 In Progress</h2>
                    <div v-for="order in filteredOrders(OrderStatus.IN_PROGRESS)" :key="order.id"
                        class="mb-4 p-4 bg-gray-700 rounded-lg">
                        <ChefOrderCard :order="order" @claim-order="claimOrder" @complete-order="completeOrder" />
                    </div>
                </div>

                <!-- Completed Orders -->
                <div class="bg-gray-800 p-4 rounded-lg md:[flex:1_0_20%] [flex:1_0_95%]">
                    <h2 class="text-base font-semibold mb-4">✅ Completed</h2>
                    <div v-for="order in filteredOrders(OrderStatus.COMPLETED)" :key="order.id"
                        class="text-base mb-4 p-4 bg-gray-700 rounded-lg">
                        <ChefOrderCard :order="order" @claim-order="claimOrder" @complete-order="completeOrder" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Notification Sound -->
        <audio ref="notificationSound" src="/sounds/chef_notification.mp3" preload="auto"></audio>
    </div>
</template>

<script setup lang="ts">
import { OrderSortBy, OrderStatus, OrderTypes } from '~/utils/types/order.type';
import { useAxios } from '@vueuse/integrations/useAxios.mjs';
import { ENDPOINTS } from '~/utils/constants/apiEndpoints';
import { formatReadableText } from '~/utils/functions/format';
import { UserRole } from '~/utils/types/user.type';
import type { OrderUpdateListened } from '~/utils/types/chef.type';

const { $api } = useNuxtApp(); // Access Axios from plugin

// ===================================== State
const { isConnected, connectSocket, joinRoom, listenToEvent } = useSocketIo();
const orders = ref<any[]>([]);
const filterType = ref('all');
const sortBy = ref<OrderSortBy>(OrderSortBy.CREATED_AT);
const notificationsEnabled = ref(true);
const notificationSound = ref<HTMLAudioElement | null>(null);

// Fetch orders with query parameters
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
        status: filterType.value === 'all' ? undefined : filterType.value,
        sort: sortBy.value,
    };

    await executeQueueOrders({ params: query });
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

// ===================================== Filtered and sorted orders
const filteredOrders = computed(() => (status: string) => {
    return orders.value
        .filter((order) => order.status === status && (filterType.value === 'all' || order.type === filterType.value))
        .sort((a, b) => {
            if (sortBy.value === OrderSortBy.CREATED_AT) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy.value === OrderSortBy.UPDATED_AT) return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            if (sortBy.value === OrderSortBy.ITEMS_COUNT) return a.items.length - b.items.length;
            if (sortBy.value === OrderSortBy.PRICE) return a.totalPrice - b.totalPrice;
            return 0;
        });
});

// Claim an order
const claimOrder = async (orderId: string) => {
    await useAxios(ENDPOINTS.CHEF.CLAIM_ORDER(orderId), { method: 'PATCH' }, $api, {
        initialData: null,
        immediate: true,
        onError(err) {
            console.error('Failed to order Claim request:', err);
            throw err;
        }
    })
    await fetchQueueOrders(); // Refresh the order list
};

// Complete an order
const completeOrder = async (orderId: string) => {
    await useAxios(ENDPOINTS.CHEF.COMPLETE_ORDER(orderId), { method: 'PATCH' }, $api, {
        initialData: null,
        immediate: true,
        onError(err) {
            console.error('Failed to order Complete request:', err);
            throw err;
        }
    })
    await fetchQueueOrders(); // Refresh the order list
};

// Toggle notifications
const toggleNotifications = () => {
    notificationsEnabled.value = !notificationsEnabled.value;
};
</script>