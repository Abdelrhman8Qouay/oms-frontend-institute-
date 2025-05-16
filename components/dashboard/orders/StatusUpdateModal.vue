<template>
    <div class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div
                class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Update Order Status
                    </h3>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <div class="w-full flex gap-4">
                            <span :class="statusBadgeClass(currentStatus)">{{ formatStatus(currentStatus) }}</span>
                            <span class="bin">
                                <Icon name="mdi:hand-pointing-right" size="25" />
                            </span>
                            <select v-model="newStatus" class="rounded-md border-gray-300 shadow-sm">
                                <option v-for="(s, i) in validTransitions[currentStatus]" :key="i" :value="s"
                                    :class="statusBadgeClass(s)">
                                    {{ formatStatus(s) }}
                                </option>
                            </select>
                            <span class="text-sm font-medium text-gray-700 mb-1">Valid Transitions</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                        <textarea v-model="notes" rows="3"
                            class="w-full rounded-md border-gray-300 shadow-sm"></textarea>
                    </div>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button :disabled="!newStatus" type="button" @click="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm">
                        Update
                    </button>
                    <button type="button" @click="$emit('close')"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatStatus, statusBadgeClass } from '~/utils/functions/orders'
import { OrderStatus } from '~/utils/types/order.type'

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [
        OrderStatus.IN_PROGRESS,
        OrderStatus.CANCELED,
        OrderStatus.FAILED,
    ],
    [OrderStatus.IN_PROGRESS]: [
        OrderStatus.COMPLETED,
        OrderStatus.CANCELED,
        OrderStatus.FAILED,
    ],
    [OrderStatus.COMPLETED]: [
        OrderStatus.DELIVERED,
        OrderStatus.CANCELED,
        OrderStatus.FAILED,
    ],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELED]: [],
    [OrderStatus.FAILED]: []
}


const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'submit'])

const currentStatus = ref<OrderStatus>(props.order.status)
const newStatus = ref()

const notes = ref(props.order.adminNotes || '')

const submit = () => {
    emit('submit', {
        status: newStatus.value,
        notes: notes.value
    })
}
</script>

<style lang="scss">
.bin {
    position: relative;
    animation: both infinite ease-in-out;
}

@keyframes both {
    from {
        transform: translateX(-50%);
    }

    to {
        transform: translateX(50%);
    }
}
</style>