<template>
    <div class="space-y-2">
        <h3 class="font-semibold">Order {{ orderIdFormat(order.id) }} </h3>
        <h3 class="font-semibold">Daily Queue Number:
            {{ order.dailyQueueNumber }}
        </h3>
        <div :class="typeBadgeClass(order.type)">Type: {{ formatType(order.type) }}</div>
        <div>Items: <div v-for="(item, index) in order.items" :key="index"
                class="inline-block rounded-md mr-2 p-1 bg-gray-500 text-white text-[11px]">
                {{
                    formatReadableText(item.name) }} x{{ item.quantity }}</div>
        </div>
        <p>Total: ${{ fixedFraction(order.totalPrice, 2) }}</p>
        <div class="text-sm text-gray-500 flex items-center gap-2">
            <Icon name="mdi:clock-time-four-outline" />
            <span>
                {{ formatDateTime(order.createdAt) }}
                ({{ timeSince(order.createdAt) }} ago)
            </span>
        </div>
        <div class="flex space-x-2 text-white">
            <div v-if="order.status === OrderStatus.PENDING" class="w-full flex justify-between gap-2">
                <button class="px-2 py-1 bg-blue-600 rounded" @click="$emit('claim-order', order.id)">
                    Claim Order
                </button>
                <button @click.prevent="isModalOpen = true" class="px-2 py-1 bg-red-600 rounded"
                    title="enable to delete pending order">
                    Cancel
                </button>
            </div>
            <button v-if="order.status === OrderStatus.IN_PROGRESS" class="px-2 py-1 bg-green-600 rounded"
                @click="$emit('complete-order', order.id)">
                Complete Order
            </button>
        </div>


        <div v-if="order.status === OrderStatus.PENDING" v-show="isModalOpen"
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
                        <div class="text-sm text-gray-500">Created In: {{ formatDate(order.createdAt) }} > {{
                            timeSince(order.createdAt)
                            }} ago</div>

                    </div>

                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button type="button" @click="isModalOpen = false"
                            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                            Go Back
                        </button>
                        <button type="button" @click="cancelOrder"
                            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm bg-orange-600 hover:bg-orange-700">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { fixedFraction, formatDate, formatDateTime, formatReadableText, orderIdFormat, timeSince } from '~/utils/functions/format';
import { formatType, typeBadgeClass } from '~/utils/functions/orders';
import { OrderStatus, type OrderObject } from '~/utils/types/order.type';
import { UserRole } from '~/utils/types/user.type';

const props = defineProps({
    order: {
        type: Object as PropType<OrderObject>,
        required: true,
    },
});

console.log(props.order.items)
const emits = defineEmits(['claim-order', 'complete-order', 'cancel-order']);

const isModalOpen = ref(false)

const cancelOrder = () => {
    emits('cancel-order', props.order?.id)
    isModalOpen.value = false
}
</script>