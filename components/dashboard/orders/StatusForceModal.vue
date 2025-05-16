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
                        Force Order Status
                    </h3>

                    <p class="text-sm text-gray-500 mb-4">
                        This action will bypass normal order validation rules. Please provide a reason for this
                        override.
                    </p>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="status" class="w-full rounded-md border-gray-300 shadow-sm">
                            <option v-for="s in orderStatuses" :key="s" :value="s">
                                {{ formatStatus(s) }}
                            </option>
                        </select>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Force Status Reason</label>
                        <textarea v-model="reason" rows="3" class="w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Explain why this override is necessary..." required></textarea>
                    </div>

                    <div class="flex items-center">
                        <input v-model="forceAction" type="checkbox" id="forceAction"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="forceAction" class="ml-2 block text-sm text-gray-700">
                            Force this action (bypass all validations)
                        </label>
                    </div>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" @click="submit"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm">
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
import { formatStatus } from '~/utils/functions/orders'
import { OrderStatus } from '~/utils/types/order.type'

const orderStatuses = Object.values(OrderStatus)

const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'submit'])

const status = ref(props.order.status)

const reason = ref('')
const forceAction = ref(false)


const submit = () => {
    emit('submit', {
        status: status.value,
        reason: reason.value,
        force: forceAction.value
    })
}
</script>