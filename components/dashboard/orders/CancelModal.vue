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
                        Cancel Order {{ orderIdFormat(order.id) }}
                    </h3>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation</label>
                        <textarea v-model="reason" rows="3" class="w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Enter cancellation reason..." required></textarea>
                    </div>

                    <div class="flex items-center">
                        <input v-model="issueRefund" type="checkbox" id="issueRefund"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                        <label for="issueRefund" class="ml-2 block text-sm text-gray-700">
                            Issue refund to customer
                        </label>
                    </div>
                </div>

                <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="button" @click="submit" :disabled="!reason" :class="{
                        'bg-red-600 hover:bg-red-700': !issueRefund,
                        'bg-purple-600 hover:bg-purple-700': issueRefund,
                        'opacity-50 cursor-not-allowed': !reason
                    }"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm">
                        {{ issueRefund ? 'Cancel & Refund' : 'Cancel Order' }}
                    </button>
                    <button type="button" @click="$emit('close')"
                        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { orderIdFormat } from '~/utils/functions/format'

const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['close', 'submit'])

const reason = ref('')
const issueRefund = ref(false)

const submit = () => {
    if (!reason.value) return

    emit('submit', {
        reason: reason.value,
        refund: issueRefund.value
    })
}
</script>