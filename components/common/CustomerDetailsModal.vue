<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Customer Details</h2>

            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <!-- Name Input -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input v-model="cashierStore.customerDetails.name" type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <!-- Phone Input -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Phone</label>
                        <input v-model="cashierStore.customerDetails.phone" type="tel"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>

                    <!-- Address Input -->
                    <div v-if="cashierStoreRef.isDelivery">
                        <label class="block text-sm font-medium text-gray-700">Delivery Address</label>
                        <textarea v-model="cashierStore.customerDetails.address" rows="3"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                </div>

                <!-- Form Actions -->
                <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" class="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                        @click="emits('close')">
                        Cancel
                    </button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCashierStore } from '~/stores/cashier.store';
import { storeToRefs } from 'pinia';
import type { CustomerDetails } from '~/utils/types/cashier.type';
const cashierStore = useCashierStore()
const cashierStoreRef = storeToRefs(cashierStore)

const emits = defineEmits<{
    (e: 'close'): void
    (e: 'submit', details: CustomerDetails): void
}>()

function handleSubmit() {
    emits('submit', cashierStore.customerDetails)
}
</script>